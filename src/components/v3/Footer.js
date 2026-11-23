'use client';
import { useLang, pick } from '@/lib/i18n';
import { school } from '@/lib/content';
import { sampleCredits } from '@/lib/media';
import { APPLY_HREF } from './Header';

/** The last page: an ink band with the margin line, campuses, contact and photo credits. */
export default function Footer() {
  const { t, lang } = useLang();
  const v = t.v3.footer;
  const b = t.v3.bar;
  const wa = `https://wa.me/${school.whatsapp}`;
  return (
    <>
      <footer className="ftr" id="contact">
        <div className="in">
          <p className="big">Safal Vidyalaya<span className="hand">{v.tag}</span></p>
          <div className="cols">
            <div>
              <h3>{v.campuses}</h3>
              {school.campuses.map((c) => (
                <p key={c.id}><b>{pick(lang, c)}</b><br />{c.address}</p>
              ))}
            </div>
            <div>
              <h3>{v.call}</h3>
              <a href={`tel:${school.phone}`}>{school.phoneDisplay}</a>
              <a href={wa} target="_blank" rel="noopener noreferrer">{v.whatsapp}</a>
              <a href={`mailto:${school.email}`}>{school.email}</a>
            </div>
            <div>
              <h3>{t.v3.menu}</h3>
              {t.v3.nav.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
              <a href={APPLY_HREF}>{t.v3.apply}</a>
              <a href="#top">{v.top} ↑</a>
            </div>
          </div>
          <div className="fine">
            <span>{v.rights} · {school.affiliation} · <a className="staff" href="/admin" rel="nofollow">{v.staff}</a></span>
            <details>
              <summary>{v.credits}</summary>
              <p style={{ marginTop: 8 }}>{v.samples}</p>
              <ul>{sampleCredits.map((c) => <li key={c.title}>“{c.title}”, {c.by}, {c.licence}, via Wikimedia Commons</li>)}</ul>
            </details>
          </div>
        </div>
      </footer>
      <nav className="mbar gl" aria-label="Quick actions">
        <a href={`tel:${school.phone}`}>{b.call}</a>
        <a href={wa} target="_blank" rel="noopener noreferrer">{b.whatsapp}</a>
        <a className="apply" href={APPLY_HREF}>{b.apply}</a>
      </nav>
    </>
  );
}
