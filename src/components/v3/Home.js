'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { media } from '@/lib/media';
import Hero from './Hero';
import Admissions from './Admissions';
import Sheet from './Sheet';
import { Ink, Mark, useInView } from './Marks';

function CountUp({ to, play }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!play || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1200);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, to]);
  return <b>{n}</b>;
}

/** A page from a Safal notebook: the reasons, ticked off one by one, beside the numbers. */
function Why() {
  const { t } = useLang();
  const w = t.v3.why;
  const v = t.v3.numbers;
  const [bookRef, bookSeen] = useInView(0.45);
  const [ref, seen] = useInView(0.4);
  return (
    <Sheet note={v.note}>
      <div className="why">
        <figure className="notebook" ref={bookRef}>
          <span className="session">{w.session}</span>
          <div className="stamp" aria-hidden="true"><Ink kind="star" width={3} play={bookSeen} delay={w.items.length * 280 + 200} />{w.stamp}</div>
          <h2>{w.title}</h2>
          <ul>
            {w.items.map((item, i) => (
              <li key={item}><Ink kind="tick" width={3.5} play={bookSeen} delay={300 + i * 280} />{item}</li>
            ))}
          </ul>
          <a className="cta" href="#admissions">{w.cta}</a>
        </figure>
        <div>
          <h2 className="sr-only">{v.title}</h2>
          <div className="nums" ref={ref}>
            {v.items.map(([n, label]) => <div key={label} className="num"><CountUp to={n} play={seen} /><span>{label}</span></div>)}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function Belief() {
  const { t } = useLang();
  const v = t.v3.belief;
  return (
    <Sheet note={v.note}>
      <p className="belief">{v.a} <Mark kind="double" color="var(--sky)" width={5}>{v.mark}</Mark> {v.b}</p>
      <p className="belief-text">{t.phil}</p>
    </Sheet>
  );
}

// "Enquire" on each stage card opens the application with that stage's first standard picked.
const FIRST_STD = [1, 6, 9, 11];

function Stages() {
  const { t } = useLang();
  const v = t.v3.stages;
  const [medium, setMedium] = useState('English');
  const [ref, seen] = useInView(0.25);
  return (
    <Sheet id="stages" note={v.note}>
      <div className="field">
        <div className="field-head">
          <div className="head">
            <p className="eyebrow">{v.eyebrow}</p>
            <h2 className="h2">{v.a} <Mark kind="squiggle" color="var(--on-field)">{v.mark}</Mark></h2>
          </div>
          <div className="seg" role="group" aria-label={v.medium}>
            <span>{v.medium}</span>
            {[['English', v.english], ['Gujarati', v.gujarati]].map(([id, label]) => (
              <button key={id} type="button" aria-pressed={medium === id} onClick={() => setMedium(id)}>{label}</button>
            ))}
          </div>
        </div>
        <div className={'deck' + (seen ? ' dealt' : '')} ref={ref}>
          {v.cards.map((c, i) => (
            <article key={c.range} className="card" style={{ '--i': i }}>
              <div className="face"><small>{c.name}</small><b>{c.range}</b></div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <div className="foot"><span>{v.taught[medium]}</span><a href={`/admissions?std=${FIRST_STD[i]}#apply`}>{v.enquire} →</a></div>
            </article>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

function DayRow({ time, title, body }) {
  const [ref, seen] = useInView(0.9);
  return (
    <li ref={ref}>
      <time>{time}</time>
      <Ink kind="tick" className="tick" width={3.5} play={seen} delay={150} />
      <div><b>{title}</b><p>{body}</p></div>
    </li>
  );
}

function Day() {
  const { t } = useLang();
  const v = t.v3.day;
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <ol className="day">{v.rows.map(([time, title, body]) => <DayRow key={time} time={time} title={title} body={body} />)}</ol>
    </Sheet>
  );
}

const CAMPUS_PHOTOS = [media.readingDesks, media.lab, media.classroom, media.ground, media.teacher];

function Campus() {
  const { t } = useLang();
  const v = t.v3.campus;
  const [active, setActive] = useState(0);
  const items = useRef([]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <Sheet id="campus" note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className="split">
        <div className="stage-photo">
          {CAMPUS_PHOTOS.map((m, i) => <img key={m.src} src={m.src} alt="" className={i === active ? 'on' : ''} style={{ objectPosition: m.pos }} loading="lazy" />)}
          <div className="cap gl" aria-hidden="true">
            <b>{v.items[active][0]}</b>
            {CAMPUS_PHOTOS[active].own ? <i>{active + 1} / {v.items.length}</i> : <span>{v.sample}</span>}
          </div>
        </div>
        <div>
          <ul className="facs">
            {v.items.map(([name, body], i) => (
              <li key={name} data-i={i} ref={(el) => (items.current[i] = el)} className={i === active ? 'on' : ''}>
                <div className="m-photo"><img src={CAMPUS_PHOTOS[i].src} alt="" loading="lazy" style={{ objectPosition: CAMPUS_PHOTOS[i].pos }} /></div>
                <h3>{name}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
          <p className="more">{v.more}</p>
        </div>
      </div>
    </Sheet>
  );
}

const LIFE_PHOTOS = [media.yoga, media.ground, media.boy, media.campus, media.readingDesks, media.reading];

function Life() {
  const { t } = useLang();
  const v = t.v3.life;
  return (
    <Sheet id="life" note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className="grid-life">
        {LIFE_PHOTOS.map((m, i) => (
          <figure key={m.src}>
            <img src={m.src} alt="" loading="lazy" style={{ objectPosition: m.pos }} />
            <figcaption className="gl-dark">{v.caps[i]}</figcaption>
          </figure>
        ))}
      </div>
    </Sheet>
  );
}

function Voices() {
  const { t } = useLang();
  const v = t.v3.voices;
  const card = ([q, who], i, dup) => (
    <figure key={(dup ? 'd' : '') + i} className={'quote' + (dup ? ' dup' : '')} aria-hidden={dup || undefined}>
      <blockquote>{q}</blockquote>
      <figcaption>{who}</figcaption>
    </figure>
  );
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className="marquee">
        <div className="track">
          {v.items.map((q, i) => card(q, i, false))}
          {v.items.map((q, i) => card(q, i, true))}
        </div>
      </div>
    </Sheet>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Why />
      <Belief />
      <Stages />
      <Day />
      <Campus />
      <Life />
      <Voices />
      <Admissions />
    </>
  );
}
