'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLang, languages } from '@/lib/i18n';

export const APPLY_HREF = '/admissions#apply';

function Langs() {
  const { lang, setLang } = useLang();
  return (
    <div className="langs" role="group" aria-label="Language">
      {languages.map((l) => (
        <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => setLang(l.id)} title={l.name}>{l.label}</button>
      ))}
    </div>
  );
}

/** Logo chip on the left, floating glass pill on the right. Slides away while scrolling down, returns on the way up. */
export default function Header() {
  const { t } = useLang();
  const v = t.v3;
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 8) { setHidden(y > last && y > 500); last = y; }
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => setOpen(false), [path]);

  const current = (href) => (href === path ? 'page' : undefined);

  return (
    <>
      <header className={'hdr' + (hidden && !open ? ' hide' : '')}>
        <Link href="/" className="logo-chip" aria-label="Safal Vidyalaya, home">
          <img src="/images/live/logo.webp" alt="Safal Vidyalaya" width="300" height="94" />
        </Link>
        <nav className="pill gl" aria-label="Main">
          {v.nav.map(([href, label]) => <Link key={href} className="lnk" href={href} aria-current={current(href)}>{label}</Link>)}
          <Langs />
          <Link className="btn btn-apply" href={APPLY_HREF}>{v.apply}</Link>
          <Link href="/admin" className="lnk staff-lnk" title={v.footer?.staff || 'Staff portal'} aria-label={v.footer?.staff || 'Staff portal'} style={{ padding: '8px 10px', fontSize: 14 }}>🔒</Link>
          <button className="menu-btn" type="button" aria-expanded={open} onClick={() => setOpen(true)}>{v.menu}</button>
        </nav>
      </header>
      {open && (
        <div className="sheet-menu" role="dialog" aria-modal="true" aria-label={v.menu}>
          <button className="btn btn-ink close" type="button" onClick={() => setOpen(false)} autoFocus>{v.close}</button>
          <Link href="/" onClick={() => setOpen(false)}>{v.home}</Link>
          {v.nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href={APPLY_HREF} onClick={() => setOpen(false)} style={{ color: 'var(--saffron-ink)' }}>{v.apply}</Link>
          <Link href="/admin" onClick={() => setOpen(false)} style={{ fontSize: 22, marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--soft)' }}>
            🔒 {v.footer?.staff || 'Staff login'} →
          </Link>
          <Langs />
        </div>
      )}
    </>
  );
}
