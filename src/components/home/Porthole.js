'use client';
/**
 * Home page, "porthole" design. One shape runs the page: the oval windows stacked up the left
 * tower of the Sector 22 building. It frames the hero photographs, masks every picture, marks
 * the list bullets and shapes the buttons.
 */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../Icons';
import { useLang, pick } from '@/lib/i18n';
import { school, stages, facilities, bloom, programs } from '@/lib/content';
import { createEnquiry } from '@/lib/store';
import { validPhone } from '../CallbackForm';

const PHOTOS = {
  campus: { src: '/images/live/safalvidhyalaya.webp', w: 1024, h: 618, pos: '24% 50%' },
  yoga: { src: '/images/live/event-a.webp', w: 1600, h: 1200, pos: '50% 60%' },
  ground: { src: '/images/live/event-b.webp', w: 1600, h: 1200, pos: '50% 55%' },
  boy: { src: '/images/live/safal-boy.webp', w: 1104, h: 475, pos: '22% 40%' },
};
const PORTHOLE = ['campus', 'yoga', 'boy', 'ground'];
const INLINE = ['yoga', 'boy', 'ground'];
const STAGE_PHOTO = ['boy', 'yoga', 'ground', 'campus'];

/**
 * Motion scope for a page in this design.
 * - [data-reveal] children rise in once when they enter the viewport (content stays visible without script).
 * - [data-progress] children get a CSS variable --q from 0 to 1 as they scroll through the viewport;
 *   the hero gets --p from 0 to 1 as it scrolls away. Both drive transform-only moves in porthole.css.
 */
export function Scope({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll('[data-reveal]');
    let io;
    if (!('IntersectionObserver' in window)) els.forEach((e) => e.classList.add('is-in'));
    else {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      els.forEach((e) => io.observe(e));
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => io?.disconnect();
    const tracked = root.querySelectorAll('[data-progress]');
    const hero = root.querySelector('.ph-hero');
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      tracked.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        el.style.setProperty('--q', Math.min(1, Math.max(0, (vh - top) / (vh * 0.85))).toFixed(3));
      });
      if (hero) hero.style.setProperty('--p', Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.85))).toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { io?.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div ref={ref} className="ph">{children}</div>;
}

export default function Home() {
  return (
    <Scope>
      <Hero />
      <Intro />
      <Stages />
      <Facilities />
      <Bloom />
      <Gallery />
      <Stats />
      <Where />
      <Visit />
    </Scope>
  );
}

/* ---------------- Hero: the printed card beside the porthole ---------------- */

function Hero() {
  const { t, lang, branch } = useLang();
  const h = t.home.hero;
  const c = school.campuses[branch];
  const [i, setI] = useState(0);

  // Slow crossfade: one photograph after another through the porthole, like light shifting in a room.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id;
    const start = () => { id = setInterval(() => setI((n) => (n + 1) % PORTHOLE.length), 5600); };
    const onVis = () => { clearInterval(id); if (!document.hidden) start(); };
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const tel = c.phone.startsWith('[') ? school.phone : c.phone.replace(/\s/g, '');

  return (
    <section className="ph-hero">
      <div className="ph-card">
        <div className="ph-band" aria-hidden="true">{Array.from({ length: 14 }, (_, k) => <span key={k} />)}</div>
        <div className="ph-card-body">
          <img className="ph-logo" src="/images/logo.png" alt="Safal Vidyalaya, Creation of Life Through Education" width="293" height="135" />
          <h1 className="ph-h1" data-reveal style={{ '--d': 1 }}>{h.h1.map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="ph-sub" data-reveal style={{ '--d': 2 }}>{h.sub} {c.address.startsWith('[') ? '' : c.address + '.'}</p>
          <div data-reveal style={{ '--d': 3 }}>
            <Link href="/admissions" className="btn-oval">{h.cta}<Icon name="arrow" size={20} /></Link>
          </div>
        </div>
        <nav className="ph-card-foot" aria-label={pick(lang, c)}>
          <a href={`tel:${tel}`}>{h.call} {c.phone.startsWith('[') ? school.phoneDisplay : c.phone}</a>
          <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noopener noreferrer">{h.whatsapp}</a>
          <a href="#visit">{h.visit}</a>
        </nav>
      </div>

      <div className="ph-view">
        <div className="ph-porthole" role="img" aria-label={h.porthole}>
          {PORTHOLE.map((k, n) => (
            <img
              key={k} src={PHOTOS[k].src} alt="" width={PHOTOS[k].w} height={PHOTOS[k].h}
              className={n === i ? 'on' : ''} style={{ objectPosition: PHOTOS[k].pos }}
              fetchPriority={n === 0 ? 'high' : undefined} loading={n === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Intro: a statement with oval photographs between its words ---------------- */

export function Intro() {
  const { t } = useLang();
  return (
    <section className="ph-intro">
      <div className="ph-pile" data-progress aria-hidden="true">
        {INLINE.map((k, n) => (
          <span key={k} className={'c' + n}><img src={PHOTOS[k].src} alt="" loading="lazy" style={{ objectPosition: PHOTOS[k].pos }} /></span>
        ))}
      </div>
      <p className="ph-statement" data-reveal>{t.home.intro.filter((part) => typeof part === 'string').join(' ')}</p>
    </section>
  );
}

/* ---------------- Stages: tabs, the date-of-birth finder, one porthole photograph ---------------- */

/** Standard a child joins in June 2026 under Gujarat's rule: 6 completed years on 1 June for Std 1. */
function standardFor(dob) {
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return null;
  const ref = new Date(2026, 5, 1);
  let age = ref.getFullYear() - b.getFullYear();
  if (ref.getMonth() < b.getMonth() || (ref.getMonth() === b.getMonth() && ref.getDate() < b.getDate())) age -= 1;
  return age - 5;
}
const stageOf = (std) => (std <= 5 ? 0 : std <= 8 ? 1 : std <= 10 ? 2 : 3);

export function Stages() {
  const { t, lang } = useLang();
  const f = t.home.finder;
  const [i, setI] = useState(0);
  const [dob, setDob] = useState('');
  const std = useMemo(() => (dob ? standardFor(dob) : null), [dob]);
  const valid = std !== null && std >= 1 && std <= 12;

  useEffect(() => { if (valid) setI(stageOf(std)); }, [valid, std]);

  const s = stages[i];
  const range = t.content.stageRange?.[s.id] ?? s.range;
  const points = t.content.stagePoints?.[s.id] ?? s.points;
  const result = std === null ? null : std < 1 ? f.young : std > 12 ? f.old : f.joins(std);
  const photo = PHOTOS[STAGE_PHOTO[i]];

  return (
    <section className="ph-stages" id="stages" aria-labelledby="stage-title">
      <div className="ph-plate">
        <img key={photo.src} src={photo.src} alt="" width={photo.w} height={photo.h} loading="lazy" style={{ objectPosition: photo.pos }} />
        <span className="ph-ring" aria-hidden="true" />
      </div>
      <div className="ph-stage-col">
        <div>
          <div className="ph-tabs" role="tablist" aria-label={f.stages}>
            {stages.map((st, k) => (
              <button key={st.id} role="tab" aria-selected={i === k} aria-controls="stage-panel" onClick={() => setI(k)}>
                {t.content.stageRange?.[st.id] ?? st.range}
              </button>
            ))}
          </div>
          <label className="ph-finder">
            <span>{f.label}</span>
            <input type="date" value={dob} min="2006-01-01" max="2022-12-31" onChange={(e) => setDob(e.target.value)} />
          </label>
          <p className="ph-finder-out" aria-live="polite">{result ?? ' '}</p>
        </div>
        <div id="stage-panel" role="tabpanel" className="ph-stage-text" key={s.id + lang}>
          <h2 id="stage-title" className="ph-h3">{pick(lang, s)}</h2>
          <ul className="ph-dots">{points.filter((p) => !p.startsWith('[')).map((p) => <li key={p}>{p}</li>)}</ul>
          <p className="ph-note">{f.note}</p>
        </div>
        <div className="ph-cells">
          <Link href={valid ? `/admissions?std=${std}` : '/admissions'} className="ph-cell ink">{valid ? f.applyStd(std) : f.apply(range)}</Link>
          <Link href="/academics#syllabus" className="ph-cell tone">{f.syllabus}</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Facilities: a two-column menu with oval picture bullets ---------------- */

export function Facilities() {
  const { t, lang } = useLang();
  return (
    <section className="ph-menu" id="facilities">
      <div className="ph-wrap">
        <div className="ph-menu-head" data-reveal>
          <h2 className="ph-h2">{t.home.facilities.title}</h2>
          <span>{school.campuses[0].area}, {pick(lang, school.campuses[0])}</span>
        </div>
        <ul className="ph-menu-list">
          {facilities.map((it, k) => (
            <li key={it.icon} data-reveal style={{ '--d': k % 2 }}>
              <span className="ph-bullet"><img src={it.img} alt="" loading="lazy" /></span>
              <span>
                <span className="ph-menu-row"><b>{pick(lang, it)}</b><span lang={lang === 'gu' ? 'en' : 'gu'}>{lang === 'gu' ? it.name : it.gu}</span></span>
                <span className="ph-menu-desc">{t.content.facDesc?.[it.icon] ?? it.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Bloom: an accordion that lightens from Remembering to Creating ---------------- */

export function Bloom() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);
  const step = (k) => ({ ...bloom[k], ...(t.content.bloom?.[k] ?? {}) });
  return (
    <section className="ph-bloom" aria-labelledby="bloom-title">
      <div className="ph-wrap ph-bloom-head" data-reveal>
        <h2 id="bloom-title" className="ph-h2">{t.home.bloom.title}</h2>
        <p>{t.howBody}</p>
      </div>
      <div className="ph-wrap">
        <div className="ph-acc">
          {bloom.map((_, k) => {
            const s = step(k);
            return (
              <div key={k} className={'ph-acc-panel' + (open === k ? ' open' : '')} style={{ '--k': k }}>
                <button className="ph-acc-tab" aria-expanded={open === k} aria-controls={`bloom-${k}`} onClick={() => setOpen(k)} onFocus={() => setOpen(k)}>
                  <span>{s.name}</span>
                </button>
                <div id={`bloom-${k}`} className="ph-acc-body" hidden={open !== k}>
                  <b>{s.name}</b>
                  <p>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Gallery: a wall of word tiles, every third a photograph in the oval ---------------- */

const WALL = [
  { head: true }, { photo: 'yoga', cap: 'yoga' }, { word: 'std', cap: 'std' }, { word: 'gu', cap: 'gu' },
  { word: 'en', cap: 'en' }, { text: 'NEET', cap: 'neet' }, { photo: 'ground', cap: 'ground' }, { text: 'JEE', cap: 'jee' },
  { text: 'YLE', cap: 'yle' }, { text: 'Bee', cap: 'bee' }, { photo: 'campus', cap: 'campus' }, { word: 'bus', cap: 'bus' },
];

export function Gallery() {
  const { t } = useLang();
  const g = t.home.gallery;
  return (
    <section className="ph-wall" aria-labelledby="wall-title">
      {WALL.map((c, k) => (
        <div key={k} className={'ph-tile p' + (k % 4)} data-reveal style={{ '--d': k % 4 }}>
          {c.head && <h2 id="wall-title" className="ph-tile-head">{g.title}</h2>}
          {c.photo && <span className="ph-tile-photo"><img src={PHOTOS[c.photo].src} alt={g.caps[c.cap]} loading="lazy" style={{ objectPosition: PHOTOS[c.photo].pos }} /></span>}
          {(c.word || c.text) && <span className="ph-tile-word" lang={c.word === 'gu' ? 'gu' : undefined}>{c.word ? g.words[c.word] : c.text}</span>}
          {c.cap && !c.photo && <span className="ph-tile-cap">{g.caps[c.cap]}</span>}
        </div>
      ))}
    </section>
  );
}

/* ---------------- Stats: three tiles at three heights, each with one oval corner ---------------- */

function Stats() {
  const { t } = useLang();
  const s = t.home.stats;
  return (
    <section className="ph-stats" aria-labelledby="stats-title">
      <div className="ph-wrap ph-stats-grid">
        {s.items.map(([n, cap], k) => (
          <div key={k} className={'ph-stat s' + k} data-reveal style={{ '--d': k }}>
            <b>{n}</b>
            <span>{cap}</span>
          </div>
        ))}
        <h2 id="stats-title" className="ph-h3 ph-stats-title">{s.title}</h2>
      </div>
    </section>
  );
}

/* ---------------- Where: the planned city and the two campuses ---------------- */

export function Where() {
  const { t, lang } = useLang();
  const w = t.home.where;
  return (
    <section className="ph-where" id="where">
      <div className="ph-wrap ph-where-grid">
        <figure className="ph-plan" data-reveal>
          <img src="/images/world/cityplan.jpg" alt={w.plan} width="1700" height="2200" loading="lazy" />
          <figcaption>{w.plan}</figcaption>
        </figure>
        <div className="ph-where-text">
          <h2 className="ph-h2" data-reveal>{w.title}</h2>
          <p className="ph-lead" data-reveal style={{ '--d': 1 }}>{w.body}</p>
          <div className="ph-campuses" data-reveal style={{ '--d': 2 }}>
            {school.campuses.map((c) => (
              <div key={c.id}>
                <b>{t.common.campus(pick(lang, c))}</b>
                <span>{c.address}</span>
                <span>{c.phone}</span>
              </div>
            ))}
          </div>
          <a className="ph-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Safal Vidyalaya, Sector 22, Gandhinagar')}`} target="_blank" rel="noopener noreferrer" data-reveal style={{ '--d': 3 }}>{w.map}<Icon name="arrow" size={18} /></a>
          <figure className="ph-trees" data-reveal style={{ '--d': 3 }}>
            <span><img src="/images/world/gandhinagar-sector-28-garden-trees-01.jpg" alt={w.trees} width="1920" height="1080" loading="lazy" /></span>
            <figcaption>{w.trees}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Visit: the clip-out coupon form ---------------- */

const STANDARDS = [...Array.from({ length: 10 }, (_, i) => ['Std ' + (i + 1), i + 1]), ['Std 11 — Science', 11, 'Science'], ['Std 11 — Commerce', 11, 'Commerce'], ['Std 11 — Arts', 11, 'Arts'], ['Std 12', 12]];

export function Visit() {
  const { t, branch } = useLang();
  const c = t.callback;
  const v = t.home.visit;
  const [form, setForm] = useState({ parent_name: '', phone: '', standard: 'Std 1', medium: 'English' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const label = ([, n, stream]) => t.common.std(n) + (stream ? ', ' + t.common.streams[stream] : '');

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (form.parent_name.trim().length < 2) er.parent_name = 'errName';
    if (!validPhone(form.phone)) er.phone = 'errPhone';
    setErrors(er);
    if (Object.keys(er).length) return;
    setState('sending');
    try { await createEnquiry({ ...form, source: 'callback', campus: school.campuses[branch].name }); setState('done'); } catch { setState('error'); }
  }

  return (
    <section className="ph-visit" id="visit">
      <div className="ph-coupon" data-reveal>
        <div className="ph-coupon-left">
          <h2 className="ph-h2">{v.title}</h2>
          <p>{v.body}</p>
        </div>
        <div className="ph-coupon-right">
          {state === 'done' ? (
            <div className="ph-done" role="status">
              <b>{c.done}</b>
              <p>{c.doneBody(form.parent_name.split(' ')[0], form.phone)}</p>
              <button className="ph-submit" onClick={() => { setState('idle'); setForm({ ...form, parent_name: '', phone: '' }); }}>{c.another}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label><span className="sr-only">{c.name}</span>
                <input value={form.parent_name} onChange={set('parent_name')} placeholder={c.name} autoComplete="name" aria-invalid={!!errors.parent_name} />
              </label>
              {errors.parent_name && <span className="ph-err">{c[errors.parent_name]}</span>}
              <label><span className="sr-only">{c.phone}</span>
                <input value={form.phone} onChange={set('phone')} placeholder={c.phone} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
              </label>
              {errors.phone && <span className="ph-err">{c[errors.phone]}</span>}
              <label><span className="sr-only">{c.standard}</span>
                <select value={form.standard} onChange={set('standard')}>{STANDARDS.map((s) => <option key={s[0]} value={s[0]}>{label(s)}</option>)}</select>
              </label>
              <label><span className="sr-only">{c.medium}</span>
                <select value={form.medium} onChange={set('medium')}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select>
              </label>
              {state === 'error' && <span className="ph-err" role="alert">{c.error(school.phoneDisplay)}</span>}
              <button className="ph-submit" disabled={state === 'sending'}>{state === 'sending' ? t.common.sending : c.submit}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Programs: three rows, each opened by an oval in its own colour ---------------- */

export function Programs() {
  const { t } = useLang();
  return (
    <section className="ph-programs" id="programs">
      <div className="ph-wrap ph-programs-grid">
        <h2 className="ph-h2" data-reveal>{t.progTitle}</h2>
        <ul>
          {programs.map((p0, k) => {
            const p = { ...p0, ...(t.content.programs?.[k] ?? {}) };
            return (
              <li key={p0.name} className={'r' + k} data-reveal style={{ '--d': k }}>
                <span><b>{p.name}</b><em>{p.tag}</em></span>
                <span>{p.desc}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
