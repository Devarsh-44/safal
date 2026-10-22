'use client';
/**
 * Home page sections, dark cinematic v2. Shared sections (Statement, Stages, Numbers, Reel, Steps,
 * Gallery, Visit) are exported for the inner pages so every page moves the same way.
 */
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '../Icons';
import { Txt } from './MotionSystem';
import Chakra3D from './Chakra3D';
import { useLang, pick } from '@/lib/i18n';
import { school, stages, facilities, bloom } from '@/lib/content';
import { media } from '@/lib/media';
import { createEnquiry, listNews } from '@/lib/store';
import { validPhone } from '../CallbackForm';
import { ROOFLINE } from '../home/roofline';

gsap.registerPlugin(ScrollTrigger);

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const whenReady = (fn) => { if (window.__svReady) fn(); else window.addEventListener('sv:ready', fn, { once: true }); };

export default function Home() {
  return (
    <>
      <Hero />
      <Film />
      <Marquee />
      <Stages light />
      <div className="dark-after">
        <Numbers />
        <Stack />
        <Reel />
        <Steps />
        <Gallery />
        <News />
        <Visit />
      </div>
    </>
  );
}

/* ================= Hero: SAFAL behind the building, the camera pushes in ================= */

function Scene({ id, size, x, y, len }) {
  const PHOTO = media.campus.src;
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1830" /><stop offset="1" stopColor="#7fa9d8" /></linearGradient>
        <linearGradient id={`blend-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fa9d8" /><stop offset="1" stopColor="#7fa9d8" stopOpacity="0" /></linearGradient>
        <linearGradient id={`ink-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ffd9b0" /></linearGradient>
        <clipPath id={`roof-${id}`}><path d={ROOFLINE} /></clipPath>
      </defs>
      <g className="hx-zoom">
        <g className="hx-cam">
          <rect x="-300" y="-500" width="1624" height="520" fill={`url(#sky-${id})`} />
          <image href={PHOTO} x="0" y="0" width="1024" height="618" />
          <rect x="-300" y="-2" width="1624" height="70" fill={`url(#blend-${id})`} />
          <g className="hx-word"><g className="hx-rise">
            <text x={x} y={y} textLength={len} lengthAdjust="spacingAndGlyphs" className="h2x-word" style={{ fontSize: size, fontFamily: 'Inter Tight, sans-serif' }} fill={`url(#ink-${id})`}>SAFAL</text>
          </g></g>
          <image href={PHOTO} x="0" y="0" width="1024" height="618" clipPath={`url(#roof-${id})`} />
        </g>
      </g>
    </>
  );
}

function Hero() {
  const { t } = useLang();
  const h = t.v2.hero;
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    // Elements are looked up now: the entrance plays later (after the preloader), outside this scope.
    const q = gsap.utils.selector(root);
    const cam = q('.hx-cam'), rise = q('.hx-rise'), ins = q('.h2x-in');
    let ctx;
    ctx = gsap.context(() => {
      gsap.set(rise, { y: 240 });
      gsap.set(cam, { scale: 1.18, svgOrigin: '512 450' });
      gsap.set(ins, { y: 40, opacity: 0 });
      const intro = () => gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to(cam, { scale: 1, duration: 2.6 }, 0)
        .to(rise, { y: 0, duration: 2.2 }, 0.15)
        .to(ins, { y: 0, opacity: 1, duration: 1.4, stagger: 0.08 }, 0.6);
      // Already ready (a later visit): play now, inside this context. Otherwise add it to the context when it fires.
      whenReady(() => (ctx ? ctx.add(intro) : intro()));
      gsap.matchMedia().add('(min-width: 901px)', () => {
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', scrub: 0.8, pin: true } })
          .to('.hx-zoom', { scale: 1.3, svgOrigin: '512 470', ease: 'none' }, 0)
          .to('.hx-word', { y: 170, ease: 'none' }, 0)
          .to('.h2x-bottom', { y: -90, opacity: 0, ease: 'none' }, 0)
          .to('.h2x-dark', { opacity: 1, ease: 'none' }, 0.25);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="h2x" ref={root}>
      <svg className="h2x-scene h2x-desk" viewBox="0 -150 1024 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><Scene id="d" size={280} x={372} y={200} len={640} /></svg>
      <svg className="h2x-scene h2x-mob" viewBox="400 -60 520 520" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><Scene id="m" size={190} x={445} y={180} len={430} /></svg>
      <div className="h2x-shade" aria-hidden="true" />
      <div className="h2x-dark" aria-hidden="true" />
      <div className="h2x-bottom">
        <div className="wrap h2x-row">
          <div>
            <p className="kicker h2x-in">{t.session}</p>
            <Txt as="h1" split="chars" className="h2x-title">{h.title}</Txt>
            <p className="h2x-sub h2x-in">{h.sub}</p>
            <div className="h2x-ctas h2x-in">
              <Link href="/admissions" className="btn2 btn2-primary" data-magnetic><span data-magnetic-inner style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>{h.cta}<Icon name="arrow" size={18} /></span></Link>
              <a href="#visit" className="btn2 btn2-glass" data-magnetic><span data-magnetic-inner>{h.visit}</span></a>
            </div>
          </div>
        </div>
      </div>
      <div className="h2x-cue" aria-hidden="true" />
    </section>
  );
}

/* ================= Marquee: leans with the scroll ================= */

export function Marquee() {
  const { t } = useLang();
  const items = t.v2.marquee;
  return (
    <div className="mq2" aria-label={items.join(', ')}>
      <div className="mq2-track" data-skew aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k}>{items.map((x, i) => <span key={i} className={i % 2 ? 'o' : ''}>{x}<i /></span>)}</div>
        ))}
      </div>
    </div>
  );
}

/* ================= Statement: words light up ================= */

export function Statement({ text }) {
  const { t } = useLang();
  return (
    <section className="sec stmt">
      <div className="wrap">
        <p className="kicker" data-reveal>{t.philEyebrow}</p>
        <Txt as="p" scrub>{text ?? t.phil}</Txt>
      </div>
    </section>
  );
}

/* ================= Film: a sentence whose photo tile opens into full-screen school moments (Matic) ================= */

const FILM = ['yoga', 'readingDesks', 'lab', 'reading', 'teacher', 'ground'];

export function Film() {
  const { t } = useLang();
  const f = t.v2.film;
  const root = useRef(null);
  const slot = useRef(null);
  const layer = useRef(null);

  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const sec = root.current;
      // The picture layer covers the whole section; it starts clipped to the tile's exact rectangle.
      const tileClip = () => {
        const s = sec.getBoundingClientRect();
        const r = slot.current.getBoundingClientRect();
        const top = r.top - s.top, left = r.left - s.left;
        return `inset(${top}px ${s.width - left - r.width}px ${s.height - top - r.height}px ${left}px round 22px)`;
      };
      const imgs = gsap.utils.toArray('.film-img', sec);
      const caps = gsap.utils.toArray('.film-cap', sec);
      gsap.set(imgs.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(caps, { opacity: 0, y: 24 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top top', end: '+=' + (FILM.length * 80 + 140) + '%', scrub: 0.8, pin: true, invalidateOnRefresh: true },
      });
      tl.fromTo(layer.current, { clipPath: tileClip }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', ease: 'power2.inOut', duration: 1.3 }, 0)
        .fromTo(imgs[0], { scale: 1.4 }, { scale: 1, ease: 'none', duration: 1.3 }, 0)
        .to('.film-before', { xPercent: -130, opacity: 0, ease: 'power2.in', duration: 1 }, 0)
        .to('.film-after', { xPercent: 130, opacity: 0, ease: 'power2.in', duration: 1 }, 0)
        .to(caps[0], { opacity: 1, y: 0, duration: 0.35 }, 1.15);
      imgs.slice(1).forEach((img, i) => {
        const at = 1.8 + i * 1.1;
        tl.to(img, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power3.inOut', duration: 0.9 }, at)
          .fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.4 }, at)
          .to(caps[i], { opacity: 0, y: -24, duration: 0.3 }, at)
          .to(caps[i + 1], { opacity: 1, y: 0, duration: 0.35 }, at + 0.6);
      });
      tl.to({}, { duration: 0.5 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="film" ref={root} aria-label={`${f.before} ${f.after}`}>
      <p className="film-line" aria-hidden="true">
        <span className="film-before">{f.before}</span>
        <span className="film-slot" ref={slot} />
        <span className="film-after">{f.after}</span>
      </p>
      <div className="film-layer" ref={layer} aria-hidden="true">
        {FILM.map((k, i) => (
          <img key={k} className="film-img" src={media[k].src} alt="" style={{ objectPosition: media[k].pos }} loading={i ? 'lazy' : 'eager'} />
        ))}
        <div className="film-shade" />
        {FILM.map((k) => (
          <p key={k} className="film-cap">{f.caps[k]}{!media[k].own && <small>{t.v2.sample}</small>}</p>
        ))}
      </div>
    </section>
  );
}

/* ================= Stack: photos dealt into a pile while the words cross (Bloom) ================= */

const PILE = [
  { k: 'yoga', x: -34, y: -6, r: -9 },
  { k: 'readingDesks', x: 30, y: -10, r: 7 },
  { k: 'lab', x: -20, y: 14, r: 5 },
  { k: 'reading', x: 24, y: 12, r: -6 },
  { k: 'ground', x: 0, y: 0, r: 2 },
];

export function Stack() {
  const { t } = useLang();
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stack-ph');
      cards.forEach((el, i) => gsap.set(el, { x: '0vw', y: '120vh', rotate: PILE[i].r * 3 }));
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', scrub: 1, pin: true } });
      cards.forEach((el, i) => tl.to(el, { x: `${PILE[i].x}vw`, y: `${PILE[i].y}vh`, rotate: PILE[i].r, ease: 'power3.out', duration: 1 }, i * 0.45));
      tl.fromTo('.stack-words', { yPercent: 70 }, { yPercent: -70, ease: 'none', duration: cards.length * 0.45 + 1 }, 0);
      tl.to(cards, { scale: 0.86, filter: 'brightness(.5)', duration: 0.8, ease: 'none' }, '>-0.3');
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="stack" ref={root}>
      {PILE.map((p) => (
        <div key={p.k} className="stack-ph" aria-hidden="true"><img src={media[p.k].src} alt="" style={{ objectPosition: media[p.k].pos }} loading="lazy" /></div>
      ))}
      <div className="stack-words" aria-label={t.v2.stack.join(' ')}>
        {t.v2.stack.map((w) => <b key={w} aria-hidden="true">{w}</b>)}
      </div>
    </section>
  );
}

/* ================= Stages: bento with the date-of-birth finder ================= */

function standardFor(dob) {
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return null;
  const ref = new Date(2026, 5, 1);
  let age = ref.getFullYear() - b.getFullYear();
  if (ref.getMonth() < b.getMonth() || (ref.getMonth() === b.getMonth() && ref.getDate() < b.getDate())) age -= 1;
  return age - 5;
}
const STAGE_MEDIA = ['readingDesks', 'classroom', 'lab', 'teacher'];
const STAGE_SPAN = ['b-7', 'b-5', 'b-6', 'b-6'];
const SHOW_POINT = [true, false, false, false];

export function Stages({ light }) {
  const { t, lang } = useLang();
  const s = t.v2.stages;
  const [dob, setDob] = useState('');
  const std = useMemo(() => (dob ? standardFor(dob) : null), [dob]);
  const valid = std !== null && std >= 1 && std <= 12;
  const out = std === null ? '' : std < 1 ? s.young : std > 12 ? s.old : s.joins(std);

  const card = (st, k) => {
    const m = media[STAGE_MEDIA[k]];
    const points = t.content.stagePoints?.[st.id] ?? st.points;
    return (
      <Link key={st.id} href="/academics#stages" className={'card2 tile ' + STAGE_SPAN[k] + (k === 0 ? ' b-tall' : '')} data-cursor="View">
        <span className="media"><img src={m.src} alt="" style={{ objectPosition: m.pos }} loading="lazy" /></span>
        <span className="shade" />
        <span className="range">{t.content.stageRange?.[st.id] ?? st.range}</span>
        <h3>{pick(lang, st)}</h3>
        {SHOW_POINT[k] && <p>{points[0]}</p>}
      </Link>
    );
  };

  return (
    <section className={'sec' + (light ? ' light' : '')} id="stages">
      <div className="wrap">
        <div className="sec-head">
          <Txt as="h2" split className="d-xl">{s.title}</Txt>
        </div>
        <div className="bento" data-stagger="0.07">
          {card(stages[0], 0)}
          <div className="card2 tile tile-dark finder2 b-5">
            <h3>{s.finderTitle}</h3>
            <label>{s.finderLabel}
              <input type="date" value={dob} min="2006-01-01" max="2022-12-31" onChange={(e) => setDob(e.target.value)} />
            </label>
            <output aria-live="polite">{out}</output>
            <Link href={valid ? `/admissions?std=${std}` : '/admissions'} className="btn2 btn2-primary" data-magnetic><span data-magnetic-inner>{s.apply(valid ? std : null)}</span></Link>
            <small>{s.note}</small>
          </div>
          {stages.slice(1).map((st, k) => card(st, k + 1))}
          <div className="card2 tile tile-accent b-12" style={{ minHeight: 260, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <h3>{t.session}</h3>
            <Link href="/admissions" className="btn2 btn2-dark" data-magnetic><span data-magnetic-inner>{t.v2.hero.cta}</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Numbers: count up ================= */

export function Numbers() {
  const { t } = useLang();
  const n = t.v2.numbers;
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head"><Txt as="h2" split className="d-xl">{n.title}</Txt></div>
        <div className="nums" data-stagger="0.08">
          {n.items.map(([v, label]) => (
            <div key={label} className="num"><b data-count={v}>{v}</b><span>{label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Reel: facilities scroll sideways while pinned ================= */

const FAC_MEDIA = { book: 'reading', board: 'lab' };

export function Reel() {
  const { t, lang } = useLang();
  const root = useRef(null);
  const track = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(min-width: 901px)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth;
        gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: 0.8, pin: true, invalidateOnRefresh: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="reel" ref={root} id="facilities">
      <div className="wrap"><Txt as="h2" split className="d-xl" style={{ maxWidth: '16ch' }}>{t.v2.reel.title}</Txt></div>
      <div className="reel-track" ref={track}>
        {facilities.map((f) => {
          const m = media[FAC_MEDIA[f.icon]];
          return (
            <Link key={f.icon} href={'/facilities#' + f.icon} className={'card2 reel-card' + (m ? '' : ' ill')} data-cursor="Open">
              <span className="media"><img src={m ? m.src : f.img} alt="" loading="lazy" style={m ? { objectPosition: m.pos } : undefined} /></span>
              {m && <span className="shade" />}
              {m && <span className="tag">{t.v2.sample}</span>}
              <h3>{pick(lang, f)}</h3>
              <p>{t.content.facDesc?.[f.icon] ?? f.desc}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ================= Steps: the 3D chakra beside Bloom's six steps ================= */

export function Steps() {
  const { t } = useLang();
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.steps2-list li').forEach((li) => {
        ScrollTrigger.create({ trigger: li, start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: li, className: 'on' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec" ref={root}>
      <div className="wrap">
        <div className="sec-head">
          <Txt as="h2" split className="d-xl">{t.v2.steps.title}</Txt>
          <p className="t2" data-reveal>{t.v2.steps.body}</p>
        </div>
        <div className="steps2">
          <div className="steps2-stage"><Chakra3D /></div>
          <ol className="steps2-list">
            {bloom.map((b, k) => {
              const s = { ...b, ...(t.content.bloom?.[k] ?? {}) };
              return <li key={k}><b>{s.name}</b><p>{s.desc}</p></li>;
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ================= Gallery: three columns at three speeds ================= */

const COLS = [['yoga', 'readingDesks'], ['campus', 'reading', 'boy'], ['teacher', 'ground', 'lab']];

export function Gallery() {
  const { t } = useLang();
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head"><Txt as="h2" split className="d-xl">{t.v2.gallery.title}</Txt></div>
        <div className="gal2">
          {COLS.map((col, ci) => (
            <div key={ci} className="gal2-col" data-parallax={[0.12, -0.2, 0.28][ci]}>
              {col.map((k) => (
                <figure key={k} data-clip data-cursor="View">
                  <img src={media[k].src} alt="" loading="lazy" style={{ objectPosition: media[k].pos }} />
                  <figcaption>{media[k].own ? 'Safal Vidyalaya' : t.v2.sample}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= News: three rounded cards ================= */

export function News() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  useEffect(() => { listNews().then((n) => setItems(n.slice(0, 3))).catch(() => {}); }, []);
  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Txt as="h2" split className="d-xl">{t.v2.news.title}</Txt>
          <Link href="/news" className="btn2 btn2-glass" data-magnetic><span data-magnetic-inner>{t.v2.news.all}</span></Link>
        </div>
        <div className="news2" data-stagger="0.08">
          {items.map((n) => (
            <Link key={n.id} href="/news" className="card2">
              <span>{n.tag} · {fmt(n.date)}</span>
              <h3>{n.title}</h3>
              <i aria-hidden="true"><Icon name="arrow" size={18} /></i>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Visit: the big round button and the callback form ================= */

const STANDARDS = [...Array.from({ length: 10 }, (_, i) => ['Std ' + (i + 1), i + 1]), ['Std 11 — Science', 11, 'Science'], ['Std 11 — Commerce', 11, 'Commerce'], ['Std 11 — Arts', 11, 'Arts'], ['Std 12', 12]];

export function Visit() {
  const { t, lang, branch, setBranch } = useLang();
  const v = t.v2.visit;
  const c = t.callback;
  const nameRef = useRef(null);
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
  const focusForm = (e) => { e.preventDefault(); nameRef.current?.focus({ preventScroll: true }); window.__lenis?.scrollTo(nameRef.current, { offset: -200 }); };

  return (
    <section className="sec" id="visit">
      <div className="wrap visit2">
        <div className="visit2-left">
          <Txt as="h2" split className="d-2xl">{v.title}</Txt>
          <p className="lead" data-reveal>{v.body}</p>
          <a href="#visit-form" className="circle-btn" data-magnetic onClick={focusForm}><span data-magnetic-inner>{v.button}</span></a>
        </div>
        <div className="form2" id="visit-form" data-reveal>
          {state === 'done' ? (
            <div className="done2" role="status"><b>{c.done}</b><p className="t2">{c.doneBody(form.parent_name.split(' ')[0], form.phone)}</p>
              <button className="btn2 btn2-glass" onClick={() => { setState('idle'); setForm({ ...form, parent_name: '', phone: '' }); }}>{c.another}</button></div>
          ) : (
            <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 12 }}>
              <h3>{v.button}</h3>
              <label><span className="sr-only">{c.name}</span><input ref={nameRef} className="inp" value={form.parent_name} onChange={set('parent_name')} placeholder={c.name} autoComplete="name" aria-invalid={!!errors.parent_name} /></label>
              {errors.parent_name && <span className="err2">{c[errors.parent_name]}</span>}
              <label><span className="sr-only">{c.phone}</span><input className="inp" value={form.phone} onChange={set('phone')} placeholder={c.phone} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} /></label>
              {errors.phone && <span className="err2">{c[errors.phone]}</span>}
              <label><span className="sr-only">{t.campusPick}</span><select className="inp" value={branch} onChange={(e) => setBranch(Number(e.target.value))}>{school.campuses.map((cp, i) => <option key={cp.id} value={i}>{t.common.campus(pick(lang, cp))}</option>)}</select></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label><span className="sr-only">{c.standard}</span><select className="inp" value={form.standard} onChange={set('standard')}>{STANDARDS.map((s) => <option key={s[0]} value={s[0]}>{label(s)}</option>)}</select></label>
                <label><span className="sr-only">{c.medium}</span><select className="inp" value={form.medium} onChange={set('medium')}>{['English', 'Gujarati'].map((m) => <option key={m} value={m}>{t.common.mediums[m]}</option>)}</select></label>
              </div>
              {state === 'error' && <span className="err2" role="alert">{c.error(school.phoneDisplay)}</span>}
              <button className="btn2 btn2-primary btn2-block" disabled={state === 'sending'}>{state === 'sending' ? t.common.sending : c.submit}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
