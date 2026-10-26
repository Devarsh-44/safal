'use client';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { Ink } from './Marks';

/*
 * Page change as graph paper being coloured in (after the pixel transition on labs.chaingpt.org, made
 * for a school): rounded squares fill the screen in a sweep, the page name is written in the middle,
 * then the squares clear to show the new page. Going forward sweeps left to right like writing; going
 * back (browser Back, the logo, or a link to an earlier page) sweeps right to left.
 */

// Notebook order decides the direction. Unknown pages count as "after" everything listed.
const ORDER = ['/', '/admissions', '/academics', '/campus', '/life', '/about', '/contact', '/careers'];
// Each page's colour field, and the ink that reads on it.
const COLORS = { '/': ['#F7B928', '#241D5C'], '/admissions': ['#4AB3EC', '#241D5C'] };
const FALLBACK = ['#241D5C', '#FFFFFF'];

const SWEEP = 300; // ms for the sweep to cross the screen
const SCATTER = 110; // ms of randomness so it feels hand-made, not mechanical
const CELL = 300; // ms each square takes to fill or clear
const HOLD = 200; // ms the page name stays on a fully covered screen

const rank = (p) => { const i = ORDER.indexOf(p); return i < 0 ? ORDER.length : i; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function PageTransition() {
  const router = useRouter();
  const path = usePathname();
  const { t } = useLang();
  const grid = useRef(null);
  const s = useRef({ busy: false, pending: null, from: path });
  const [size, setSize] = useState({ cols: 0, rows: 0 });
  const [view, setView] = useState({ on: false, covered: false, bg: FALLBACK[0], fg: FALLBACK[1], label: '' });

  const labelFor = useCallback((p) => {
    if (p === '/') return t.v3.home;
    if (p === '/admissions') return t.v3.adm.crumb;
    return t.v3.nav.find(([href]) => href.split('#')[0] === p)?.[1] ?? '';
  }, [t]);

  useEffect(() => {
    const fit = () => {
      // Bigger squares mean fewer of them to animate: about 130 on a laptop, 80 on a phone.
      const cell = window.innerWidth < 700 ? 64 : 104;
      setSize({ cols: Math.ceil(window.innerWidth / cell), rows: Math.ceil(window.innerHeight / cell) });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  /** Fills (`cover`) or clears the squares, sweeping in `dir` (1 = left to right). `instant` skips the animation. */
  const run = useCallback((kind, dir, instant = false) => {
    const cells = grid.current ? [...grid.current.children] : [];
    const { cols, rows } = size;
    // Transform only, so the animation runs on the compositor and stays smooth while the next page loads.
    const frames = [{ transform: 'scale(0) rotate(-18deg)' }, { transform: 'scale(1.04) rotate(0deg)' }];
    const anims = cells.map((el, i) => {
      const x = cols > 1 ? (i % cols) / (cols - 1) : 0;
      const y = rows > 1 ? Math.floor(i / cols) / (rows - 1) : 0;
      const along = dir > 0 ? x : 1 - x;
      const delay = instant ? 0 : along * SWEEP + y * 70 + Math.random() * SCATTER;
      el.getAnimations().forEach((a) => a.cancel());
      return el.animate(kind === 'cover' ? frames : [...frames].reverse(), { duration: instant ? 0 : CELL, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    });
    // If the browser stops drawing frames (a hidden tab, a busy phone), carry on after the planned time
    // and snap only the still-running squares to their end, so the page is never left covered. The timer
    // is cleared once the squares finish, so it can never bring back squares a later step has cleared.
    let timer;
    const limit = new Promise((resolve) => {
      timer = setTimeout(() => {
        anims.forEach((a) => { if (a.playState === 'running' || a.playState === 'pending') a.finish(); });
        resolve();
      }, instant ? 50 : SWEEP + SCATTER + 70 + CELL + 250);
    });
    const done = Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => clearTimeout(timer));
    return Promise.race([done, limit]);
  }, [size]);

  const reveal = useCallback(async (dir, hold) => {
    if (hold) await wait(hold);
    setView((v) => ({ ...v, covered: false }));
    await run('reveal', dir);
    (grid.current ? [...grid.current.children] : []).forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
    setView((v) => ({ ...v, on: false }));
    s.current.busy = false;
    s.current.pending = null;
  }, [run]);

  // Intercept clicks on links to another page of the site.
  useEffect(() => {
    const onClick = async (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname || url.pathname.startsWith('/admin')) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      const st = s.current;
      if (st.busy) return;
      st.busy = true;
      const dir = rank(url.pathname) < rank(window.location.pathname) ? -1 : 1;
      const [bg, fg] = COLORS[url.pathname] ?? FALLBACK;
      // Start fetching the next page now, so it is ready by the time the screen is covered.
      router.prefetch(url.pathname);
      flushSync(() => setView({ on: true, covered: false, bg, fg, label: labelFor(url.pathname) }));
      await run('cover', dir);
      setView((v) => ({ ...v, covered: true }));
      st.pending = { target: url.pathname, dir };
      router.push(url.pathname + url.search + url.hash);
      // Never leave the screen covered if the page is slow or the navigation fails.
      setTimeout(() => { if (s.current.pending?.target === url.pathname) reveal(dir, 0); }, 5000);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [labelFor, reveal, router, run]);

  // A new page has rendered. Runs before paint, so Back/Forward can cover the screen with no flash.
  useLayoutEffect(() => {
    const st = s.current;
    if (path === st.from) return;
    const prev = st.from;
    st.from = path;
    // The hold gives the new page time to paint under the cover before it is revealed.
    if (st.pending && st.pending.target === path) {
      reveal(st.pending.dir, HOLD);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Browser Back/Forward: the new page is already here, so start fully coloured and wipe it away.
    st.busy = true;
    const dir = rank(path) < rank(prev) ? -1 : 1;
    const [bg, fg] = COLORS[path] ?? FALLBACK;
    setView({ on: true, covered: true, bg, fg, label: labelFor(path) });
    run('cover', dir, true);
    reveal(dir, HOLD);
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  // The squares only change when the window is resized, never during a transition.
  const cells = useMemo(() => Array.from({ length: size.cols * size.rows }, (_, i) => <span key={i} className="pt-cell" />), [size]);
  return (
    <div className={'pt' + (view.on ? ' on' : '') + (view.covered ? ' covered' : '')} style={{ '--pt-bg': view.bg, '--pt-fg': view.fg, '--cols': size.cols, '--rows': size.rows }} aria-hidden="true">
      <div className="pt-grid" ref={grid}>{cells}</div>
      <div className="pt-paper" />
      <p className="pt-label">
        <span className="mk mk-squiggle">{view.label}<Ink kind="squiggle" color="var(--pt-fg)" width={5} play={view.covered} /></span>
      </p>
    </div>
  );
}
