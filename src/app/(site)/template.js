'use client';
import { motion, useReducedMotion } from 'framer-motion';

/** Page transition: every route change fades the new page in. Opacity only — a transform here would break GSAP pinning. */
export default function Template({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
