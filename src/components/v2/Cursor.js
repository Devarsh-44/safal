'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom cursor for fine pointers only: a dot that follows exactly and a ring that trails.
 * - Over links and buttons the ring grows; over [data-cursor="Label"] it becomes a saffron disc with the label.
 * - [data-magnetic] elements lean toward the pointer and spring back when it leaves.
 * Touch devices and reduced-motion users keep the normal cursor.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
    let magnet = null;

    const move = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * 0.35;
        const my = (e.clientY - (r.top + r.height / 2)) * 0.35;
        gsap.to(magnet, { x: mx, y: my, duration: 0.6, ease: 'power3' });
        const inner = magnet.querySelector('[data-magnetic-inner]');
        if (inner) gsap.to(inner, { x: mx * 0.4, y: my * 0.4, duration: 0.6, ease: 'power3' });
      }
    };
    const over = (e) => {
      const lab = e.target.closest('[data-cursor]');
      const hot = e.target.closest('a, button, [role="button"], input[type="submit"], label, select');
      const m = e.target.closest('[data-magnetic]');
      if (m !== magnet) {
        if (magnet) {
          gsap.to(magnet, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
          const inner = magnet.querySelector('[data-magnetic-inner]');
          if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)' });
        }
        magnet = m;
      }
      ring.current.classList.toggle('is-hot', !!hot && !lab);
      ring.current.classList.toggle('is-label', !!lab);
      label.current.textContent = lab ? lab.dataset.cursor : '';
    };
    const down = () => ring.current.classList.add('is-down');
    const up = () => ring.current.classList.remove('is-down');
    const leave = () => { gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 }); };
    const enter = () => { gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 }); };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    document.documentElement.addEventListener('pointerenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.removeEventListener('pointerenter', enter);
    };
  }, []);

  return (
    <div className="cx" aria-hidden="true">
      <div className="cx-ring" ref={ring}><span ref={label} /></div>
      <div className="cx-dot" ref={dot} />
    </div>
  );
}
