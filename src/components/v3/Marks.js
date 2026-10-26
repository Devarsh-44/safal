'use client';
import { useEffect, useRef, useState } from 'react';

/** The teacher's marks. Each path uses pathLength=1 so one dash animation draws any shape. */
const SHAPES = {
  squiggle: { vb: '0 0 200 24', fit: 'none', d: ['M3 15 C 30 6, 52 20, 80 12 S 132 4, 160 13 S 190 16, 197 9'] },
  circle: { vb: '0 0 200 100', fit: 'none', d: ['M22 58 C 16 18, 130 4, 180 32 C 206 48, 184 88, 104 92 C 40 96, 4 76, 26 40'] },
  double: { vb: '0 0 200 30', fit: 'none', d: ['M4 10 C 60 4, 140 14, 196 8', 'M14 24 C 70 18, 130 26, 186 20'] },
  tick: { vb: '0 0 26 22', d: ['M3 12 L10 19 L23 3'] },
  star: { vb: '0 0 60 58', d: ['M30 4 L37 21 L56 22 L41 34 L46 53 L30 42 L14 53 L19 34 L4 22 L23 21 Z'] },
};

/** Fires once when the element is at least `threshold` visible. */
export function useInView(threshold = 0.5) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, seen]);
  return [ref, seen];
}

/**
 * A stroke that draws itself. Server HTML shows it fully drawn; once mounted it is hidden ("armed")
 * and draws when `play` turns true. Reduced motion keeps it drawn (see v3.css).
 */
export function Ink({ kind = 'squiggle', color = 'var(--pen)', width = 5, play, delay = 0, className = '', style }) {
  const s = SHAPES[kind];
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  const cls = ['ink', className, armed && !play && 'armed', play && 'go'].filter(Boolean).join(' ');
  return (
    <svg className={cls} viewBox={s.vb} preserveAspectRatio={s.fit || 'xMidYMid meet'} aria-hidden="true" style={style}>
      {s.d.map((d, i) => (
        <path key={d} pathLength="1" d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: delay + i * 250 + 'ms' }} />
      ))}
    </svg>
  );
}

/** A word with a mark around or under it, drawn when it scrolls into view. */
export function Mark({ kind = 'squiggle', color, width, children, delay = 300 }) {
  const [ref, seen] = useInView(0.8);
  return (
    <span ref={ref} className={'mk mk-' + kind}>
      {children}
      <Ink kind={kind} color={color} width={width} play={seen} delay={delay} />
    </span>
  );
}

/** Small handwritten note for the margin column. */
export function Note({ children }) {
  return <div className="note"><span className="hand">{children}</span></div>;
}
