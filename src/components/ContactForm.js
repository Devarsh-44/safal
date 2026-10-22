'use client';
import { useState } from 'react';
import { createMessage } from '@/lib/store';
import { validPhone } from './CallbackForm';
import { useLang } from '@/lib/i18n';

/** "Drop us a line", set as the page's clip-out coupon: heading on the stub, fields on the ticket. */
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

  const Err = ({ k }) => (errors[k] ? <span className="ph-err">{c[errors[k]]}</span> : null);

  return (
    <section className="ph-visit" id="write">
      <div className="ph-coupon" data-reveal>
        <div className="ph-coupon-left">
          <h2 className="ph-h2">{c.title}</h2>
          <span className="ph-stub-photo" aria-hidden="true"><img src="/images/live/safal-boy.webp" alt="" loading="lazy" style={{ objectPosition: '45% 40%' }} /></span>
          <p>{c.doneBody}</p>
        </div>
        <div className="ph-coupon-right">
          {status === 'done' ? (
            <div className="ph-done" role="status"><b>{c.done}</b><p>{c.doneBody}</p></div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label><span className="sr-only">{c.name}</span><input value={f.name} onChange={set('name')} placeholder={c.name} autoComplete="name" aria-invalid={!!errors.name} /></label>
              <Err k="name" />
              <label><span className="sr-only">{c.phone}</span><input type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} placeholder={c.phone} autoComplete="tel" aria-invalid={!!errors.phone} /></label>
              <Err k="phone" />
              <label><span className="sr-only">{c.email}</span><input type="email" value={f.email} onChange={set('email')} placeholder={c.email} autoComplete="email" aria-invalid={!!errors.email} /></label>
              <Err k="email" />
              <label><span className="sr-only">{c.message}</span><textarea value={f.message} onChange={set('message')} placeholder={c.message} rows={4} aria-invalid={!!errors.message} /></label>
              <Err k="message" />
              {status === 'error' && <span className="ph-err" role="alert">{c.error}</span>}
              <button className="ph-submit" disabled={status === 'sending'}>{status === 'sending' ? t.common.sending : c.submit}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
