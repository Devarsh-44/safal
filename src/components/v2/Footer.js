'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '../Icons';
import { Txt } from './MotionSystem';
import { useLang, pick } from '@/lib/i18n';
import { school, personas } from '@/lib/content';
import { sampleCredits } from '@/lib/media';

/** The close: the name set huge, rounded link cards, both campuses, credits for every found photograph. */
export default function Footer() {
  const { t, lang } = useLang();
  const f = t.v2.footer;
  const brochure = personas[0].links.find((l) => l.href.startsWith('https://wa.me'))?.href ?? '/contact';
  const [barHidden, setBarHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => { const y = window.scrollY; if (Math.abs(y - last) > 6) { setBarHidden(y > last && y > 160); last = y; } };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const toTop = (e) => { if (window.__lenis) { e.preventDefault(); window.__lenis.scrollTo(0, { duration: 2 }); } };

  return (
    <>
      <footer className="foot2">
        <div className="wrap">
          <Txt as="p" split="chars" className="foot2-big" aria-label={f.big}>{f.big}</Txt>
          <div className="foot2-grid" data-stagger="0.08">
            <div className="foot2-card">
              <b>{f.menu}</b>
              <Link href="/academics">{t.nav.academics}</Link>
              <Link href="/facilities">{t.nav.facilities}</Link>
              <Link href="/news">{t.nav.news}</Link>
              <Link href="/careers">{t.nav.careers}</Link>
            </div>
            <div className="foot2-card">
              <b>{t.nav.admissions}</b>
              <Link href="/admissions">{t.footer.admissionForm}</Link>
              <Link href="/#visit">{f.visit}</Link>
              <a href={brochure} target="_blank" rel="noopener noreferrer">{personas[0].links[2].title}</a>
              <Link href="/admin">{t.footer.staff}</Link>
            </div>
            {school.campuses.map((c) => (
              <div key={c.id} className="foot2-card">
                <b>{t.common.campus(pick(lang, c))}</b>
                <span>{c.address}</span>
                {c.phone.startsWith('[') ? <span>{c.phone}</span> : <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>}
                <a href={`mailto:${school.email}`}>{school.email}</a>
              </div>
            ))}
          </div>
          <div className="foot2-last">
            <div>
              <p>© {new Date().getFullYear()} {school.name} · {f.tag}</p>
              <details>
                <summary>{f.credits}</summary>
                <p>{f.samples}: {sampleCredits.map((c) => `“${c.title}” by ${c.by}, ${c.licence}`).join('; ')}, via Wikimedia Commons.</p>
              </details>
            </div>
            <a href="#main" className="btn2 btn2-glass btn2-sm" data-magnetic onClick={toTop}><span data-magnetic-inner>{f.top} ↑</span></a>
          </div>
        </div>
      </footer>

      <nav className={'bar2' + (barHidden ? ' hide' : '')} aria-label="Quick actions">
        <a href={`tel:${school.phone}`}><Icon name="phone" size={17} />{t.call}</a>
        <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={17} />{t.whatsapp}</a>
        <Link href="/admissions" className="apply">{t.applyShort}</Link>
      </nav>
    </>
  );
}
