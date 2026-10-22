'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from './Icons';
import { school, personas } from '@/lib/content';
import { useLang, pick } from '@/lib/i18n';

// Found pictures of Gandhinagar used on the site (CC BY-SA, via Wikimedia Commons). Keep in step with assets/credits.json.
const CREDITS = [
  { title: 'Gandhinagar Sector 28 Garden Trees 01', by: 'Beypeople', licence: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/w/index.php?curid=47518643' },
  { title: 'Cityplan', by: 'Pmapte', licence: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Cityplan.JPG' },
];

/** The close: the name built from five blocks, like the SAFAL pillar, then links, addresses and credits. */
export default function Footer() {
  const { t, lang } = useLang();
  const f = t.home.footer;
  const fo = t.footer;
  const brochure = personas[0].links.find((l) => l.href.startsWith('https://wa.me'))?.href ?? '/contact';
  // Phone action bar: slides away while scrolling down so it never sits on the content being read, returns on scroll up.
  const [barHidden, setBarHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => { const y = window.scrollY; if (Math.abs(y - last) > 6) { setBarHidden(y > last && y > 120); last = y; } };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <footer className="foot">
        <div className="ph-wrap">
          <div className="foot-mark" aria-label="Safal" role="img">{'SAFAL'.split('').map((ch, k) => <span key={k} aria-hidden="true">{ch}</span>)}</div>
          <div className="foot-grid">
            <div className="foot-col">
              <b>{f.school}</b>
              <Link href="/academics">{t.home.nav.academics}</Link>
              <Link href="/facilities">{t.home.nav.facilities}</Link>
              <Link href="/news">{t.home.nav.news}</Link>
            </div>
            <div className="foot-col">
              <b>{f.admissions}</b>
              <Link href="/admissions">{f.apply}</Link>
              <Link href="/#visit">{t.home.hero.visit}</Link>
              <a href={brochure} target="_blank" rel="noopener noreferrer">{f.brochure}</a>
            </div>
            <div className="foot-col">
              <b>{f.updates}</b>
              <Link href="/careers">{fo.careers}</Link>
              <Link href="/contact">{t.home.nav.contact}</Link>
              <Link href="/admin">{fo.staff}</Link>
            </div>
            <div className="foot-addr">
              {school.campuses.map((c) => (
                <div key={c.id}>
                  <b>{t.common.campus(pick(lang, c))}</b>
                  <span>{c.address}</span>
                  {c.phone.startsWith('[') ? <span>{c.phone}</span> : <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>}
                </div>
              ))}
            </div>
          </div>
          <div className="foot-last">
            <p>
              © {new Date().getFullYear()} {school.name}. {fo.about} <a href={`mailto:${school.email}`}>{school.email}</a>
              <br />
              {f.credits}: {CREDITS.map((c, k) => (
                <span key={c.page}>{k > 0 && '; '}<a href={c.page} target="_blank" rel="noopener noreferrer">“{c.title}”</a> by {c.by}, {c.licence}</span>
              ))}, via Wikimedia Commons.
            </p>
            <a href="#main" className="btn-oval" onClick={(e) => { if (window.__lenis) { e.preventDefault(); window.__lenis.scrollTo(0); } }}>{f.top}</a>
          </div>
        </div>
      </footer>

      <nav className={'actionbar' + (barHidden ? ' is-hidden' : '')} aria-label="Quick actions">
        <a href={`tel:${school.phone}`}><Icon name="phone" size={18} />{t.call}</a>
        <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} />{t.whatsapp}</a>
        <Link href="/admissions" className="apply">{t.applyShort}</Link>
      </nav>
    </>
  );
}
