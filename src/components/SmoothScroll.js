'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger animations stay in sync. */
export default function SmoothScroll() {
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = undefined; };
  }, []);

  // New page → start at the top and let triggers re-measure. Runs again after the new page has
  // painted, because Lenis otherwise keeps the old page's offset (clamped to the new page's height).
  useEffect(() => {
    const toTop = () => {
      window.scrollTo(0, 0);
      window.__lenis?.resize();
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
    };
    toTop();
    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(toTop); });
    const id = setTimeout(() => { toTop(); ScrollTrigger.refresh(); }, 120);
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(id); };
  }, [path]);

  return null;
}
