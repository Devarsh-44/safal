'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const ease = [0.2, 0.7, 0.2, 1];

// The school's own photographs, one per page, seen through the banner's porthole.
const PHOTO = {
  academics: ['/images/live/safal-boy.webp', '22% 40%'],
  admissions: ['/images/live/safalvidhyalaya.webp', '24% 50%'],
  facilities: ['/images/live/event-a.webp', '50% 60%'],
  contact: ['/images/live/safalvidhyalaya.webp', '60% 50%'],
  careers: ['/images/live/event-b.webp', '50% 55%'],
  news: ['/images/live/event-a.webp', '30% 55%'],
};

/**
 * Navy banner at the top of every inner page, with the page's one oval cropped at the right edge.
 * Text comes from `t.pages[page]` so it follows the language switch. Plays on mount.
 */
export default function PageHero({ page }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const { title, intro, crumb } = t.pages[page];
  const rise = (d) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease, delay: d } });
  return (
    <section className="page-hero">
      <motion.span className="page-hero-oval" aria-hidden="true" {...(reduce ? {} : { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.9, ease } })}>
        <img src={PHOTO[page][0]} alt="" style={{ objectPosition: PHOTO[page][1] }} fetchPriority="high" />
      </motion.span>
      <div className="container">
        <motion.nav className="crumbs" aria-label="Breadcrumb" {...rise(0)}><Link href="/">{t.common.home}</Link> / {crumb ?? title}</motion.nav>
        <motion.h1 key={title} style={{ maxWidth: '16ch', margin: 0, position: 'relative' }} {...rise(0.08)}>{title}</motion.h1>
        {intro && <motion.p key={intro} style={{ fontSize: 'var(--step-lead)', color: 'var(--on-dark-soft)', maxWidth: '34ch', margin: '24px 0 0' }} {...rise(0.16)}>{intro}</motion.p>}
      </div>
    </section>
  );
}
