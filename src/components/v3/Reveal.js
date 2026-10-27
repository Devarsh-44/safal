'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from './Marks';

/**
 * Scroll-linked motion that glides instead of stepping. `measure()` reads the DOM and returns where
 * things should be for the current scroll; `render(value)` draws it. The drawn value eases toward the
 * measured one each frame (about `ms` to settle), so wheel notches turn into smooth motion.
 * `layout()` (optional) re-reads sizes on resize. Reduced motion draws the measured value directly.
 */
export function useEasedScroll({ measure, render, layout }, ms = 140) {
  const fns = useRef({ measure, render, layout });
  fns.current = { measure, render, layout };
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = { target: 0, value: 0, raf: 0, last: 0 };
    const frame = (now) => {
      s.raf = 0;
      const dt = Math.min(64, s.last ? now - s.last : 16);
      s.last = now;
      s.value += (s.target - s.value) * (reduce ? 1 : 1 - Math.exp(-dt / ms));
      if (Math.abs(s.target - s.value) < 0.0005) s.value = s.target;
      fns.current.render(s.value);
      if (s.value !== s.target) s.raf = requestAnimationFrame(frame);
      else s.last = 0;
    };
    const onScroll = () => {
      s.target = fns.current.measure();
      if (!s.raf) s.raf = requestAnimationFrame(frame);
    };
    const onResize = () => { fns.current.layout?.(); onScroll(); };
    fns.current.layout?.();
    s.target = s.value = fns.current.measure();
    fns.current.render(s.value);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [ms]);
}

/**
 * Scroll reveal: returns a ref and a class. Before JS runs nothing is hidden; once mounted the
 * element is "rv-armed" (hidden) until it scrolls into view and becomes "rv-in".
 * The matching animations live in v3.css (rv-head, rv-deal, rv-drop, rv-slide).
 */
export function useReveal(threshold = 0.3) {
  const [ref, seen] = useInView(threshold);
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return [ref, seen ? ' rv-in' : armed ? ' rv-armed' : ''];
}

/** A section heading whose eyebrow and title rise into place as it scrolls into view. */
export function Head({ eyebrow, title, children }) {
  const [ref, cls] = useReveal(0.6);
  return (
    <div className={'head rv-head' + cls} ref={ref}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="h2"><span>{title}</span></h2>
      {children}
    </div>
  );
}
