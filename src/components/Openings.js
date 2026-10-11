'use client';
import { Reveal, Stagger, StaggerItem } from './Motion';
import { useLang } from '@/lib/i18n';

// Replace with real openings (or manage them from the admin panel in phase 2).
const openings = [
  { role: '[ROLE — e.g. Mathematics teacher]', meta: 'Std 9–10 · English medium · Gandhinagar' },
  { role: '[ROLE — e.g. Primary teacher]', meta: 'Std 1–5 · Gujarati medium · Ahmedabad' },
  { role: '[ROLE — e.g. Science lab assistant]', meta: 'Full time · Gandhinagar' },
];

export default function Openings() {
  const { t } = useLang();
  return (
    <div>
      <Reveal as="h2" className="display h3" style={{ marginBottom: 20 }}>{t.career.openings}</Reveal>
      <Stagger style={{ display: 'grid', gap: 12 }}>
        {openings.map((o) => (
          <StaggerItem key={o.role}>
            <a href="#apply" className="card lift" style={{ display: 'block', padding: 20, borderRadius: 16, textDecoration: 'none', color: 'var(--ink)' }}>
              <b style={{ display: 'block', fontSize: 18 }}>{o.role}</b>
              <span className="muted" style={{ fontSize: 15 }}>{o.meta}</span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="muted" style={{ marginTop: 20 }}>{t.career.openingsNote}</p>
    </div>
  );
}
