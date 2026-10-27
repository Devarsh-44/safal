'use client';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import { createMessage } from '@/lib/store';
import { validPhone } from '@/lib/validate';
import { media } from '@/lib/media';
import PageHero from './PageHero';
import Sheet from './Sheet';
import { Ink } from './Marks';
import { Head, useReveal } from './Reveal';

// The admin panel reads messages in English, so the topic prefix stays English whatever the page language.
const TOPICS_EN = ['Admissions', 'Fees', 'Transport', 'Campus visit', 'Other'];
const MAP_QUERY = 'Safal Vidyalaya, Sector 22, Gandhinagar';

const ICONS = {
  call: <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />,
  wa: <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.7 12.6c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.9.9-2.1c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />,
  email: <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm8 7.2L4.6 7v10.4h14.8V7z" />,
  hours: <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm-.9 4v5.6l4.6 2.8.9-1.4-3.8-2.3V7z" />,
};
const Icon = ({ name }) => <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>;

/**
 * The contact form as a note on ruled paper. On send the note folds away into a paper plane that
 * flies off the page, then a teacher's tick confirms it arrived. Messages land in the admin panel.
 */
function NoteForm() {
  const { t } = useLang();
  const v = t.v3.ct.form;
  const blank = { name: '', phone: '', email: '', message: '' };
  const [topic, setTopic] = useState(0);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | flying | done | error
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = v.errName;
    if (!validPhone(f.phone)) er.phone = v.errPhone;
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = v.errEmail;
    if (f.message.trim().length < 5) er.message = v.errMsg;
    setErr(er);
    if (Object.keys(er).length) return;
    setStatus('sending');
    try {
      await createMessage({ name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim() || null, message: `[${TOPICS_EN[topic]}] ${f.message.trim()}` });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStatus('done'); return; }
      setStatus('flying');
      setTimeout(() => setStatus('done'), 1700);
    } catch {
      setStatus('error');
    }
  };

  const again = () => { setF(blank); setErr({}); setTopic(0); setStatus('idle'); };
  const field = (k, label, props = {}) => (
    <label className={'line' + (err[k] ? ' bad' : '')}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} {...props} />
      {err[k] && <em className="err" role="alert">{err[k]}</em>}
    </label>
  );

  return (
    <div className={'note-stage ' + status} aria-live="polite">
      {status !== 'done' && (
        <form className="page note-paper" onSubmit={submit} noValidate>
          <h2>{v.title}</h2>
          <div className="topics" role="group" aria-label={v.topicLabel}>
            <span>{v.topicLabel}</span>
            {v.topics.map((tp, i) => <button key={tp} type="button" aria-pressed={topic === i} onClick={() => setTopic(i)}>{tp}</button>)}
          </div>
          {field('name', v.name, { autoComplete: 'name' })}
          {field('phone', v.phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
          {field('email', v.email, { type: 'email', autoComplete: 'email' })}
          <label className={'line area' + (err.message ? ' bad' : '')}>
            <span>{v.message}</span>
            <textarea rows={4} value={f.message} onChange={set('message')} aria-invalid={!!err.message} />
            {err.message && <em className="err" role="alert">{err.message}</em>}
          </label>
          {status === 'error' && <p className="err" role="alert">{v.error}</p>}
          <div className="send-row">
            <button className="btn btn-apply" disabled={status === 'sending' || status === 'flying'}>
              {status === 'sending' ? v.sending : status === 'flying' ? v.flying : v.send} <span aria-hidden="true">✈</span>
            </button>
          </div>
        </form>
      )}
      {status === 'flying' && (
        <svg className="plane" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M4 30 L60 6 L44 58 L30 38 Z" fill="#fff" stroke="#241D5C" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M60 6 L30 38 L26 54 L36 42" fill="#DCE5F5" stroke="#241D5C" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      )}
      {status === 'done' && (
        <div className="page note-done">
          <span className="big-tick"><Ink kind="tick" color="var(--leaf)" width={4} play /></span>
          <h2>{v.done}</h2>
          <p>{v.doneBody}</p>
          <button type="button" className="btn btn-line" onClick={again}>{v.another}</button>
        </div>
      )}
    </div>
  );
}

function Reach() {
  const { t } = useLang();
  const v = t.v3.ct.reach;
  const [ref, cls] = useReveal(0.2);
  const cards = [
    ['call', v.call, school.phoneDisplay, v.callBody, `tel:${school.phone}`, '#FDE7DA'],
    ['wa', v.wa, school.phoneDisplay, v.waBody, `https://wa.me/${school.whatsapp}?text=${encodeURIComponent(v.waText)}`, '#DCF3E6'],
    ['email', v.email, school.email, v.emailBody, `mailto:${school.email}`, '#DDF2FC'],
    ['hours', v.hours, v.hoursBody, v.confirm, null, '#FFF1C9'],
  ];
  return (
    <div className="reach">
      <p className="eyebrow">{v.eyebrow}</p>
      <ul className={'reach-cards rv-deal' + cls} ref={ref}>
        {cards.map(([icon, title, value, body, href, tint]) => {
          const inner = (
            <>
              <span className="ic"><Icon name={icon} /></span>
              <span className="txt"><b>{title}</b><span className="val">{value}</span><small>{body}</small></span>
              {href && <i className="arrow" aria-hidden="true">→</i>}
            </>
          );
          return (
            <li key={icon} style={{ '--tint': tint }}>
              {href ? <a href={href} target={icon === 'wa' ? '_blank' : undefined} rel={icon === 'wa' ? 'noopener noreferrer' : undefined}>{inner}</a> : <div>{inner}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Write() {
  const { t } = useLang();
  const v = t.v3.ct.form;
  return (
    <Sheet id="write" note={v.note}>
      <div className="contact-grid">
        <NoteForm />
        <Reach />
      </div>
    </Sheet>
  );
}

function Find() {
  const { t, lang } = useLang();
  const v = t.v3.ct.find;
  const [ref, cls] = useReveal(0.2);
  const [mapRef, mapCls] = useReveal(0.25);
  const local = (c) => c[lang] || c.name;
  return (
    <Sheet id="find" note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <div className="find">
        <figure className={'map-frame rv-rise' + mapCls} ref={mapRef}>
          <iframe title={v.mapTitle} src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </figure>
        <div className={'campus-cards rv-slide' + cls} ref={ref}>
          {school.campuses.map((c) => (
            <article key={c.id} className="index-card campus-card">
              <h3>{local(c)}</h3>
              <p>{c.address}</p>
              <div className="row">
                {!c.address.includes('[') && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Safal Vidyalaya ' + c.address)}`} target="_blank" rel="noopener noreferrer">{v.map} →</a>}
                {!c.phone.includes('[') && <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{v.call} {c.phone}</a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

export default function ContactPage() {
  const { t } = useLang();
  const v = t.v3.ct;
  return (
    <div className="pg-contact">
      <PageHero photo={media.boy.src} pos={media.boy.pos} color="var(--teal)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} b={v.b} intro={v.intro}>
        <a className="btn btn-apply" href="#write">{v.cta}</a>
        <a className="btn btn-line" href={`tel:${school.phone}`}>{v.call}</a>
      </PageHero>
      <Write />
      <Find />
    </div>
  );
}
