'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { useLang, languages, pick } from '@/lib/i18n';
import { school } from '@/lib/content';

const links = [['/academics', 'academics'], ['/admissions', 'admissions'], ['/facilities', 'facilities'], ['/news', 'news'], ['/contact', 'contact']];

/** Plain navy bar: wordmark, five links, campus and language switches, one action. */
export default function Header() {
  const { t, lang, setLang, branch, setBranch } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start(); };
  }, [open]);

  const Campus = () => (
    <div className="bar-switch bar-campus" role="group" aria-label={t.campusPick}>
      {school.campuses.map((c, i) => <button key={c.id} aria-pressed={branch === i} onClick={() => setBranch(i)}>{pick(lang, c)}</button>)}
    </div>
  );
  const Lang = ({ full }) => (
    <div className="bar-switch" role="group" aria-label="Language">
      {languages.map((l) => <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} title={l.name} lang={l.id}>{full ? l.name : l.label}</button>)}
    </div>
  );

  return (
    <>
      <header className="bar">
        <div className="bar-row">
          <Link href="/" className="bar-mark" aria-label="Safal Vidyalaya home"><i aria-hidden="true" />Safal Vidyalaya</Link>
          <nav className="bar-nav" aria-label="Main">
            {links.map(([href, key]) => <Link key={key} href={href} className={'bar-link' + (path === href ? ' active' : '')}>{t.home.nav[key]}</Link>)}
          </nav>
          <div className="bar-opts"><Campus /><Lang /></div>
          <Link href="/admissions" className="btn-oval">{t.applyShort}</Link>
          <button className="bar-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" size={20} /></button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="menu-top">
              <Link href="/" className="bar-mark"><i aria-hidden="true" />Safal Vidyalaya</Link>
              <button className="bar-burger" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" size={20} /></button>
            </div>
            <nav aria-label="Mobile" className="menu-links">
              {[['/', null], ...links].map(([href, key], i) => (
                <motion.div key={href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.05, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
                  <Link href={href}>{key ? t.home.nav[key] : t.common.home}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="menu-foot">
              <Campus />
              <Lang full />
              <Link href="/admissions" className="btn-oval" style={{ justifyContent: 'center' }}>{t.apply}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
