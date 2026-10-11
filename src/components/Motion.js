'use client';
/** Small animation building blocks shared by every page (Framer Motion). */
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ease = [0.2, 0.7, 0.2, 1];

/** Fades + rises its children into view once, when scrolled to. */
export function Reveal({ children, delay = 0, y = 28, as = 'div', className, style, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({ children, className, style, gap = 0.08, as = 'div' }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, style, as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      style={style}
      variants={reduce ? {} : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts up from 0 when it enters the viewport. */
export function Counter({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  return <span ref={ref}>{val}</span>;
}

/** The Ashoka-chakra-style wheel from the logo, used as a slowly rotating ambient motif. */
export function Chakra({ size = 520, color = '#2B2F86', opacity = 0.14, className, style, spokes = 24, speed = 60 }) {
  const reduce = useReducedMotion();
  const lines = Array.from({ length: spokes / 2 }, (_, i) => {
    const a = (i * Math.PI * 2) / spokes;
    const dx = 90 * Math.cos(a), dy = 90 * Math.sin(a);
    return <line key={i} x1={100 + dx} y1={100 + dy} x2={100 - dx} y2={100 - dy} />;
  });
  return (
    <motion.svg
      viewBox="0 0 200 200" aria-hidden="true" className={className}
      style={{ width: size, height: size, opacity, ...style }}
      fill="none" stroke={color} strokeWidth="2"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
    >
      <circle cx="100" cy="100" r="92" />
      <circle cx="100" cy="100" r="12" />
      {lines}
    </motion.svg>
  );
}

export { motion };
