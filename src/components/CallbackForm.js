'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { Chakra, Reveal } from './Motion';
import { createEnquiry } from '@/lib/store';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';

// Stored values stay in English; `label` renders them in the visitor's language.
const standards = [...Array.from({ length: 10 }, (_, i) => ['Std ' + (i + 1), i + 1]), ['Std 11 — Science', 11, 'Science'], ['Std 11 — Commerce', 11, 'Commerce'], ['Std 11 — Arts', 11, 'Arts'], ['Std 12', 12]];
export const validPhone = (p) => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.trim());

export default function CallbackForm() {
  const { t, branch } = useLang();
  const c = t.callback;
  const label = ([, n, stream]) => t.common.std(n) + (stream ? ' — ' + t.common.streams[stream] : '');
  const [form, setForm] = useState({ parent_name: '', phone: '', standard: 'Std 1', medium: 'English' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (form.parent_name.trim().length < 2) errs.parent_name = 'errName';
    if (!validPhone(form.phone)) errs.phone = 'errPhone';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState('sending');
    try {
      await createEnquiry({ ...form, source: 'callback', campus: school.campuses[branch].name });
      setState('done');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="visit" className="container" style={{ paddingBottom: 96 }}>
      <Reveal className="visit">
        <Chakra size={420} color="#ffffff" opacity={0.15} className="chakra-bg" style={{ left: -140, bottom: -180 }} speed={40} />
        <div style={{ position: 'relative' }}>
          <h2 className="display h2" style={{ marginBottom: 16 }}>{t.visitTitle}</h2>
          <p style={{ margin: 0, fontSize: 19, color: '#FFE6D6', maxWidth: 460 }}>{t.visitBody}</p>
          <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', gap: 10, alignItems: 'center', marginTop: 24, fontWeight: 700 }}><Icon name="whatsapp" />{t.common.chatWa}</a>
        </div>
        <div className="form-box">
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '36px 8px' }}>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }} style={{ display: 'inline-flex', width: 64, height: 64, borderRadius: 999, background: '#E3F3EA', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}><Icon name="check" size={30} strokeWidth={2.6} /></motion.span>
                <b className="display" style={{ display: 'block', fontSize: 26, marginTop: 16 }}>{c.done}</b>
                <p className="muted" style={{ margin: '8px 0 16px' }}>{c.doneBody(form.parent_name.split(' ')[0], form.phone)}</p>
                <button className="btn btn-ghost" onClick={() => { setState('idle'); setForm({ ...form, parent_name: '', phone: '' }); }}>{c.another}</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate style={{ display: 'grid', gap: 14 }} exit={{ opacity: 0, y: -10 }}>
                <label className={'field' + (errors.parent_name ? ' invalid' : '')}>{c.name}
                  <input value={form.parent_name} onChange={set('parent_name')} autoComplete="name" placeholder={c.namePh} />
                  {errors.parent_name && <span className="err">{c[errors.parent_name]}</span>}
                </label>
                <label className={'field' + (errors.phone ? ' invalid' : '')}>{c.phone}
                  <input value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" />
                  {errors.phone && <span className="err">{c[errors.phone]}</span>}
                </label>
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <label className="field">{c.standard}<select value={form.standard} onChange={set('standard')}>{standards.map((s) => <option key={s[0]} value={s[0]}>{label(s)}</option>)}</select></label>
                  <label className="field">{c.medium}<select value={form.medium} onChange={set('medium')}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select></label>
                </div>
                {state === 'error' && <p className="form-error" role="alert">{c.error(school.phoneDisplay)}</p>}
                <button className="btn btn-dark btn-lg" disabled={state === 'sending'}>{state === 'sending' ? t.common.sending : c.submit}</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
