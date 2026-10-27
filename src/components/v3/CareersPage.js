'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import { media } from '@/lib/media';
import { createApplication, uploadFile } from '@/lib/store';
import { validPhone } from '@/lib/validate';
import { v3Strings } from '@/lib/v3Strings';
import PageHero from './PageHero';
import Sheet from './Sheet';
import { Ink, useInView } from './Marks';
import { Head, useReveal } from './Reveal';

// Facts about each sample role that don't change with language, in the order of t.v3.cr.roles.items.
const ROLES = [
  { id: 'maths', campus: 'gandhinagar', type: 'teaching', tint: '#DDF2FC' },
  { id: 'physics', campus: 'gandhinagar', type: 'teaching', tint: '#DCF3E6' },
  { id: 'primary', campus: 'ahmedabad', type: 'teaching', tint: '#FFF1C9' },
  { id: 'robotics', campus: 'gandhinagar', type: 'teaching', tint: '#E9E3FF' },
  { id: 'sports', campus: 'gandhinagar', type: 'teaching', tint: '#FDE7DA' },
  { id: 'office', campus: 'gandhinagar', type: 'staff', tint: '#FCE4EE' },
];
// The admin panel lists applications in English, so the role saved is always the English title.
const ROLE_EN = v3Strings.en.cr.roles.items.map(([title]) => title);
const CV_TYPES = /\.(pdf|docx?)$/i;
const CV_MAX = 5 * 1024 * 1024;
const WHY_TINTS = ['#FCE4EE', '#DDF2FC', '#DCF3E6', '#FFF1C9'];

function Why() {
  const { t } = useLang();
  const v = t.v3.cr.why;
  const [ref, cls] = useReveal(0.2);
  return (
    <Sheet note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ul className={'perks rv-deal' + cls} ref={ref}>
        {v.items.map(([title, body], i) => (
          <li key={title} style={{ '--tint': WHY_TINTS[i] }}>
            <span className="no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ul>
      <p className="confirm">{v.confirm}</p>
    </Sheet>
  );
}

/** Open roles pinned as notices, filtered by type and campus. "Apply" hands the role to the form below. */
function Roles({ onApply }) {
  const { t, lang } = useLang();
  const v = t.v3.cr.roles;
  const [type, setType] = useState('all');
  const [campus, setCampus] = useState('all');
  const [ref, cls] = useReveal(0.15);
  const campusName = (id) => { const c = school.campuses.find((x) => x.id === id); return c ? c[lang] || c.name : id; };
  const shown = ROLES.map((r, i) => i).filter((i) => (type === 'all' || ROLES[i].type === type) && (campus === 'all' || ROLES[i].campus === campus));
  return (
    <Sheet id="roles" note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <div className="role-filters">
        <div className="chips" role="group" aria-label={v.eyebrow}>
          {[['all', v.all], ['teaching', v.teaching], ['staff', v.staff]].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={type === id} onClick={() => setType(id)}>{label}</button>
          ))}
        </div>
        <div className="chips" role="group" aria-label={t.v3.footer.campuses}>
          {[['all', v.campusAll], ...school.campuses.map((c) => [c.id, campusName(c.id)])].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={campus === id} onClick={() => setCampus(id)}>{label}</button>
          ))}
        </div>
      </div>
      <ul className={'jobs rv-drop' + cls} ref={ref}>
        {shown.map((i) => {
          const [title, std, medium, body] = v.items[i];
          return (
            <li key={ROLES[i].id} className="job" style={{ '--tint': ROLES[i].tint }}>
              <div className="job-top">
                <span className="tag">{ROLES[i].type === 'teaching' ? v.teaching : v.staff}</span>
                <span className="tag ghost">{v.fulltime}</span>
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
              <ul className="facts">
                <li>{std}</li><li>{medium}</li><li>{campusName(ROLES[i].campus)}</li>
              </ul>
              <button type="button" className="btn btn-ink" onClick={() => onApply(i)}>{v.apply} →</button>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="board-msg">{v.empty}</p>}
      <p className="confirm">{v.sample}</p>
    </Sheet>
  );
}

function Steps() {
  const { t } = useLang();
  const v = t.v3.cr.steps;
  const [ref, seen] = useInView(0.4);
  return (
    <Sheet note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ol className="process" ref={ref}>
        {v.items.map(([title, body], i) => (
          <li key={title}>
            <span className="n">{i + 1}<Ink kind="circle" color="var(--rose)" width={3} play={seen} delay={200 + i * 260} /></span>
            <b>{title}</b>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

/**
 * The application: three pages of a notebook that turn as you go. Picking a role on a notice above
 * fills it in here. The chosen CV clips onto the page. Saves to `applications`, CV to the `resumes` bucket.
 */
function ApplyForm({ role, roleNonce }) {
  const { t } = useLang();
  const v = t.v3.cr.form;
  const roles = t.v3.cr.roles.items;
  const blank = { name: '', phone: '', email: '', address: '', role: '', subject: '', qualification: '', experience: '', joining_date: '', message: '' };
  const [f, setF] = useState(blank);
  const [cv, setCv] = useState(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [err, setErr] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const top = useRef(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  // A notice's "Apply" picks the role and brings the form into view.
  useEffect(() => {
    if (role === null) return;
    setF((x) => ({ ...x, role: String(role) }));
    setErr((e) => ({ ...e, role: undefined }));
  }, [role, roleNonce]);

  const check = (s) => {
    const er = {};
    if (s === 0) {
      if (f.name.trim().length < 2) er.name = v.errName;
      if (!validPhone(f.phone)) er.phone = v.errPhone;
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = v.errEmail;
    }
    if (s === 1) {
      if (f.role === '') er.role = v.errRole;
      if (f.qualification.trim().length < 2) er.qualification = v.errQual;
      if (f.experience === '') er.experience = v.errExp;
    }
    if (s === 2) {
      if (!cv) er.cv = v.errCv;
      else if (!CV_TYPES.test(cv.name)) er.cv = v.errCvType;
      else if (cv.size > CV_MAX) er.cv = v.errCvSize;
    }
    setErr(er);
    return Object.keys(er).length === 0;
  };
  const go = (n) => {
    if (n > step && !check(step)) return;
    setDir(n > step ? 1 : -1);
    setStep(n);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (step < 2) { go(step + 1); return; }
    if (!check(2)) return;
    setStatus('sending');
    try {
      const resume_path = await uploadFile('resumes', cv);
      const roleName = f.role === 'other' ? 'General application' : ROLE_EN[Number(f.role)];
      await createApplication({
        name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), address: f.address.trim() || null,
        // Add the subject unless the role title already names it ("Science teacher (Physics)" + "Physics").
        subject: f.subject.trim() && !roleName.toLowerCase().includes(f.subject.trim().toLowerCase()) ? `${roleName} (${f.subject.trim()})` : roleName,
        qualification: f.qualification.trim(), experience: v3Strings.en.cr.form.expOptions[Number(f.experience)],
        joining_date: f.joining_date || null, message: f.message.trim() || null, resume_path,
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const again = () => { setF(blank); setCv(null); setStep(0); setErr({}); setStatus('idle'); };
  const line = (k, label, props = {}) => (
    <label className={'line' + (err[k] ? ' bad' : '')}>
      <span>{label}</span>
      <input value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} {...props} />
      {err[k] && <em className="err" role="alert">{err[k]}</em>}
    </label>
  );

  if (status === 'done') {
    return (
      <div className="page note-done" ref={top}>
        <span className="big-tick"><Ink kind="tick" color="var(--leaf)" width={4} play /></span>
        <h2>{v.done}</h2>
        <p>{v.doneBody}</p>
        <button type="button" className="btn btn-line" onClick={again}>{v.another}</button>
      </div>
    );
  }

  return (
    <form className="page apply-paper" onSubmit={submit} noValidate ref={top}>
      <ol className="pager">
        {v.steps.map((s, i) => (
          <li key={s} className={i === step ? 'cur' : i < step ? 'done' : ''}>
            <span className="dot">{i < step ? <Ink kind="tick" color="var(--rose)" width={3.5} play /> : i + 1}</span>
            {i < step ? <button type="button" onClick={() => go(i)}>{s}</button> : <span>{s}</span>}
          </li>
        ))}
      </ol>
      <div key={step} className={'turn' + (dir < 0 ? ' back' : '')}>
        {step === 0 && (
          <>
            {line('name', v.name, { autoComplete: 'name' })}
            {line('phone', v.phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
            {line('email', v.email, { type: 'email', autoComplete: 'email' })}
            {line('address', v.address, { autoComplete: 'address-level2' })}
          </>
        )}
        {step === 1 && (
          <>
            <label className={'line' + (err.role ? ' bad' : '')}>
              <span>{v.role}</span>
              <select value={f.role} onChange={set('role')} aria-invalid={!!err.role}>
                <option value="" disabled>—</option>
                {roles.map(([title], i) => <option key={title} value={String(i)}>{title}</option>)}
                <option value="other">{v.other}</option>
              </select>
              {err.role && <em className="err" role="alert">{err.role}</em>}
            </label>
            {line('subject', v.subject)}
            {line('qualification', v.qualification, { placeholder: v.qualPh })}
            <label className={'line' + (err.experience ? ' bad' : '')}>
              <span>{v.experience}</span>
              <select value={f.experience} onChange={set('experience')} aria-invalid={!!err.experience}>
                <option value="" disabled>—</option>
                {v.expOptions.map((o, i) => <option key={o} value={String(i)}>{o}</option>)}
              </select>
              {err.experience && <em className="err" role="alert">{err.experience}</em>}
            </label>
            {line('joining_date', v.joining, { type: 'date' })}
          </>
        )}
        {step === 2 && (
          <>
            <div className={'cv-drop' + (cv ? ' has' : '') + (err.cv ? ' bad' : '')}>
              <span className="cv-label">{v.cv}</span>
              {cv ? (
                <div className="clipped" key={cv.name + cv.size}>
                  <svg className="clip" viewBox="0 0 24 48" aria-hidden="true"><path d="M8 40 V10 a4 4 0 0 1 8 0 V36 a6 6 0 0 1 -12 0 V14" fill="none" stroke="#8A86A8" strokeWidth="2.5" strokeLinecap="round" /></svg>
                  <b>{cv.name}</b>
                  <small>{(cv.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
              ) : <small>{v.cvHint}</small>}
              <label className="btn btn-line pick">
                {cv ? v.cvChange : v.cvPick}
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => { setCv(e.target.files?.[0] || null); setErr({}); }} />
              </label>
              {err.cv && <em className="err" role="alert">{err.cv}</em>}
            </div>
            <label className="line area">
              <span>{v.message}</span>
              <textarea rows={3} value={f.message} onChange={set('message')} />
            </label>
          </>
        )}
      </div>
      {status === 'error' && <p className="err" role="alert">{v.error}</p>}
      <div className="send-row">
        {step > 0 && <button type="button" className="btn btn-line" onClick={() => go(step - 1)}>← {v.back}</button>}
        <button className="btn btn-apply" disabled={status === 'sending'}>{step < 2 ? `${v.next} →` : status === 'sending' ? v.sending : v.send}</button>
      </div>
    </form>
  );
}

export default function CareersPage() {
  const { t } = useLang();
  const v = t.v3.cr;
  const [pick, setPick] = useState({ role: null, nonce: 0 });
  const apply = (i) => {
    setPick((p) => ({ role: i, nonce: p.nonce + 1 }));
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="pg-careers">
      <PageHero photo={media.teacher.src} pos={media.teacher.pos} color="var(--rose)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} b={v.b} intro={v.intro}>
        <a className="btn btn-apply" href="#roles">{v.cta}</a>
        <a className="btn btn-line" href="#apply">{v.cv}</a>
      </PageHero>
      <Why />
      <Roles onApply={apply} />
      <Steps />
      <Sheet id="apply" note={v.form.note}>
        <Head eyebrow={v.form.eyebrow} title={v.form.title} />
        <ApplyForm role={pick.role} roleNonce={pick.nonce} />
      </Sheet>
    </div>
  );
}
