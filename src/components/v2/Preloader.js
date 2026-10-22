'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Intro, once per visit: a counter runs to 100 while S-A-F-A-L rises letter by letter, then the
 * black curtain lifts with a curved edge. Announces itself done with window.__svReady and an
 * `sv:ready` event, which the home hero waits for before playing its own entrance.
 */
export default function Preloader() {
  const root = useRef(null);
  const [show, setShow] = useState(true);

  useLayoutEffect(() => {
    const done = () => { window.__svReady = true; window.dispatchEvent(new Event('sv:ready')); setShow(false); };
    let seen = false;
    try { seen = sessionStorage.getItem('sv_intro') === '1'; } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
    try { sessionStorage.setItem('sv_intro', '1'); } catch {}
    window.__lenis?.stop();
    const el = root.current;
    const num = el.querySelector('.pl-num');
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => { window.__lenis?.start(); done(); } })
        .fromTo('.pl-ch', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.1)
        .to(counter, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, ' '); } }, 0)
        .to('.pl-bar i', { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0)
        .to('.pl-ch', { yPercent: -110, duration: 0.7, ease: 'expo.in', stagger: 0.04 }, 1.9)
        .to(el, { clipPath: 'inset(0 0 100% 0 round 0 0 50% 50%)', duration: 1.1, ease: 'expo.inOut' }, 2.25);
    }, el);
    return () => ctx.revert();
  }, []);

  if (!show) return null;
  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl-word">{'SAFAL'.split('').map((c, i) => <span key={i} className="pl-m"><span className="pl-ch">{c}</span></span>)}</div>
      <div className="pl-foot">
        <span>Safal Vidyalaya · Gandhinagar</span>
        <span className="pl-num">{'  0'}</span>
      </div>
      <div className="pl-bar"><i /></div>
    </div>
  );
}
