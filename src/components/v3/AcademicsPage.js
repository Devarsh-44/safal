'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school } from '@/lib/content';
import { media } from '@/lib/media';
import PageHero from './PageHero';
import Sheet from './Sheet';
import { Ink, Mark, useInView } from './Marks';

// First standard of each stage, for the "Enquire for Std N" links.
const FIRST_STD = [1, 6, 9, 11];
const STAGE_COLORS = ['#EE7A43', '#34B470', '#4AB3EC', '#E0453F'];

/** True once mounted, so entrance animations hide their pieces only when JS will play them in. */
function useArmed() {
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);
  return armed;
}

/** A ruled notebook page with coloured index tabs down its edge. Picking a tab turns to that stage. */
function Index() {
  const { t } = useLang();
  const v = t.v3.acad.index;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef([]);
  const go = (i) => {
    const n = (i + v.stages.length) % v.stages.length;
    setDir(n > cur ? 1 : -1);
    setCur(n);
    return n;
  };
  const onKey = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (e.key === 'Home' || e.key === 'End' || step) {
      e.preventDefault();
      const n = go(e.key === 'Home' ? 0 : e.key === 'End' ? v.stages.length - 1 : cur + step);
      tabs.current[n]?.focus();
    }
  };
  const s = v.stages[cur];
  return (
    <Sheet id="stages" note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className="index" id="syllabus" style={{ '--tab': STAGE_COLORS[cur] }}>
        <div className="tabs" role="tablist" aria-label={v.tabs} aria-orientation="vertical" onKeyDown={onKey}>
          {v.stages.map((st, i) => (
            <button key={st.range} ref={(el) => (tabs.current[i] = el)} type="button" role="tab" id={'stage-tab-' + i} aria-controls="stage-panel"
              aria-selected={cur === i} tabIndex={cur === i ? 0 : -1} style={{ '--c': STAGE_COLORS[i] }} onClick={() => go(i)}>
              <b><em>{st.range.split(/ (?=\d)/)[0]} </em>{st.range.split(/ (?=\d)/)[1]}</b><span>{st.name}</span>
            </button>
          ))}
        </div>
        <div className="page leaf" role="tabpanel" id="stage-panel" aria-labelledby={'stage-tab-' + cur}>
          <div key={cur} className={'turn' + (dir < 0 ? ' back' : '')}>
            <p className="eyebrow">{s.name}</p>
            <h3><span className="range">{s.range}</span> {s.title}</h3>
            <ul className="ticks">
              {s.points.map((p, i) => <li key={p}><Ink kind="tick" color="var(--pen)" width={3.5} play delay={250 + i * 220} />{p}</li>)}
            </ul>
            <div className="leaf-foot">
              <span>{v.medium}</span>
              <a href={`/admissions?std=${FIRST_STD[cur]}#apply`}>{v.enquire(FIRST_STD[cur])}</a>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/** Bloom's taxonomy as a staircase that builds itself step by step, with a star drawn at the top. */
function Bloom() {
  const { t } = useLang();
  const v = t.v3.acad.bloom;
  const [ref, seen] = useInView(0.35);
  const armed = useArmed();
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
        <p className="lede">{v.intro}</p>
      </div>
      <ol className={'stairs' + (armed ? ' armed' : '') + (seen ? ' built' : '')} ref={ref}>
        {v.steps.map(([name, body], i) => (
          <li key={name} style={{ '--i': i }}>
            {i === v.steps.length - 1 && (
              <span className="goal" aria-hidden="true"><Ink kind="star" color="var(--pen)" width={3} play={seen} delay={v.steps.length * 140 + 500} />{v.top}</span>
            )}
            <div className="step">
              <i>{i + 1}</i>
              <b>{name}</b>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

/** Std 11–12 streams, dealt as tilted cards on the page's marigold field. */
function Streams() {
  const { t } = useLang();
  const v = t.v3.acad.streams;
  const [ref, seen] = useInView(0.25);
  return (
    <Sheet id="streams" note={v.note}>
      <div className="field">
        <div className="head">
          <p className="eyebrow">{v.eyebrow}</p>
          <h2 className="h2">{v.a} <Mark kind="squiggle" color="var(--on-field)">{v.mark}</Mark></h2>
          <p className="field-intro">{v.intro}</p>
        </div>
        <div className={'deck three' + (seen ? ' dealt' : '')} ref={ref}>
          {v.cards.map((c, i) => (
            <article key={c.name} className="card" style={{ '--i': i }}>
              <div className="face"><small>{v.std}</small><b>{c.name}</b></div>
              <p>{c.subjects}</p>
              <p className="leads"><span>{v.leads}</span>{c.leads}</p>
              <div className="foot"><span /><a href="/admissions?std=11#apply">{v.enquire} →</a></div>
            </article>
          ))}
        </div>
        <p className="field-note">{v.confirm}</p>
      </div>
    </Sheet>
  );
}

/** The extra programmes, as sticky notes pinned to the page. */
function Programs() {
  const { t } = useLang();
  const v = t.v3.acad.programs;
  const [ref, seen] = useInView(0.3);
  const armed = useArmed();
  return (
    <Sheet id="programs" note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <div className={'stickies' + (armed ? ' armed' : '') + (seen ? ' stuck' : '')} ref={ref}>
        {v.items.map(([tag, name, body], i) => (
          <article key={name} className="sticky" style={{ '--i': i }}>
            <small>{tag}</small>
            <h3>{name}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </Sheet>
  );
}

/** Contents page for parents. Each row has the anchor the old site linked to (#planner, #exams…). */
function Desk() {
  const { t } = useLang();
  const v = t.v3.acad.desk;
  return (
    <Sheet id="parents" note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
        <p className="lede">{v.intro}</p>
      </div>
      <ol className="toc">
        {v.items.map(([id, title, body], i) => (
          <li key={id} id={id}>
            <span className="no">{i + 1}.</span>
            <div className="what"><b>{title}</b><span>{body}</span></div>
            <span className="dots" aria-hidden="true" />
            <span className="soon">{v.soon}</span>
            <a href={`https://wa.me/${school.whatsapp}?text=${encodeURIComponent(v.waText(title))}`} target="_blank" rel="noopener noreferrer">{v.ask}</a>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function Visit() {
  const { t } = useLang();
  const v = t.v3.acad.visit;
  return (
    <section className="wrap" style={{ paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
      <div className="band">
        <img src={media.lab.src} alt="" loading="lazy" style={{ objectPosition: media.lab.pos }} />
        <div className="card-g gl">
          <p className="eyebrow">{v.eyebrow}</p>
          <h2>{v.title}</h2>
          <p>{v.body}</p>
          <div className="row">
            <a className="btn btn-apply" href="/admissions#apply">{t.v3.acad.apply}</a>
            <a className="btn btn-line" href={`tel:${school.phone}`}>{v.call}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AcademicsPage() {
  const { t } = useLang();
  const v = t.v3.acad;
  return (
    <>
      <PageHero photo={media.classroom.src} pos={media.classroom.pos} color="var(--leaf)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} intro={v.intro}>
        <a className="btn btn-apply" href="#stages">{v.cta}</a>
        <a className="btn btn-line" href="/admissions#apply">{v.apply}</a>
      </PageHero>
      <Index />
      <Bloom />
      <Streams />
      <Programs />
      <Desk />
      <Visit />
    </>
  );
}
