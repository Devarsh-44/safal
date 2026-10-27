'use client';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import { createEnquiry } from '@/lib/store';
import { validPhone } from '@/lib/validate';
import Sheet from './Sheet';
import { Ink, Mark } from './Marks';

// Stored values stay in English (the admin reads them); `label` shows them in the visitor's language.
const standards = [...Array.from({ length: 10 }, (_, i) => ['Std ' + (i + 1), i + 1]), ['Std 11 — Science', 11, 'Science'], ['Std 11 — Commerce', 11, 'Commerce'], ['Std 11 — Arts', 11, 'Arts'], ['Std 12', 12]];

/** Three steps on a sky field, with the call-back form. Sending it draws a tick. */
export default function Admissions() {
  const { t, branch } = useLang();
  const v = t.v3.admissions;
  const c = t.callback;
  const label = ([, n, stream]) => t.common.std(n) + (stream ? ' — ' + t.common.streams[stream] : '');
  const blank = { parent_name: '', phone: '', standard: 'Std 1', medium: 'English' };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (form.parent_name.trim().length < 2) errs.parent_name = c.errName;
    if (!validPhone(form.phone)) errs.phone = c.errPhone;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState('sending');
    try {
      await createEnquiry({ ...form, source: 'home-v3', campus: school.campuses[branch].name });
      setState('done');
    } catch {
      setState('error');
    }
  }

  return (
    <Sheet id="admissions" note={v.note}>
      <div className="adm">
        <div>
          <div className="head">
            <p className="eyebrow">{v.eyebrow}</p>
            <h2 className="h2">{v.a} <Mark kind="circle" color="var(--on-field)" width={4}>{v.mark}</Mark>{v.b ? ' ' + v.b : ''}</h2>
          </div>
          <ol className="steps">{v.steps.map(([title, body]) => <li key={title}><div><b>{title}</b><p>{body}</p></div></li>)}</ol>
        </div>

        <div className="form" aria-live="polite">
          {state === 'done' ? (
            <div className="done">
              <Ink kind="tick" color="#34B470" width={3} play />
              <b>{v.done}</b>
              <p>{v.doneBody(form.parent_name.trim().split(' ')[0])}</p>
              <button type="button" className="btn btn-line" onClick={() => { setForm(blank); setState('idle'); }}>{c.another}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 14 }}>
              <h3>{v.formTitle}</h3>
              <label className={'fld' + (errors.parent_name ? ' bad' : '')} htmlFor="v3-name">{c.name}
                <input id="v3-name" value={form.parent_name} onChange={set('parent_name')} autoComplete="name" placeholder={c.namePh} />
                {errors.parent_name && <span className="err">{errors.parent_name}</span>}
              </label>
              <label className={'fld' + (errors.phone ? ' bad' : '')} htmlFor="v3-phone">{c.phone}
                <input id="v3-phone" value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" />
                {errors.phone && <span className="err">{errors.phone}</span>}
              </label>
              <div className="two">
                <label className="fld" htmlFor="v3-std">{c.standard}
                  <select id="v3-std" value={form.standard} onChange={set('standard')}>{standards.map((s) => <option key={s[0]} value={s[0]}>{label(s)}</option>)}</select>
                </label>
                <label className="fld" htmlFor="v3-medium">{c.medium}
                  <select id="v3-medium" value={form.medium} onChange={set('medium')}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select>
                </label>
              </div>
              {state === 'error' && <p className="form-err" role="alert">{c.error(school.phoneDisplay)}</p>}
              <button className="btn btn-apply" disabled={state === 'sending'}>{state === 'sending' ? t.common.sending : c.submit}</button>
            </form>
          )}
        </div>
      </div>
    </Sheet>
  );
}
