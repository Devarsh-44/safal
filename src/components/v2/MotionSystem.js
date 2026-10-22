'use client';
/**
 * One motion system for every page. Lenis smooth scroll + GSAP ScrollTrigger, driven by data attributes
 * so all pages animate the same way:
 *
 *   data-split            headline lines rise out of a mask (data-split="chars" for letter by letter)
 *   data-scrub            words light up one by one as the block scrolls through (Apple-style statement)
 *   data-reveal           rises and fades in; data-stagger on a parent staggers its direct children
 *   data-clip             rounded image wipes open from the bottom while the picture settles from 1.25x
 *   data-parallax="0.2"   drifts against the scroll (positive = slower than the page)
 *   data-count="12"       counts up from 0 when it enters
 *   data-skew             leans with scroll velocity (marquees)
 *
 * Hidden start states are set by script only, so without JS (or with reduced motion) everything is visible.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { useLang } from '@/lib/i18n';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'expo.out';

/** Wraps each rendered line of `el` in a mask; returns the inner line elements. */
export function splitLines(el) {
  if (el.dataset.splitDone) return [...el.querySelectorAll(':scope > .sl > .sl-in')];
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(' ').map((w) => {
    const s = document.createElement('span');
    s.className = 'sw';
    s.textContent = w;
    el.appendChild(s);
    el.appendChild(document.createTextNode(' '));
    return s;
  });
  const lines = [];
  let top = null;
  words.forEach((w) => {
    if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
    lines[lines.length - 1].push(w.textContent);
  });
  el.textContent = '';
  const inners = lines.map((ws) => {
    const mask = document.createElement('span');
    mask.className = 'sl';
    mask.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'sl-in';
    inner.textContent = ws.join(' ');
    mask.appendChild(inner);
    el.appendChild(mask);
    return inner;
  });
  el.dataset.splitDone = '1';
  return inners;
}

export function splitChars(el) {
  if (el.dataset.splitDone) return [...el.querySelectorAll('.sc-in')];
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const out = [];
  text.split(' ').forEach((word, wi, arr) => {
    const w = document.createElement('span');
    w.className = 'sc-word';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch) => {
      const m = document.createElement('span');
      m.className = 'sc';
      const i = document.createElement('span');
      i.className = 'sc-in';
      i.textContent = ch;
      m.appendChild(i);
      w.appendChild(m);
      out.push(i);
    });
    el.appendChild(w);
    if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.dataset.splitDone = '1';
  return out;
}

function splitWords(el) {
  if (el.dataset.splitDone) return [...el.querySelectorAll('.sw')];
  const text = el.textContent.trim().replace(/\s+/g, ' ');
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const out = text.split(' ').map((w) => {
    const s = document.createElement('span');
    s.className = 'sw';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = w;
    el.appendChild(s);
    el.appendChild(document.createTextNode(' '));
    return s;
  });
  el.dataset.splitDone = '1';
  return out;
}

/** Sets up every data-* animation inside `root`. Returns nothing; everything is collected by gsap.context. */
export function animateScope(root) {
  // Already on screen when the page opens: play straight away. Further down: wait until scrolled to.
  const enter = (el, start = 'top 86%') => (el.getBoundingClientRect().top < window.innerHeight * 0.92 ? undefined : { trigger: el, start, once: true });

  root.querySelectorAll('[data-split]').forEach((el) => {
    if (el.dataset.splitManual !== undefined) return; // a component plays this one itself
    const parts = el.dataset.split === 'chars' ? splitChars(el) : splitLines(el);
    gsap.fromTo(parts, { yPercent: 115, rotate: el.dataset.split === 'chars' ? 6 : 2 }, {
      yPercent: 0, rotate: 0, duration: 1.2, ease: EASE, stagger: el.dataset.split === 'chars' ? 0.025 : 0.09,
      scrollTrigger: enter(el), delay: enter(el) ? 0 : 0.15,
    });
  });

  root.querySelectorAll('[data-scrub]').forEach((el) => {
    const words = splitWords(el);
    gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
    });
  });

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: EASE, scrollTrigger: enter(el) });
  });

  root.querySelectorAll('[data-stagger]').forEach((el) => {
    gsap.fromTo([...el.children], { y: 56, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: Number(el.dataset.stagger) || 0.08, scrollTrigger: enter(el),
    });
  });

  root.querySelectorAll('[data-clip]').forEach((el) => {
    const img = el.querySelector('img, video, canvas');
    const tl = gsap.timeline({ scrollTrigger: enter(el, 'top 90%') });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round var(--r-lg))' }, { clipPath: 'inset(0% 0% 0% 0% round var(--r-lg))', duration: 1.4, ease: 'expo.inOut' });
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: EASE }, 0);
  });

  root.querySelectorAll('[data-parallax]').forEach((el) => {
    const amt = Number(el.dataset.parallax) || 0.15;
    gsap.fromTo(el, { yPercent: -amt * 50 }, {
      yPercent: amt * 50, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  root.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: to, duration: 2, ease: 'power3.out', scrollTrigger: enter(el),
      onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
    });
  });

  const skews = root.querySelectorAll('[data-skew]');
  if (skews.length) {
    const set = gsap.quickTo(skews, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onUpdate: (s) => set(gsap.utils.clamp(-8, 8, s.getVelocity() / -300)) });
  }
}

export default function MotionSystem() {
  const path = usePathname();
  const { lang } = useLang();

  // Smooth scroll, once for the whole visit.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = undefined; };
  }, []);

  // New page: back to the top.
  useEffect(() => {
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
  }, [path]);

  // Every page (and every language switch, which re-mounts the split text): wire its animations.
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx;
    let raf = 0;
    // First visit: wait for the preloader to lift so the opening reveals are seen.
    const start = () => { raf = requestAnimationFrame(() => { ctx = gsap.context(() => animateScope(main), main); ScrollTrigger.refresh(); }); };
    if (window.__svReady) start(); else window.addEventListener('sv:ready', start, { once: true });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    const late = setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => { cancelAnimationFrame(raf); clearTimeout(late); window.removeEventListener('load', onLoad); window.removeEventListener('sv:ready', start); ctx?.revert(); };
  }, [path, lang]);

  return null;
}

/**
 * Text that the motion system splits. Re-mounts when the language changes so the split always
 * matches the current words. Usage: <Txt as="h2" split>…</Txt>, <Txt as="p" scrub>…</Txt>.
 */
export function Txt({ as: Tag = 'h2', split, scrub, children, ...rest }) {
  const { lang } = useLang();
  const attrs = {};
  if (split) attrs['data-split'] = split === true ? '' : split;
  if (scrub) attrs['data-scrub'] = '';
  return <Tag key={lang} {...attrs} {...rest}>{children}</Tag>;
}
