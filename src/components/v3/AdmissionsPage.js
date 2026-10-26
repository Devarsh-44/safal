'use client';
import { useEffect, useMemo, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import PageHero from './PageHero';
import Sheet from './Sheet';
import ApplyWizard from './ApplyWizard';
import { Ink, useInView } from './Marks';

const CHECKS_KEY = 'sv_doc_checks';

/** Gujarat's rule: 6 years old by 1 June for Std 1. Returns the standard a child joins in June 2026. */
export function standardFor(dob) {
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return null;
  const ref = new Date(2026, 5, 1);
  let age = ref.getFullYear() - b.getFullYear();
  if (ref.getMonth() < b.getMonth() || (ref.getMonth() === b.getMonth() && ref.getDate() < b.getDate())) age -= 1;
  return age - 5;
}

function Process() {
  const { t } = useLang();
  const v = t.v3.adm.how;
  const [ref, seen] = useInView(0.4);
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <ol className="process" ref={ref}>
        {v.steps.map(([title, body], i) => (
          <li key={title}>
            <span className="n">{i + 1}<Ink kind="circle" color="var(--sky)" width={3} play={seen} delay={200 + i * 260} /></span>
            <b>{title}</b>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function Finder() {
  const { t } = useLang();
  const v = t.v3.adm.finder;
  const [dob, setDob] = useState('');
  const std = useMemo(() => (dob ? standardFor(dob) : null), [dob]);
  const valid = std !== null && std >= 1 && std <= 12;
  return (
    <div className="page">
      <p className="eyebrow">{v.eyebrow}</p>
      <h2>{v.title}</h2>
      <label className="fld" htmlFor="finder-dob">{v.label}
        <input id="finder-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
      </label>
      <div className="result" aria-live="polite">
        {std === null && <p className="wait">{v.empty}</p>}
        {valid && (
          <>
            <p className="big"><span className="mk mk-circle">{v.joins(std)}<Ink kind="circle" color="var(--pen)" width={3} play key={std} /></span></p>
            <a href={`/admissions?std=${std}#apply`} onClick={(e) => { e.preventDefault(); window.history.replaceState(null, '', `?std=${std}#apply`); window.dispatchEvent(new CustomEvent('sv:std', { detail: std })); document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); }}>{v.apply(std)}</a>
          </>
        )}
        {std !== null && !valid && <p className="msg">{std < 1 ? v.young : v.old}</p>}
      </div>
      <p className="small">{v.rule}</p>
    </div>
  );
}

function Documents() {
  const { t } = useLang();
  const v = t.v3.adm.docs;
  const [checked, setChecked] = useState([]);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(CHECKS_KEY) || '[]'); if (Array.isArray(s)) setChecked(s); } catch {}
  }, []);
  const toggle = (i) => setChecked((c) => {
    const next = c.includes(i) ? c.filter((x) => x !== i) : [...c, i];
    try { localStorage.setItem(CHECKS_KEY, JSON.stringify(next)); } catch {}
    return next;
  });
  return (
    <div className="page">
      <p className="eyebrow">{v.eyebrow}</p>
      <h2>{v.title}</h2>
      <ul className="checks">
        {v.items.map((item, i) => (
          <li key={i}>
            <label htmlFor={'doc-' + i}>
              <input id={'doc-' + i} type="checkbox" checked={checked.includes(i)} onChange={() => toggle(i)} />
              <span className="box" aria-hidden="true">{checked.includes(i) && <Ink kind="tick" color="var(--pen)" width={3.5} play />}</span>
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="tally">{v.done(checked.length, v.items.length)}</p>
      <p className="small">{v.hint}</p>
      <p className="confirm">{v.confirm}</p>
    </div>
  );
}

function Fees() {
  const { t } = useLang();
  const v = t.v3.adm.fees;
  return (
    <section className="wrap" style={{ paddingBottom: 'clamp(24px, 4vw, 48px)' }}>
      <div className="band">
        <img src="/images/live/safalvidhyalaya.webp" alt="" loading="lazy" style={{ objectPosition: '30% 50%' }} />
        <div className="card-g gl">
          <p className="eyebrow">{v.eyebrow}</p>
          <h2>{v.title}</h2>
          <p>{v.body}</p>
          <div className="row">
            <a className="btn btn-apply" href={`tel:${school.phone}`}>{t.v3.adm.call} · {school.phoneDisplay}</a>
            <a className="btn btn-line" href={`https://wa.me/${school.whatsapp}?text=${encodeURIComponent(v.waText)}`} target="_blank" rel="noopener noreferrer">{v.wa}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Apply() {
  const { t } = useLang();
  const v = t.v3.adm.apply;
  // The age finder re-mounts the wizard so it picks up the new ?std= value.
  const [key, setKey] = useState(0);
  useEffect(() => {
    const on = () => setKey((k) => k + 1);
    window.addEventListener('sv:std', on);
    return () => window.removeEventListener('sv:std', on);
  }, []);
  return (
    <Sheet id="apply" note={v.note}>
      <div className="apply-field">
        <div className="head">
          <p className="eyebrow">{v.eyebrow}</p>
          <h2 className="h2">{v.title}</h2>
          <p>{v.intro}</p>
        </div>
        <ApplyWizard key={key} />
      </div>
    </Sheet>
  );
}

function Faq() {
  const { t } = useLang();
  const v = t.v3.adm.faq;
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className="faq">
        {v.items.map(([q, a]) => (
          <details key={q}>
            <summary>{q}<i aria-hidden="true" /></summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </Sheet>
  );
}

export default function AdmissionsPage() {
  const { t } = useLang();
  const v = t.v3.adm;
  return (
    <>
      <PageHero photo="/images/live/event-b.webp" pos="50% 45%" color="var(--sky)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} intro={v.intro}>
        <a className="btn btn-apply" href="#apply">{v.cta}</a>
        <a className="btn btn-line" href={`tel:${school.phone}`}>{v.call}</a>
      </PageHero>
      <Process />
      <section className="wrap" style={{ paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        <div className="pair">
          <Finder />
          <Documents />
        </div>
      </section>
      <Fees />
      <Apply />
      <Faq />
    </>
  );
}
