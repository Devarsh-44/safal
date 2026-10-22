'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { createMessage } from '@/lib/store';
import { validPhone } from './CallbackForm';
import { useLang } from '@/lib/i18n';

export default function ContactForm() {
  const { t } = useLang();
  const c = t.contactForm;
  const [f, setF] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'errName';
    if (!validPhone(f.phone)) er.phone = 'errPhone';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'errEmail';
    if (f.message.trim().length < 5) er.message = 'errMsg';
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus('sending');
    try { await createMessage({ ...f, email: f.email || null }); setStatus('done'); } catch { setStatus('error'); }
  }

  return (
    <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)', boxShadow: 'var(--shadow)' }}>
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
            <span style={{ display: 'inline-flex', width: 72, height: 72, borderRadius: 999, background: '#E3F3EA', color: 'var(--green)', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={36} strokeWidth={2.6} /></span>
            <h3 className="display h3" style={{ margin: '16px 0 8px' }}>{c.done}</h3>
            <p className="muted" style={{ margin: 0 }}>{c.doneBody}</p>
          </motion.div>
        ) : (
          <motion.form key="f" onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
            <h2 className="display h3" style={{ margin: 0 }}>{c.title}</h2>
            <div className="grid-2">
              <label className={'field' + (errors.name ? ' invalid' : '')}>{c.name}<input value={f.name} onChange={set('name')} autoComplete="name" />{errors.name && <span className="err">{c[errors.name]}</span>}</label>
              <label className={'field' + (errors.phone ? ' invalid' : '')}>{c.phone}<input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />{errors.phone && <span className="err">{c[errors.phone]}</span>}</label>
            </div>
            <label className={'field' + (errors.email ? ' invalid' : '')}>{c.email}<input type="email" value={f.email} onChange={set('email')} autoComplete="email" />{errors.email && <span className="err">{c[errors.email]}</span>}</label>
            <label className={'field' + (errors.message ? ' invalid' : '')}>{c.message}<textarea value={f.message} onChange={set('message')} />{errors.message && <span className="err">{c[errors.message]}</span>}</label>
            {status === 'error' && <p className="form-error" role="alert">{c.error}</p>}
            <button className="btn btn-primary btn-lg" disabled={status === 'sending'}>{status === 'sending' ? t.common.sending : c.submit}</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
