'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { createEnquiry, uploadFile } from '@/lib/store';
import { validPhone } from './CallbackForm';
import { school } from '@/lib/content';
import { useLang, pick } from '@/lib/i18n';

const STREAMS = ['Arts', 'Commerce', 'Science'];
const DOCS = ['birth_certificate', 'marksheet', 'leaving_certificate', 'photo'].map((key) => ({ key }));
const DRAFT_KEY = 'sv_admission_draft';
const empty = { student_name: '', dob: '', standard: null, stream: null, medium: 'English', campus: 'Gandhinagar', parent_name: '', relation: 'Father', phone: '', email: '', consent: false };

export default function AdmissionWizard() {
  const { t, lang, branch } = useLang();
  const w = t.wizard;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [f, setF] = useState(empty);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [ref, setRef] = useState(null);
  const top = useRef(null);

  // Restore / auto-save the draft so parents never lose progress.
  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); if (d) { setF({ ...empty, ...d.f }); setStep(Math.min(d.step ?? 0, 3)); } else setF((x) => ({ ...x, campus: school.campuses[branch].name })); } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (ref) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ f, step })); } catch {}
  }, [f, step, ref]);

  const clearErr = (k) => setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); clearErr(k); };
  const needsStream = f.standard >= 11;

  function validate(s) {
    const e = {};
    if (s === 0) {
      if (f.student_name.trim().length < 2) e.student_name = 'errStudent';
      if (!f.dob) e.dob = 'errDob';
      if (!f.standard) e.standard = 'errStd';
      if (needsStream && !f.stream) e.stream = 'errStream';
    }
    if (s === 1) {
      if (f.parent_name.trim().length < 2) e.parent_name = 'errParent';
      if (!validPhone(f.phone)) e.phone = 'errPhone';
      if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'errEmail';
    }
    if (s === 3 && !f.consent) e.consent = 'errConsent';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const next = () => validate(step) && go(step + 1);

  async function submit() {
    if (!validate(3)) return;
    setStatus('sending');
    try {
      const docs = {};
      for (const d of DOCS) if (files[d.key]) docs[d.key] = await uploadFile('admission-docs', files[d.key]);
      const { ref } = await createEnquiry({
        student_name: f.student_name.trim(), dob: f.dob, standard: 'Std ' + f.standard, stream: needsStream ? f.stream : null,
        medium: f.medium, campus: f.campus, parent_name: f.parent_name.trim(), relation: f.relation,
        phone: f.phone.trim(), email: f.email.trim() || null, docs, source: 'website',
      });
      setRef(ref);
      setStatus('done');
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const Err = ({ k }) => (errors[k] ? <span className="err" role="alert">{w[errors[k]]}</span> : null);
  const progress = ref ? 100 : (step + 1) * 25;

  return (
    <div className="wizard" ref={top} style={{ scrollMarginTop: 120 }}>
      <aside>
        <ol className="steps">
          {w.steps.map((label, i) => {
            const done = ref || i < step, cur = !ref && i === step;
            return (
              <li key={i} className={done ? 'done' : cur ? 'cur' : ''}>
                <span className="dot">{done ? <Icon name="check" size={18} strokeWidth={2.6} /> : i + 1}</span>
                {done && !ref ? <button onClick={() => go(i)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}>{label}</button> : label}
              </li>
            );
          })}
        </ol>
        <div className="card" style={{ marginTop: 28, padding: 18, borderRadius: 16, fontSize: 15 }}>
          <b style={{ display: 'block', marginBottom: 4 }}>{w.saved}</b>
          <span className="muted">{w.savedBody} <a href={`tel:${school.phone}`}>{school.phoneDisplay}</a></span>
        </div>
      </aside>

      <main>
        <div className="progress" aria-hidden="true"><div style={{ width: progress + '%' }} /></div>
        <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={dir}>
            {ref ? (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '24px 0' }}>
                <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }} style={{ display: 'inline-flex', width: 88, height: 88, borderRadius: 999, background: '#E3F3EA', color: 'var(--green)', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={44} strokeWidth={2.6} /></motion.span>
                <h2 className="display h3" style={{ fontSize: 34, margin: '20px 0 6px' }}>{w.done}</h2>
                <p className="muted" style={{ margin: '0 0 4px' }}>{w.refLabel}</p>
                <p className="display" style={{ fontSize: 30, letterSpacing: '.06em', margin: '0 0 28px' }}>{ref}</p>
                <ol style={{ textAlign: 'left', maxWidth: 460, margin: '0 auto', padding: 0, listStyle: 'none', display: 'grid', gap: 14 }}>
                  {w.after.map((s, i) => (
                    <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12 }} style={{ display: 'flex', gap: 12 }}><b style={{ color: 'var(--saffron)' }}>{i + 1}</b>{s}</motion.li>
                  ))}
                </ol>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                  <Link href="/" className="btn btn-ghost">{w.backHome}</Link>
                  <a className="btn btn-primary" href={`https://wa.me/${school.whatsapp}?text=${encodeURIComponent(w.waText(ref))}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" />{w.messageUs}</a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step} custom={dir}
                initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                style={{ display: 'grid', gap: 20 }}
              >
                {step === 0 && (
                  <>
                    <h2 className="display h3" style={{ margin: 0 }}>{w.s0}</h2>
                    <div className="grid-2">
                      <label className={'field' + (errors.student_name ? ' invalid' : '')}>{w.studentName}<input value={f.student_name} onChange={(e) => set('student_name', e.target.value)} placeholder={w.studentPh} /><Err k="student_name" /></label>
                      <label className={'field' + (errors.dob ? ' invalid' : '')}>{w.dob}<input type="date" value={f.dob} onChange={(e) => set('dob', e.target.value)} max={new Date().toISOString().slice(0, 10)} /><Err k="dob" /></label>
                    </div>
                    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                      <legend style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{w.applying}</legend>
                      <div className="choice-grid">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <button key={n} type="button" className="choice" aria-pressed={f.standard === n} onClick={() => { setF((x) => ({ ...x, standard: n, stream: n >= 11 ? x.stream : null })); clearErr('standard'); }}>{t.common.std(n)}</button>
                        ))}
                      </div>
                      <div className="field"><Err k="standard" /></div>
                    </fieldset>
                    <AnimatePresence>
                      {needsStream && (
                        <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ border: 0, padding: 0, margin: 0, overflow: 'hidden' }}>
                          <legend style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{w.stream}</legend>
                          <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                            {STREAMS.map((s) => <button key={s} type="button" className="choice" style={{ minHeight: 52 }} aria-pressed={f.stream === s} onClick={() => set('stream', s)}>{t.common.streams[s]}</button>)}
                          </div>
                          <div className="field"><Err k="stream" /></div>
                        </motion.fieldset>
                      )}
                    </AnimatePresence>
                    <div className="grid-2">
                      <label className="field">{w.medium}<select value={f.medium} onChange={(e) => set('medium', e.target.value)}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select></label>
                      <label className="field">{w.campus}<select value={f.campus} onChange={(e) => set('campus', e.target.value)}>{school.campuses.map((c) => <option key={c.id} value={c.name}>{pick(lang, c)}</option>)}</select></label>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="display h3" style={{ margin: 0 }}>{w.s1}</h2>
                    <div className="grid-2">
                      <label className={'field' + (errors.parent_name ? ' invalid' : '')}>{w.parentName}<input value={f.parent_name} onChange={(e) => set('parent_name', e.target.value)} autoComplete="name" /><Err k="parent_name" /></label>
                      <label className="field">{w.relation}<select value={f.relation} onChange={(e) => set('relation', e.target.value)}>{['Father', 'Mother', 'Guardian'].map((r) => <option key={r} value={r}>{t.common.relations[r]}</option>)}</select></label>
                      <label className={'field' + (errors.phone ? ' invalid' : '')}>{w.phone}<input type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" /><Err k="phone" /></label>
                      <label className={'field' + (errors.email ? ' invalid' : '')}>{w.email}<input type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" /></label>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="display h3" style={{ margin: 0 }}>{w.s2} <span className="muted" style={{ fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-body)' }}>{w.s2note}</span></h2>
                    {DOCS.map((d) => {
                      const file = files[d.key];
                      return (
                        <motion.div key={d.key} layout className={'doc' + (file ? ' ok' : '')} style={{ position: 'relative' }}>
                          <span style={{ color: 'var(--indigo)' }}><Icon name="file" size={24} /></span>
                          <span style={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block' }}>{w.docs[d.key]}</b><span className="muted" style={{ fontSize: 14, overflowWrap: 'anywhere' }}>{file ? file.name : w.docHint}</span></span>
                          {file ? (
                            <button type="button" className="btn btn-ghost" onClick={() => setFiles((x) => ({ ...x, [d.key]: null }))}>{w.remove}</button>
                          ) : (
                            <label className="btn btn-outline" style={{ cursor: 'pointer' }}>{w.upload}
                              <input type="file" accept="image/*,application/pdf" onChange={(e) => {
                                const fl = e.target.files?.[0];
                                if (fl && fl.size > 5 * 1024 * 1024) { alert(w.tooBig); return; }
                                if (fl) setFiles((x) => ({ ...x, [d.key]: fl }));
                              }} />
                            </label>
                          )}
                        </motion.div>
                      );
                    })}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="display h3" style={{ margin: 0 }}>{w.s3}</h2>
                    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, background: 'var(--mist)', borderRadius: 16, padding: 20 }}>
                      {[
                        [w.review.student, f.student_name], [w.review.dob, f.dob],
                        [w.review.applying, `${t.common.std(f.standard)}${needsStream ? ' · ' + t.common.streams[f.stream] : ''}`],
                        [w.review.campusMedium, `${pick(lang, school.campuses.find((c) => c.name === f.campus) ?? { name: f.campus })} · ${t.common.mediums[f.medium]}`],
                        [w.review.parent, `${f.parent_name} (${t.common.relations[f.relation]})`], [w.review.mobile, f.phone],
                        [w.review.documents, w.docsCount(DOCS.filter((d) => files[d.key]).length)],
                      ].map(([k, v]) => <div key={k}><dt className="muted" style={{ fontSize: 14 }}>{k}</dt><dd style={{ margin: 0, fontWeight: 700 }}>{v}</dd></div>)}
                    </dl>
                    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15 }}>
                      <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} style={{ width: 20, height: 20, marginTop: 3 }} />
                      {w.consent}
                    </label>
                    <div className="field"><Err k="consent" /></div>
                    {status === 'error' && <p className="form-error" role="alert">{w.error(school.phoneDisplay)}</p>}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!ref && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>{w.back}</button>
              {step < 3 ? (
                <button type="button" className="btn btn-primary btn-lg" onClick={next}>{w.next} <Icon name="arrow" size={20} /></button>
              ) : (
                <button type="button" className="btn btn-primary btn-lg" onClick={submit} disabled={status === 'sending'}>{status === 'sending' ? w.submitting : w.submit}</button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
