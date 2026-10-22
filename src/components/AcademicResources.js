'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

// [BRACKETED] text is what the school still has to supply; it is kept in the data and hidden on the page.
const items = [
  { id: 'syllabus', title: 'Syllabus', body: 'Standard-wise syllabus for English and Gujarati medium. [UPLOAD SYLLABUS PDFs PER STANDARD]' },
  { id: 'assessment', title: 'Child Assessment', body: 'How we track each child’s progress through the year. [ADD DETAILS]' },
  { id: 'regulations', title: 'Academic Regulations', body: 'Attendance, promotion and conduct rules. [ADD DETAILS]' },
  { id: 'exams', title: 'Examination Schedule', body: 'Unit tests, mid-term and annual examination dates for 2026–27. [ADD SCHEDULE]' },
  { id: 'evaluation', title: 'Evaluation System', body: 'How marks and grades are calculated. [ADD DETAILS]' },
  { id: 'planner', title: 'Academic Planner', body: 'Term calendar with holidays, events and parent–teacher meetings. [UPLOAD PLANNER]' },
];
const clean = (s) => s.replace(/\s*\[[^\]]*\]/g, '');

/** Academic resources: one column of filled rows that open in place, each marked with the page's oval. */
export default function AcademicResources() {
  const { t } = useLang();
  const r = t.resources;
  const [open, setOpen] = useState('syllabus');
  return (
    <section className="ph-res" id="syllabus">
      <div className="ph-wrap ph-res-grid">
        <div>
          <h2 className="ph-h2" data-reveal>{r.title}</h2>
          <p className="ph-res-body" data-reveal style={{ '--d': 1 }}>{r.body}</p>
        </div>
        <ul className="ph-res-list">
          {items.map((it, k) => {
            const isOpen = open === it.id;
            const tr = r.items?.[it.id] ?? it;
            return (
              <li key={it.id} id={it.id} className={isOpen ? 'open' : ''} data-reveal style={{ '--d': k % 3 }}>
                <button onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen} aria-controls={`res-${it.id}`}>
                  <i aria-hidden="true" />{tr.title}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`res-${it.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
                      <p>{clean(tr.body)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
