'use client';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icons';
import { Reveal, Stagger, StaggerItem, Counter } from '../Motion';
import { useLang, pick } from '@/lib/i18n';
import { personas, stats, bloom, stages, facilities, programs } from '@/lib/content';

const ease = [0.2, 0.7, 0.2, 1];

export function PersonaPicker() {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);
  return (
    <section className="persona">
      <div className="container">
        <Reveal className="card">
          <div style={{ flex: '1 1 280px' }}>
            <p className="eyebrow">{t.quick}</p>
            <h2 className="display h3" style={{ margin: '0 0 18px', fontSize: 30 }}>{t.iam}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="group" aria-label="Choose who you are">
              {personas.map((p, k) => (
                <button key={p.label} className="chip" aria-pressed={i === k} onClick={() => setI(k)}>{pick(lang, p, 'label')}</button>
              ))}
            </div>
          </div>
          <div className="persona-links" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {personas[i].links.map((l0, k) => { const tl = t.content.personaLinks?.[i]?.[k]; const l = tl ? { ...l0, title: tl[0], note: tl[1] } : l0; return (
                <motion.div key={i + '-' + l.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: k * 0.05, duration: 0.35, ease } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                  <Link href={l.href} className="persona-link lift" style={{ height: '100%' }} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <b style={{ fontSize: 17 }}>{l.title}</b>
                    <span style={{ fontSize: 14, color: 'var(--slate)', display: 'flex', justifyContent: 'space-between' }}>{l.note}<span aria-hidden="true" style={{ color: 'var(--saffron)' }}>→</span></span>
                  </Link>
                </motion.div>
              ); })}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Stats() {
  const { lang } = useLang();
  return (
    <section className="container" style={{ paddingTop: 88, paddingBottom: 24 }}>
      <Stagger className="stats">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="stat">
            <b><Counter to={s.value} /></b>
            <p className="muted" style={{ margin: '6px 0 0' }}>{pick(lang, s, 'label')}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function BloomSection() {
  const { t } = useLang();
  const [i, setI] = useState(5);
  const tb = (k) => ({ ...bloom[k], ...(t.content.bloom?.[k] ?? {}) });
  const b = tb(i);
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 56, alignItems: 'center' }}>
        <div>
          <Reveal as="p" className="eyebrow">{t.howEyebrow}</Reveal>
          <Reveal as="h2" className="display h2" delay={0.05} style={{ marginBottom: 20 }}>{t.howTitle}</Reveal>
          <Reveal as="p" className="muted" delay={0.1} style={{ margin: '0 0 28px', maxWidth: 520 }}>{t.howBody}</Reveal>
          <Reveal className="bloom-detail" delay={0.15}>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                  <b className="display" style={{ fontSize: 44, color: b.color }}>0{i + 1}</b>
                  <b className="display" style={{ fontSize: 28 }}>{b.name}</b>
                </div>
                <p style={{ margin: '12px 0 0', fontSize: 18, color: '#2C3456' }}>{b.desc}</p>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
        <Stagger className="bloom-grid" gap={0.07}>
          {bloom.map((x, k) => (
            <StaggerItem key={x.name}>
              <motion.button
                className="hex" style={{ background: x.color, width: '100%' }}
                aria-pressed={i === k} aria-label={`${k + 1}. ${tb(k).name}`}
                onClick={() => setI(k)} onMouseEnter={() => setI(k)}
                animate={{ scale: i === k ? 1.06 : 0.94, opacity: i === k ? 1 : 0.6 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <b>{k + 1}</b><span>{tb(k).name}</span>
              </motion.button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function StagesSection({ showLink = true }) {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);
  const range = (st) => t.content.stageRange?.[st.id] ?? st.range;
  const points = (st) => t.content.stagePoints?.[st.id] ?? st.points;
  const s = stages[i];
  return (
    <section className="bg-ink" id="stages">
      <div className="container section">
        <div className="section-head">
          <div>
            <Reveal as="p" className="eyebrow">{t.acadEyebrow}</Reveal>
            <Reveal as="h2" className="display h2" delay={0.05} style={{ maxWidth: 640 }}>{t.acadTitle}</Reveal>
          </div>
          {showLink && <Link href="/academics" style={{ color: '#fff', fontWeight: 600 }}>{t.common.fullSyllabus} →</Link>}
        </div>
        <div className="stage-tabs" role="tablist" aria-label="School stages">
          {stages.map((st, k) => (
            <button key={st.id} role="tab" aria-selected={i === k} className="stage-tab" onClick={() => setI(k)}>
              <span style={{ display: 'block', fontSize: 14, color: '#C9CEE6' }}>0{k + 1} · {range(st)}</span>
              <b className="display" style={{ fontSize: 22 }}>{pick(lang, st)}</b>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={s.id} className="stage-panel" role="tabpanel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
            <div>
              <b className="display" style={{ fontSize: 32, display: 'block' }}>{pick(lang, s)}</b>
              <span className="muted">{range(s)} · {t.common.mediumBoth}</span>
            </div>
            <ul className="checks">
              {points(s).map((p, k) => (
                <motion.li key={p} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.07 }}>
                  <Icon name="check" strokeWidth={2.4} style={{ color: 'var(--saffron)', flex: 'none', marginTop: 2 }} /><span>{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export function FacilitiesGrid({ detailed = false }) {
  const { t, lang } = useLang();
  return (
    <Stagger className="fac-grid" gap={0.05}>
      {facilities.map((f, k) => (
        <StaggerItem key={f.name}>
          <Link href={'/facilities#' + f.icon} id={detailed ? f.icon : undefined} className="fac lift" style={detailed ? { alignItems: 'flex-start', minHeight: 132 } : undefined}>
            <span className={'fac-icon ' + (k % 2 ? 'b' : 'a')}><Icon name={f.icon} size={26} /></span>
            <span><b style={{ display: 'block', fontSize: 18 }}>{pick(lang, f)}</b><span style={{ fontSize: detailed ? 16 : 14, color: 'var(--slate)' }}>{t.content.facDesc?.[f.icon] ?? f.desc}</span></span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function FacilitiesSection() {
  const { t } = useLang();
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal as="p" className="eyebrow">{t.facEyebrow}</Reveal>
            <Reveal as="h2" className="display h2" delay={0.05}>{t.facTitle}</Reveal>
          </div>
          <Link href="/facilities" style={{ fontWeight: 600 }}>{t.common.seeAllFac} →</Link>
        </div>
        <FacilitiesGrid />
      </div>
    </section>
  );
}

export function ProgramsSection() {
  const { t } = useLang();
  return (
    <section className="bg-mist" id="programs">
      <div className="container section">
        <Reveal as="p" className="eyebrow">{t.progEyebrow}</Reveal>
        <Reveal as="h2" className="display h2" delay={0.05} style={{ marginBottom: 40, maxWidth: 720 }}>{t.progTitle}</Reveal>
        <Stagger className="prog-grid">
          {programs.map((p0, k) => { const p = { ...p0, ...(t.content.programs?.[k] ?? {}) }; return (
            <StaggerItem key={p.name} style={{ display: 'flex' }}>
             <div className={'prog card lift' + (p.dark ? ' dark' : '')} style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: p.dark ? '#C9CEE6' : 'var(--saffron)' }}>{p.tag}</span>
              <div>
                <b className="display" style={{ fontSize: 30, lineHeight: 1.1, display: 'block', marginBottom: 10 }}>{p.name}</b>
                <span style={{ color: p.dark ? '#DDE1F2' : 'var(--slate)' }}>{p.desc}</span>
              </div>
             </div>
            </StaggerItem>
          ); })}
        </Stagger>
      </div>
    </section>
  );
}
