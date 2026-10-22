'use client';
/** Inner-page parts for v2: page hero, academic resources, programs, openings. Same motion as the home page. */
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Txt } from './MotionSystem';
import { useLang } from '@/lib/i18n';
import { programs } from '@/lib/content';
import { media } from '@/lib/media';

const PAGE_MEDIA = { academics: 'readingDesks', admissions: 'campus', facilities: 'lab', contact: 'campus', careers: 'teacher', news: 'yoga' };

/** Title letter by letter, the lead rising after it, then a large rounded picture that wipes open and drifts. */
export function PageHero2({ page }) {
  const { t } = useLang();
  const { title, intro, crumb } = t.pages[page];
  const m = media[PAGE_MEDIA[page]];
  return (
    <section className="ph2">
      <div className="wrap">
        <nav className="ph2-crumbs" aria-label="Breadcrumb" data-reveal><Link href="/">{t.common.home}</Link> / {crumb ?? title}</nav>
        <Txt as="h1" split="chars">{title}</Txt>
        {intro && <p className="lead" data-reveal>{intro}</p>}
        <div className="ph2-media" data-clip>
          <img src={m.src} alt="" style={{ objectPosition: m.pos }} data-parallax="0.18" fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}

// [BRACKETED] text is what the school still has to supply; kept in the data, hidden on the page.
const RESOURCES = [
  { id: 'syllabus', title: 'Syllabus', body: 'Standard-wise syllabus for English and Gujarati medium. [UPLOAD SYLLABUS PDFs PER STANDARD]' },
  { id: 'assessment', title: 'Child Assessment', body: 'How we track each child’s progress through the year. [ADD DETAILS]' },
  { id: 'regulations', title: 'Academic Regulations', body: 'Attendance, promotion and conduct rules. [ADD DETAILS]' },
  { id: 'exams', title: 'Examination Schedule', body: 'Unit tests, mid-term and annual examination dates for 2026–27. [ADD SCHEDULE]' },
  { id: 'evaluation', title: 'Evaluation System', body: 'How marks and grades are calculated. [ADD DETAILS]' },
  { id: 'planner', title: 'Academic Planner', body: 'Term calendar with holidays, events and parent–teacher meetings. [UPLOAD PLANNER]' },
];
const clean = (s) => s.replace(/\s*\[[^\]]*\]/g, '');

export function Resources() {
  const { t } = useLang();
  const r = t.resources;
  const [open, setOpen] = useState('syllabus');
  return (
    <section className="sec" id="syllabus">
      <div className="wrap split2">
        <div>
          <Txt as="h2" split className="d-xl">{r.title}</Txt>
          <p className="t2" data-reveal style={{ marginTop: 24, maxWidth: '40ch' }}>{r.body}</p>
        </div>
        <div className="rows2" data-stagger="0.06">
          {RESOURCES.map((it) => {
            const isOpen = open === it.id;
            const tr = r.items?.[it.id] ?? it;
            return (
              <div key={it.id} id={it.id} className={'row2' + (isOpen ? ' open' : '')}>
                <button onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen} aria-controls={`r-${it.id}`}>{tr.title}<span className="pm" aria-hidden="true">+</span></button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`r-${it.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                      <p className="body">{clean(tr.body)}</p>
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

const PROGRAM_STYLE = ['tile-accent', 'tile-dark', ''];
export function Programs() {
  const { t } = useLang();
  return (
    <section className="sec" id="programs">
      <div className="wrap">
        <div className="sec-head"><Txt as="h2" split className="d-xl">{t.progTitle}</Txt></div>
        <div className="bento" data-stagger="0.08">
          {programs.map((p0, k) => {
            const p = { ...p0, ...(t.content.programs?.[k] ?? {}) };
            return (
              <div key={p0.name} className={'card2 hover tile ' + (k === 0 ? 'b-6 ' : 'b-3 ') + PROGRAM_STYLE[k]} style={k === 2 ? { background: 'var(--card-2)' } : undefined}>
                <span className="range" style={k === 0 ? { color: 'var(--accent-ink)' } : undefined}>{p.tag}</span>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// SAMPLE openings for the prototype: replace with the school's real vacancies.
const OPENINGS = [
  { role: 'Mathematics teacher', meta: 'Std 9–10 · English medium · Gandhinagar' },
  { role: 'Primary teacher', meta: 'Std 1–5 · Gujarati medium · Ahmedabad' },
  { role: 'Science lab assistant', meta: 'Full time · Gandhinagar' },
];
export function Openings2() {
  const { t } = useLang();
  return (
    <div>
      <Txt as="h2" split className="d-xl">{t.career.openings}</Txt>
      <div className="rows2" data-stagger="0.07" style={{ marginTop: 32 }}>
        {OPENINGS.map((o) => (
          <div key={o.role} className="row2">
            <a href="#apply" data-cursor="Apply"><span><b style={{ display: 'block' }}>{o.role}</b><span className="t2" style={{ fontWeight: 400, fontSize: 'var(--t-sm)' }}>{o.meta}</span></span><span className="pm" aria-hidden="true">→</span></a>
          </div>
        ))}
      </div>
      <p className="t2" data-reveal style={{ marginTop: 24, maxWidth: '40ch' }}>{t.career.openingsNote}</p>
    </div>
  );
}
