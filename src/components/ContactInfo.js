'use client';
import Icon from './Icons';
import { Reveal } from './Motion';
import { useLang, pick } from '@/lib/i18n';
import { school } from '@/lib/content';

/** Campus cards, quick contact buttons and the map for the Contact page. */
export default function ContactInfo() {
  const { t, lang } = useLang();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {school.campuses.map((c, i) => (
        <Reveal key={c.id} delay={i * 0.08} className="card" style={{ padding: 24, borderRadius: 20 }}>
          <b className="display" style={{ fontSize: 24 }}>{t.common.campus(pick(lang, c))}</b>
          <p style={{ display: 'flex', gap: 10, margin: '12px 0 6px' }}><Icon name="pin" style={{ color: 'var(--saffron)', flex: 'none' }} />{c.address}</p>
          <p style={{ display: 'flex', gap: 10, margin: 0 }}><Icon name="phone" style={{ color: 'var(--saffron)', flex: 'none' }} />{c.phone}</p>
        </Reveal>
      ))}
      <Reveal delay={0.16} className="card" style={{ padding: 24, borderRadius: 20, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <a className="btn btn-dark" href={`tel:${school.phone}`}><Icon name="phone" />{t.call}</a>
        <a className="btn btn-primary" style={{ background: 'var(--green)' }} href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" />{t.whatsapp}</a>
        <a className="btn btn-outline" href={`mailto:${school.email}`}><Icon name="mail" />{t.common.email}</a>
      </Reveal>
      <Reveal delay={0.2} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', aspectRatio: '4 / 3' }}>
        <iframe title={`Map — ${school.campuses[0].address}`} src={`https://www.google.com/maps?q=${encodeURIComponent('Safal Vidyalaya, Sector 22, Gandhinagar')}&output=embed`} style={{ border: 0, width: '100%', height: '100%' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </Reveal>
    </div>
  );
}
