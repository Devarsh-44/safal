'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icons';
import { createApplication, uploadFile } from '@/lib/store';
import { validPhone } from './CallbackForm';
import { useLang } from '@/lib/i18n';

const empty = { name: '', subject: '', phone: '', email: '', address: '', experience: '', qualification: '', joining_date: '', message: '' };

export default function CareerForm() {
  const { t } = useLang();
  const c = t.career;
  const [f, setF] = useState(empty);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'errName';
    if (!f.subject.trim()) er.subject = 'errSubject';
    if (!validPhone(f.phone)) er.phone = 'errPhone';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'errEmail';
    if (!resume) er.resume = 'errResume';
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus('sending');
    try {
      const resume_path = await uploadFile('resumes', resume);
      await createApplication({ ...f, joining_date: f.joining_date || null, resume_path });
      setStatus('done');
    } catch (err) { console.error(err); setStatus('error'); }
  }

  const F = ({ k, label, children }) => (
    <label className={'field' + (errors[k] ? ' invalid' : '')}>{label}{children}{errors[k] && <span className="err">{c[errors[k]]}</span>}</label>
  );

  return (
    <div className="card" data-reveal style={{ '--d': 1, padding: 'clamp(20px, 4vw, 36px)' }}>
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
            <span style={{ display: 'inline-flex', width: 72, height: 72, borderRadius: 999, background: '#E3F3EA', color: 'var(--green)', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={36} strokeWidth={2.6} /></span>
            <h3 className="display h3" style={{ margin: '16px 0 8px' }}>{c.done}</h3>
            <p className="muted" style={{ margin: 0 }}>{c.doneBody(f.name.split(' ')[0])}</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
            <h2 className="display h3" style={{ margin: 0 }}>{c.title}</h2>
            <div className="grid-2">
              {F({ k: 'name', label: c.name, children: <input value={f.name} onChange={set('name')} autoComplete="name" /> })}
              {F({ k: 'subject', label: c.subject, children: <input value={f.subject} onChange={set('subject')} placeholder={c.subjectPh} /> })}
              {F({ k: 'phone', label: c.phone, children: <input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /> })}
              {F({ k: 'email', label: c.email, children: <input type="email" value={f.email} onChange={set('email')} autoComplete="email" /> })}
              {F({ k: 'experience', label: c.experience, children: <input value={f.experience} onChange={set('experience')} placeholder={c.experiencePh} /> })}
              {F({ k: 'qualification', label: c.qualification, children: <input value={f.qualification} onChange={set('qualification')} placeholder={c.qualificationPh} /> })}
              {F({ k: 'joining_date', label: c.joining, children: <input type="date" value={f.joining_date} onChange={set('joining_date')} /> })}
              {F({ k: 'address', label: c.address, children: <input value={f.address} onChange={set('address')} autoComplete="street-address" /> })}
            </div>
            <div className={'field' + (errors.resume ? ' invalid' : '')}>
              {c.cv}
              <label className={'doc' + (resume ? ' ok' : '')} style={{ cursor: 'pointer', position: 'relative' }}>
                <span style={{ color: 'var(--indigo)' }}><Icon name="file" /></span>
                <span style={{ flex: 1, fontWeight: 500 }}>{resume ? resume.name : c.cvPick}</span>
                <span className="btn btn-outline" style={{ minHeight: 40, padding: '6px 16px' }}>{resume ? c.change : c.browse}</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] ?? null)} />
              </label>
              {errors.resume && <span className="err">{c[errors.resume]}</span>}
            </div>
            <label className="field">{c.message}<textarea value={f.message} onChange={set('message')} /></label>
            {status === 'error' && <p className="form-error" role="alert">{c.error}</p>}
            <button className="btn btn-primary btn-lg" disabled={status === 'sending'}>{status === 'sending' ? t.common.sending : c.submit}</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
