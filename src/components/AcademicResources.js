'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { Reveal } from './Motion';
import { useLang } from '@/lib/i18n';

const items = [
  { id: 'syllabus', title: 'Syllabus', body: 'Standard-wise syllabus for English and Gujarati medium. [UPLOAD SYLLABUS PDFs PER STANDARD]' },
  { id: 'assessment', title: 'Child Assessment', body: 'How we track each child’s progress through the year. [ADD DETAILS]' },
  { id: 'regulations', title: 'Academic Regulations', body: 'Attendance, promotion and conduct rules. [ADD DETAILS]' },
  { id: 'exams', title: 'Examination Schedule', body: 'Unit tests, mid-term and annual examination dates for 2026–27. [ADD SCHEDULE]' },
  { id: 'evaluation', title: 'Evaluation System', body: 'How marks and grades are calculated. [ADD DETAILS]' },
  { id: 'planner', title: 'Academic Planner', body: 'Term calendar with holidays, events and parent–teacher meetings. [UPLOAD PLANNER]' },
];

export default function AcademicResources() {
  const { t } = useLang();
  const r = t.resources;
  const [open, setOpen] = useState('syllabus');
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
        <div>
          <Reveal as="p" className="mono">{r.eyebrow}</Reveal>
          <Reveal as="h2" className="display h2" delay={0.05}>{r.title}</Reveal>
          <Reveal as="p" className="muted" delay={0.1} style={{ marginTop: 16 }}>{r.body}</Reveal>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {items.map((it) => {
            const isOpen = open === it.id;
            const tr = r.items?.[it.id] ?? it;
            return (
              <div key={it.id} id={it.id} className="card" style={{ borderRadius: 16, overflow: 'hidden', borderColor: isOpen ? 'var(--blue)' : undefined }}>
                <button onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 0, cursor: 'pointer', fontWeight: 700, fontSize: 18, textAlign: 'left' }}>
                  {tr.title}
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} style={{ color: 'var(--saffron)', display: 'flex' }}><Icon name="plus" /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="muted" style={{ margin: 0, padding: '0 20px 20px' }}>{tr.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
