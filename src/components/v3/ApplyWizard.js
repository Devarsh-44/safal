'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createEnquiry, uploadFile } from '@/lib/store';
import { validPhone } from '@/components/CallbackForm';
import { school } from '@/lib/content';
import { useLang, pick } from '@/lib/i18n';
import { Ink } from './Marks';

const STREAMS = ['Arts', 'Commerce', 'Science'];
const DOCS = ['birth_certificate', 'marksheet', 'leaving_certificate', 'photo'];
const DRAFT_KEY = 'sv_admission_draft';
const MAX_BYTES = 5 * 1024 * 1024;
const empty = { student_name: '', dob: '', standard: null, stream: null, medium: 'English', campus: 'Gandhinagar', parent_name: '', relation: 'Father', phone: '', email: '', consent: false };

/**
 * Four-step admission enquiry on a frosted glass card. Same data as the v2 wizard, so the admin
 * panel reads it unchanged. The draft saves on this device; `/admissions?std=N` pre-picks a standard.
 */
export default function ApplyWizard() {
  const { t, lang, branch } = useLang();
  const w = t.wizard;
  const [step, setStep] = useState(0);
  const [back, setBack] = useState(false);
  const [f, setF] = useState(empty);
  const [files, setFiles] = useState({});
  const [fileErr, setFileErr] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [ref, setRef] = useState(null);
  const top = useRef(null);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (d) { setF({ ...empty, ...d.f }); setStep(Math.min(d.step ?? 0, 3)); } else setF((x) => ({ ...x, campus: school.campuses[branch].name }));
    } catch {}
    const std = Number(new URLSearchParams(window.location.search).get('std'));
    if (std >= 1 && std <= 12) { setF((x) => ({ ...x, standard: std, stream: std >= 11 ? x.stream : null })); setStep(0); }
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

  const go = (n) => { setBack(n < step); setStep(n); top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const next = () => validate(step) && go(step + 1);

  async function submit() {
    if (!validate(3)) return;
    setStatus('sending');
    try {
      const docs = {};
      for (const key of DOCS) if (files[key]) docs[key] = await uploadFile('admission-docs', files[key]);
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

  function pickFile(key, fl) {
    if (!fl) return;
    if (fl.size > MAX_BYTES) { setFileErr((x) => ({ ...x, [key]: true })); return; }
    setFileErr((x) => ({ ...x, [key]: false }));
    setFiles((x) => ({ ...x, [key]: fl }));
  }

  const Err = ({ k }) => (errors[k] ? <span className="err" role="alert">{w[errors[k]]}</span> : null);
  const progress = ref ? 100 : (step + 1) * 25;

  return (
    <div className="wiz" ref={top} style={{ scrollMarginTop: 100 }}>
      <ol className="wiz-rail gl">
        {w.steps.map((label, i) => {
          const done = ref || i < step, cur = !ref && i === step;
          return (
            <li key={label} className={done ? 'done' : cur ? 'cur' : ''} aria-current={cur ? 'step' : undefined}>
              <span className="dot">{done ? <Ink kind="tick" color="#34B470" width={3.5} play /> : i + 1}</span>
              <span className="lbl">{done && !ref ? <button type="button" onClick={() => go(i)}>{label}</button> : label}</span>
            </li>
          );
        })}
        <li className="help"><b>{w.saved}</b>{w.savedBody} <a href={`tel:${school.phone}`}>{school.phoneDisplay}</a></li>
      </ol>

      <div className="wiz-card" aria-live="polite">
        <div className="wiz-bar" aria-hidden="true"><i style={{ width: progress + '%' }} /></div>

        {ref ? (
          <div className="wiz-done">
            <Ink kind="tick" color="#34B470" width={3} play />
            <h3>{w.done}</h3>
            <p>{w.refLabel}</p>
            <p className="ref">{ref}</p>
            <ol>{w.after.map((s) => <li key={s}>{s}</li>)}</ol>
            <div className="row">
              <Link href="/" className="btn btn-line">{w.backHome}</Link>
              <a className="btn btn-apply" href={`https://wa.me/${school.whatsapp}?text=${encodeURIComponent(w.waText(ref))}`} target="_blank" rel="noopener noreferrer">{w.messageUs}</a>
            </div>
          </div>
        ) : (
          <div key={step} className={'wiz-step' + (back ? ' back' : '')}>
            {step === 0 && (
              <>
                <h3>{w.s0}</h3>
                <div className="grid2">
                  <label className={'fld' + (errors.student_name ? ' bad' : '')} htmlFor="w-student">{w.studentName}
                    <input id="w-student" value={f.student_name} onChange={(e) => set('student_name', e.target.value)} placeholder={w.studentPh} /><Err k="student_name" />
                  </label>
                  <label className={'fld' + (errors.dob ? ' bad' : '')} htmlFor="w-dob">{w.dob}
                    <input id="w-dob" type="date" value={f.dob} onChange={(e) => set('dob', e.target.value)} max={new Date().toISOString().slice(0, 10)} /><Err k="dob" />
                  </label>
                </div>
                <fieldset>
                  <legend>{w.applying}</legend>
                  <div className="chooser">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <button key={n} type="button" aria-pressed={f.standard === n} onClick={() => { setF((x) => ({ ...x, standard: n, stream: n >= 11 ? x.stream : null })); clearErr('standard'); }}>{t.common.std(n)}</button>
                    ))}
                  </div>
                  <span className="fld"><Err k="standard" /></span>
                </fieldset>
                {needsStream && (
                  <fieldset className="wiz-step">
                    <legend>{w.stream}</legend>
                    <div className="chooser three">
                      {STREAMS.map((s) => <button key={s} type="button" aria-pressed={f.stream === s} onClick={() => set('stream', s)}>{t.common.streams[s]}</button>)}
                    </div>
                    <span className="fld"><Err k="stream" /></span>
                  </fieldset>
                )}
                <div className="grid2">
                  <label className="fld" htmlFor="w-medium">{w.medium}
                    <select id="w-medium" value={f.medium} onChange={(e) => set('medium', e.target.value)}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select>
                  </label>
                  <label className="fld" htmlFor="w-campus">{w.campus}
                    <select id="w-campus" value={f.campus} onChange={(e) => set('campus', e.target.value)}>{school.campuses.map((c) => <option key={c.id} value={c.name}>{pick(lang, c)}</option>)}</select>
                  </label>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3>{w.s1}</h3>
                <div className="grid2">
                  <label className={'fld' + (errors.parent_name ? ' bad' : '')} htmlFor="w-parent">{w.parentName}
                    <input id="w-parent" value={f.parent_name} onChange={(e) => set('parent_name', e.target.value)} autoComplete="name" /><Err k="parent_name" />
                  </label>
                  <label className="fld" htmlFor="w-relation">{w.relation}
                    <select id="w-relation" value={f.relation} onChange={(e) => set('relation', e.target.value)}>{['Father', 'Mother', 'Guardian'].map((r) => <option key={r} value={r}>{t.common.relations[r]}</option>)}</select>
                  </label>
                  <label className={'fld' + (errors.phone ? ' bad' : '')} htmlFor="w-phone">{w.phone}
                    <input id="w-phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" /><Err k="phone" />
                  </label>
                  <label className={'fld' + (errors.email ? ' bad' : '')} htmlFor="w-email">{w.email}
                    <input id="w-email" type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" />
                  </label>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3>{w.s2}<small>{w.s2note}</small></h3>
                {DOCS.map((key) => {
                  const file = files[key];
                  return (
                    <div key={key} className={'doc' + (file ? ' ok' : '')}>
                      <span className="name">
                        <b>{w.docs[key]}</b>
                        <span>{file ? file.name : w.docHint}</span>
                        {fileErr[key] && <span className="err" role="alert">{w.tooBig}</span>}
                      </span>
                      {file ? (
                        <button type="button" className="btn btn-line" onClick={() => setFiles((x) => ({ ...x, [key]: null }))}>{w.remove}</button>
                      ) : (
                        <label className="btn btn-ink up">{w.upload}
                          <input type="file" accept="image/*,application/pdf" aria-label={w.docs[key]} onChange={(e) => pickFile(key, e.target.files?.[0])} />
                        </label>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {step === 3 && (
              <>
                <h3>{w.s3}</h3>
                <dl className="review">
                  {[
                    [w.review.student, f.student_name], [w.review.dob, f.dob],
                    [w.review.applying, `${t.common.std(f.standard)}${needsStream ? ' · ' + t.common.streams[f.stream] : ''}`],
                    [w.review.campusMedium, `${pick(lang, school.campuses.find((c) => c.name === f.campus) ?? { name: f.campus })} · ${t.common.mediums[f.medium]}`],
                    [w.review.parent, `${f.parent_name} (${t.common.relations[f.relation]})`], [w.review.mobile, f.phone],
                    [w.review.documents, w.docsCount(DOCS.filter((k) => files[k]).length)],
                  ].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <label className="consent" htmlFor="w-consent">
                  <input id="w-consent" type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
                  {w.consent}
                </label>
                <span className="fld"><Err k="consent" /></span>
                {status === 'error' && <p className="form-err" role="alert">{w.error(school.phoneDisplay)}</p>}
              </>
            )}
          </div>
        )}

        {!ref && (
          <div className="wiz-nav">
            <button type="button" className="btn btn-line" onClick={() => go(step - 1)} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>{w.back}</button>
            {step < 3 ? (
              <button type="button" className="btn btn-ink" onClick={next}>{w.next} →</button>
            ) : (
              <button type="button" className="btn btn-apply" onClick={submit} disabled={status === 'sending'}>{status === 'sending' ? w.submitting : w.submit}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
