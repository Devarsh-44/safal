'use client';
import { useLang } from '@/lib/i18n';

// SAMPLE openings for the prototype: replace with the school's real vacancies (or manage them from the admin panel in phase 2).
const openings = [
  { role: 'Mathematics teacher', meta: 'Std 9–10 · English medium · Gandhinagar' },
  { role: 'Primary teacher', meta: 'Std 1–5 · Gujarati medium · Ahmedabad' },
  { role: 'Science lab assistant', meta: 'Full time · Gandhinagar' },
];

/** Current openings as filled rows, each jumping to the application form. */
export default function Openings() {
  const { t } = useLang();
  return (
    <div className="ph-openings">
      <h2 className="ph-h2" data-reveal>{t.career.openings}</h2>
      <ul>
        {openings.map((o, k) => (
          <li key={o.role} data-reveal style={{ '--d': k }}>
            <a href="#apply"><i aria-hidden="true" /><span><b>{o.role}</b><span>{o.meta}</span></span></a>
          </li>
        ))}
      </ul>
      <p data-reveal style={{ '--d': 3 }}>{t.career.openingsNote}</p>
    </div>
  );
}
