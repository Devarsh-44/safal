'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Chakra } from './Motion';
import { useLang } from '@/lib/i18n';

const ease = [0.2, 0.7, 0.2, 1];

/**
 * Dark banner at the top of every inner page. Text comes from `t.pages[page]` so it follows the
 * language switch. Plays on mount (not on scroll), so it always animates when a page opens.
 */
export default function PageHero({ page }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const { eyebrow, title, intro, crumb } = t.pages[page];
  const rise = (d) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay: d } });
  return (
    <section className="page-hero">
      <Chakra size={460} color="#ffffff" opacity={0.08} className="chakra-bg" style={{ right: -120, top: -120 }} />
      <div className="container">
        <motion.nav className="crumbs" aria-label="Breadcrumb" {...rise(0)}><Link href="/">{t.common.home}</Link> / {crumb ?? title}</motion.nav>
        {eyebrow && <motion.p className="mono" style={{ color: '#F2A06B' }} {...rise(0.05)}>{eyebrow}</motion.p>}
        <motion.h1 key={title} className="display h1" style={{ maxWidth: 820, margin: 0 }} {...rise(0.12)}>{title}</motion.h1>
        {intro && <motion.p key={intro} style={{ fontSize: 20, color: '#DDE1F2', maxWidth: 640, margin: '20px 0 0' }} {...rise(0.2)}>{intro}</motion.p>}
      </div>
    </section>
  );
}
