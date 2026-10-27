'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import { media } from '@/lib/media';
import PageHero from './PageHero';
import Sheet from './Sheet';
import { Ink, Mark } from './Marks';
import { Head, useEasedScroll, useReveal } from './Reveal';

const clamp = (x) => Math.min(1, Math.max(0, x));
const TINTS = ['#E9E3FF', '#DDF2FC', '#FFF1C9', '#DCF3E6'];

/**
 * The principal's letter. As it scrolls up the screen its words darken in reading order, as if
 * being written, and the signature draws itself once the last line is reached. The progress glides
 * rather than stepping with the scrollbar. Before JS runs (and with reduced motion) the whole letter shows.
 */
function Letter() {
  const { t } = useLang();
  const v = t.v3.ab.letter;
  const box = useRef(null);
  const sig = useRef(null);
  const words = useRef([]);
  const lit = useRef(-1);
  const [live, setLive] = useState(false);
  const [ref, cls] = useReveal(0.15);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLive(true);
  }, []);

  // New language, new words: forget what was lit so the next frame repaints them.
  useEffect(() => {
    words.current = [...box.current.querySelectorAll('.w')];
    lit.current = -1;
  }, [t]);

  useEasedScroll({
    measure: () => {
      const r = box.current.getBoundingClientRect();
      const h = window.innerHeight;
      // 0 when the letter's top reaches 80% down the screen, 1 when its bottom reaches 55%.
      return clamp((h * 0.8 - r.top) / (r.height + h * 0.25));
    },
    render: (p) => {
      const ws = words.current;
      const n = Math.round(p * 1.06 * ws.length);
      if (n !== lit.current) {
        const from = Math.max(0, Math.min(n, lit.current));
        const to = Math.min(ws.length, Math.max(n, lit.current < 0 ? ws.length : lit.current));
        for (let i = from; i < to; i++) ws[i].classList.toggle('on', i < n);
        lit.current = n;
      }
      sig.current.style.strokeDashoffset = String(1 - clamp((p - 0.86) / 0.14));
    },
  }, 180);

  return (
    <Sheet id="letter" note={v.note}>
      <div className={'letter-wrap rv-paper' + cls} ref={ref}>
        <article className={'page letter' + (live ? ' live' : '')} ref={box}>
          <p className="hello">{v.hello}</p>
          {v.paras.map((para, i) => (
            <p key={i} className="para">
              {para.split(' ').map((w, k) => <span key={k} className="w">{w} </span>)}
            </p>
          ))}
          <p className="bye">{v.bye}</p>
          <svg className="sig" viewBox="0 0 220 70" aria-hidden="true">
            <path ref={sig} pathLength="1" d="M8 48 C 22 12, 44 8, 40 40 C 37 62, 18 56, 30 36 C 46 12, 62 56, 78 38 C 88 26, 94 52, 108 44 C 122 36, 126 18, 140 36 C 150 50, 160 50, 174 34 C 182 26, 190 30, 212 22 M60 60 C 100 56, 150 58, 196 52" />
          </svg>
          <p className="who"><b>{v.name}</b><span>{v.role}</span></p>
          <p className="confirm">{v.draft}</p>
        </article>
        <figure className="snap" aria-hidden="true">
          <span className="ph"><svg viewBox="0 0 80 80"><circle cx="40" cy="30" r="15" /><path d="M12 76 C 14 54, 66 54, 68 76 Z" /></svg></span>
          <figcaption>{v.photo}</figcaption>
        </figure>
      </div>
    </Sheet>
  );
}

const VALUE_MARKS = [['squiggle', 'var(--sky)'], ['circle', 'var(--pen)'], ['double', 'var(--marigold)'], ['squiggle', 'var(--leaf)']];

/** The four values as soft cards that deal in, each word getting its teacher's mark once it lands. */
function Values() {
  const { t } = useLang();
  const v = t.v3.ab.values;
  const [ref, cls] = useReveal(0.2);
  return (
    <Sheet note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ol className={'values rv-deal' + cls} ref={ref}>
        {v.items.map(([word, line], i) => (
          <li key={word} style={{ '--c': VALUE_MARKS[i][1] }}>
            <span className="vno">{String(i + 1).padStart(2, '0')}</span>
            <span className="vword"><Mark kind={VALUE_MARKS[i][0]} color={VALUE_MARKS[i][1]} width={i === 1 ? 3.5 : 5} delay={500 + i * 120}>{word}</Mark></span>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function Milestone({ year, text, on }) {
  return (
    <li className={on ? 'on' : ''}>
      <span className="dot"><Ink kind="tick" color="var(--pen)" width={3.5} play={on} delay={120} /></span>
      <b>{year}</b>
      <p>{text}</p>
    </li>
  );
}

/**
 * Milestones down a line that fills in as the page scrolls, gliding rather than stepping.
 * Each milestone slides in and gets its tick as the line reaches its dot. Dot positions are
 * measured once per resize, not every frame.
 */
function Story() {
  const { t } = useLang();
  const v = t.v3.ab.story;
  const list = useRef(null);
  const fill = useRef(null);
  const dots = useRef([]);
  const [reached, setReached] = useState(0);

  useEasedScroll({
    layout: () => {
      const el = list.current;
      dots.current = [...el.querySelectorAll('li')].map((li) => (li.offsetTop + 12) / el.offsetHeight);
    },
    measure: () => {
      const r = list.current.getBoundingClientRect();
      return clamp((window.innerHeight * 0.6 - r.top) / r.height);
    },
    render: (f) => {
      fill.current.style.transform = `scaleY(${f})`;
      setReached(dots.current.filter((d) => d <= f).length);
    },
  }, 160);

  return (
    <Sheet id="story" note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ol className="timeline" ref={list}>
        <i className="tl-fill" ref={fill} aria-hidden="true" />
        {v.items.map(([year, text], i) => <Milestone key={i} year={year} text={text} on={i < reached} />)}
      </ol>
      <p className="confirm">{v.confirm}</p>
    </Sheet>
  );
}

function Team() {
  const { t } = useLang();
  const v = t.v3.ab.team;
  const [ref, cls] = useReveal(0.2);
  return (
    <Sheet id="team" note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ul className={'team rv-deal' + cls} ref={ref}>
        {v.items.map(([name, role], i) => (
          <li key={role} style={{ '--tint': TINTS[i % TINTS.length] }}>
            <span className="ph" aria-hidden="true"><svg viewBox="0 0 80 80"><circle cx="40" cy="30" r="15" /><path d="M12 76 C 14 54, 66 54, 68 76 Z" /></svg><em>{v.soon}</em></span>
            <h3>{name}</h3>
            <p>{role}</p>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

function Family() {
  const { t, lang } = useLang();
  const v = t.v3.ab.family;
  const [ref, cls] = useReveal(0.2);
  const [vbRef, vbCls] = useReveal(0.3);
  const local = (c) => c[lang] || c.name;
  return (
    <Sheet id="campuses" note={v.note}>
      <div className="family">
        <div className={'vb rv-rise' + vbCls} ref={vbRef}>
          <p className="eyebrow">{v.eyebrow}</p>
          <h2 className="h2">{v.title}</h2>
          <p>{v.body}</p>
        </div>
        <div className={'campus-cards rv-slide' + cls} ref={ref}>
          <p className="eyebrow">{v.campuses}</p>
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

export default function AboutPage() {
  const { t } = useLang();
  const v = t.v3.ab;
  return (
    <div className="pg-about">
      <PageHero photo={media.campus.src} pos={media.campus.pos} color="var(--violet)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} b={v.b} intro={v.intro}>
        <a className="btn btn-apply" href="#letter">{v.cta}</a>
        <a className="btn btn-line" href="/admissions#apply">{v.visit}</a>
      </PageHero>
      <Letter />
      <Values />
      <Story />
      <Team />
      <Family />
    </div>
  );
}
