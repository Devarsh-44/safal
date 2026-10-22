'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icons';
import { useLang, languages, pick } from '@/lib/i18n';
import { school } from '@/lib/content';

const links = [['/academics', 'academics'], ['/admissions', 'admissions'], ['/facilities', 'facilities'], ['/news', 'news'], ['/contact', 'contact']];
const menuLinks = [...links.slice(0, 4), ['/careers', 'careers'], links[4]];
const ease = [0.22, 1, 0.36, 1];

/** Floating rounded glass bar. Hides while scrolling down, returns on the way up. */
export default function Header() {
  const { t, lang, setLang, branch, setBranch } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState('light');
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('sv_theme', next); } catch {}
  };

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (Math.abs(y - last) > 8) { setHidden(y > last && y > 400); last = y; }
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', k); window.__lenis?.start(); };
  }, [open]);

  const Campus = ({ className = '' }) => (
    <div className={'seg2 campus ' + className} role="group" aria-label={t.campusPick}>
      {school.campuses.map((c, i) => <button key={c.id} aria-pressed={branch === i} onClick={() => setBranch(i)}>{pick(lang, c)}</button>)}
    </div>
  );
  const Lang = ({ full }) => (
    <div className="seg2" role="group" aria-label="Language">
      {languages.map((l) => <button key={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)} lang={l.id} title={l.name}>{full ? l.name : l.label}</button>)}
    </div>
  );

  return (
    <>
      <header className={'nav2' + (solid ? ' solid' : '') + (hidden && !open ? ' hide' : '')}>
        <div className="nav2-bar">
          <Link href="/" className="nav2-logo" aria-label="Safal Vidyalaya home">
            <img src="/images/logo.png" alt="" width="293" height="135" /><span>Safal Vidyalaya</span>
          </Link>
          <nav className="nav2-links" aria-label="Main">
            {links.map(([href, key]) => <Link key={key} href={href} className={path === href ? 'active' : ''}>{t.nav[key]}</Link>)}
          </nav>
          <Lang />
          <button className="theme-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? t.v2.theme.light : t.v2.theme.dark} title={theme === 'dark' ? t.v2.theme.light : t.v2.theme.dark}>
            {theme === 'dark'
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" /></svg>}
          </button>
          <Link href="/admissions" className="btn2 btn2-primary btn2-sm" data-magnetic><span data-magnetic-inner>{t.applyShort}</span></Link>
          <button className="nav2-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" size={20} /></button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu2" initial={{ clipPath: 'inset(0 0 100% 0 round 0 0 40px 40px)' }} animate={{ clipPath: 'inset(0 0 0% 0 round 0 0 0px 0px)' }} exit={{ clipPath: 'inset(0 0 100% 0 round 0 0 40px 40px)' }} transition={{ duration: 0.8, ease }}>
            <button className="nav2-burger menu2-close" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={() => setOpen(false)}><Icon name="close" size={20} /></button>
            <nav className="menu2-links" aria-label="Mobile">
              {[['/', 'about'], ...menuLinks].map(([href, key], i) => (
                <div key={href} style={{ overflow: 'hidden' }}>
                  <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.9, ease }}>
                    <Link href={href}>{href === '/' ? t.common.home : t.nav[key]}</Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div className="menu2-foot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              <Campus />
              <Lang full />
              <Link href="/admissions" className="btn2 btn2-primary btn2-block">{t.apply}</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
