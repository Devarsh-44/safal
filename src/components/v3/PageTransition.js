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
const COLORS = { '/': ['#F7B928', '#241D5C'], '/admissions': ['#4AB3EC', '#241D5C'], '/academics': ['#34B470', '#241D5C'], '/campus': ['#EE7A43', '#241D5C'], '/life': ['#E0453F', '#FFFFFF'], '/about': ['#8B6CF0', '#FFFFFF'], '/contact': ['#14B8A6', '#241D5C'], '/careers': ['#EC5F9A', '#FFFFFF'] };
const FALLBACK = ['#241D5C', '#FFFFFF'];

// Where each page's name lives in t.v3, for the label written on the coloured screen.
const CRUMB = { '/admissions': 'adm', '/academics': 'acad', '/campus': 'camp', '/life': 'lp', '/about': 'ab', '/contact': 'ct', '/careers': 'cr' };

const SWEEP = 300; // ms for the sweep to cross the screen
const SCATTER = 110; // ms of randomness so it feels hand-made, not mechanical
const CELL = 300; // ms each square takes to fill or clear
const HOLD = 200; // ms the page name stays on a fully covered screen
const PATIENCE = 12000; // ms to stay covered waiting for a slow page (the dev server builds pages on first visit)

const rank = (p) => { const i = ORDER.indexOf(p); return i < 0 ? ORDER.length : i; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Bigger squares mean fewer of them to animate: about 130 on a laptop, 80 on a phone.
const gridFor = () => {
  const w = window.innerWidth || document.documentElement.clientWidth;
  const h = window.innerHeight || document.documentElement.clientHeight;
  const cell = w < 700 ? 64 : 104;
  return { cols: Math.ceil(w / cell), rows: Math.ceil(h / cell) };
};

export default function PageTransition() {
  const router = useRouter();
  const path = usePathname();
  const { t } = useLang();
  const grid = useRef(null);
  const s = useRef({ busy: false, pending: null, from: path });
  const [size, setSize] = useState({ cols: 0, rows: 0 });
  const [view, setView] = useState({ on: false, covered: false, waiting: false, bg: FALLBACK[0], fg: FALLBACK[1], label: '' });

  const labelFor = useCallback((p) => {
    if (p === '/') return t.v3.home;
    if (CRUMB[p]) return t.v3[CRUMB[p]].crumb;
    return t.v3.nav.find(([href]) => href.split('#')[0] === p)?.[1] ?? '';
  }, [t]);

  useEffect(() => {
    const fit = () => setSize(gridFor());
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Start loading a page as soon as a link to it is hovered or touched, so it's ready when the screen is covered.
  useEffect(() => {
    const seen = new Set();
    const warm = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith('/admin') || seen.has(url.pathname)) return;
      seen.add(url.pathname);
      router.prefetch(url.pathname);
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('touchstart', warm, { passive: true });
    return () => { document.removeEventListener('pointerover', warm); document.removeEventListener('touchstart', warm); };
  }, [router]);

  /** Fills (`cover`) or clears the squares, sweeping in `dir` (1 = left to right). `instant` skips the animation. */
  const run = useCallback((kind, dir, instant = false) => {
    const cells = grid.current ? [...grid.current.children] : [];
    const { cols, rows } = size.cols ? size : gridFor();
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
    // The page has arrived: stop the "still loading" timers from touching this transition.
    s.current.pending = null;
    if (hold) await wait(hold);
    setView((v) => ({ ...v, covered: false, waiting: false }));
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
      // Measure the squares now, in case the window had no size when the page first loaded.
      flushSync(() => {
        if (!size.cols || !size.rows) setSize(gridFor());
        setView({ on: true, covered: false, waiting: false, bg, fg, label: labelFor(url.pathname) });
      });
      await run('cover', dir);
      setView((v) => ({ ...v, covered: true }));
      st.pending = { target: url.pathname, dir };
      router.push(url.pathname + url.search + url.hash);
      // If the page takes a moment (first visit on the dev server, a slow phone), show that it's on its way.
      setTimeout(() => { if (s.current.pending?.target === url.pathname) setView((v) => ({ ...v, waiting: true })); }, 700);
      // Never leave the screen covered for good if the navigation fails.
      setTimeout(() => { if (s.current.pending?.target === url.pathname) reveal(dir, 0); }, PATIENCE);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [labelFor, reveal, router, run, size]);

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
    <div className={'pt' + (view.on ? ' on' : '') + (view.covered ? ' covered' : '') + (view.waiting ? ' waiting' : '')} style={{ '--pt-bg': view.bg, '--pt-fg': view.fg, '--cols': size.cols, '--rows': size.rows }} aria-hidden="true">
      <div className="pt-grid" ref={grid}>{cells}</div>
      <div className="pt-paper" />
      <p className="pt-label">
        <span className="mk mk-squiggle">{view.label}<Ink kind="squiggle" color="var(--pt-fg)" width={5} play={view.covered} /></span>
      </p>
    </div>
  );
}
