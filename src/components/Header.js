'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { useLang, languages, pick } from '@/lib/i18n';
import { school } from '@/lib/content';

const links = [
  ['/', 'about'], ['/academics', 'academics'], ['/admissions', 'admissions'], ['/facilities', 'facilities'],
  ['/news', 'news'], ['/careers', 'careers'], ['/contact', 'contact'],
];

/**
 * Fixed header: transparent with white text over the page's dark/photo hero, turning into a
 * frosted white bar once the visitor scrolls. Holds the language switch (EN / ગુ / हि) and campus switch.
 */
export default function Header() {
  const { t, lang, setLang, branch, setBranch } = useLang();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start(); };
  }, [open]);

  const c = school.campuses[branch];

  return (
    <>
      <header className={'hdr' + (scrolled ? ' solid' : '')}>
        <div className="hdr-row">
          <Link href="/" className="hdr-logo" aria-label="Safal Vidyalaya home">
            <img src="/images/logo.png" alt="Safal Vidyalaya — Creation of Life Through Education" />
          </Link>
          <nav className="hdr-nav" aria-label="Main">
            {links.map(([href, key]) => (
              <Link key={key} href={href} className={path === href && href !== '/' ? 'active' : ''}>{t.nav[key]}</Link>
            ))}
          </nav>
          <div className="hdr-actions">
            <div className="hdr-lang" role="group" aria-label="Language">
              {languages.map((l) => (
                <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} title={l.name}>{l.label}</button>
              ))}
            </div>
            <a href={`tel:${c.phone.startsWith('[') ? school.phone : c.phone.replace(/\s/g, '')}`} className="hdr-call" aria-label={`${t.call} ${pick(lang, c)}`}><Icon name="phone" size={18} /></a>
            <Link href="/admissions" className="btn btn-pill btn-primary hdr-apply">{t.apply}</Link>
            <button className="hdr-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" size={20} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu" initial={{ clipPath: 'circle(0% at 100% 0%)' }} animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className="menu-top">
              <img src="/images/logo.png" alt="" style={{ height: 40, borderRadius: 8 }} />
              <button className="hdr-burger" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" size={20} /></button>
            </div>
            <nav aria-label="Mobile" className="menu-links">
              {links.map(([href, key], i) => (
                <motion.div key={key} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}>
                  <Link href={href} className="display">{t.nav[key]}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="menu-foot">
              <div className="hx-seg" role="group" aria-label={t.campusPick}>
                {school.campuses.map((cp, i) => (
                  <button key={cp.id} aria-pressed={branch === i} onClick={() => setBranch(i)}>{pick(lang, cp)}</button>
                ))}
              </div>
              <div className="hdr-lang" role="group" aria-label="Language">
                {languages.map((l) => (
                  <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.name}</button>
                ))}
              </div>
              <Link href="/admissions" className="btn btn-pill btn-primary btn-lg btn-block">{t.apply}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
