'use client';
import Link from 'next/link';
import Icon from './Icons';
import { school } from '@/lib/content';
import { useLang, pick } from '@/lib/i18n';

export default function Footer() {
  const { t, lang } = useLang();
  const fo = t.footer;
  return (
    <>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <b className="display" style={{ color: '#fff', fontSize: 26, display: 'block' }}>{school.name}</b>
            <p style={{ margin: '8px 0 0' }}>{fo.about}</p>
          </div>
          {school.campuses.map((c) => (
            <div key={c.id}>
              <b style={{ color: '#fff', display: 'block', marginBottom: 10 }}>{t.common.campus(pick(lang, c))}</b>
              <p style={{ margin: 0 }}>{c.address}</p>
              <p style={{ margin: '8px 0 0' }}>{c.phone.startsWith('[') ? c.phone : <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a>}</p>
            </div>
          ))}
          <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
            <b style={{ color: '#fff' }}>{fo.quick}</b>
            <Link href="/admissions">{fo.admissionForm}</Link>
            <Link href="/academics">{fo.academics}</Link>
            <Link href="/careers">{fo.careers}</Link>
            <Link href="/admin">{fo.staff}</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {school.name}. {fo.rights}</span>
          <span><a href={`mailto:${school.email}`}>{school.email}</a></span>
        </div>
      </footer>

      <a className="wa-float" href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><Icon name="whatsapp" size={28} /></a>

      <nav className="actionbar" aria-label="Quick actions">
        <a href={`tel:${school.phone}`}><Icon name="phone" />{t.call}</a>
        <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1D7A46' }}><Icon name="whatsapp" />{t.whatsapp}</a>
        <Link href="/admissions" className="apply">{t.applyShort}</Link>
      </nav>
    </>
  );
}
