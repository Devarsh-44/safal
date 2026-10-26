'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { Ink } from './Marks';

const SLIDES = ['/images/live/safalvidhyalaya.webp', '/images/live/event-b.webp', '/images/live/event-a.webp', '/images/live/safal-boy.webp'];
const HOLD = 5000;

/** Full-bleed campus carousel (from 21oaks): crossfade with a slow zoom, thumbnails with a progress bar. */
export default function Hero() {
  const { t } = useLang();
  const h = t.v3.hero;
  const [idx, setIdx] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const timer = useRef(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(() => setDrawn(true), 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (reduce.current) return;
    timer.current = setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), HOLD);
    return () => clearTimeout(timer.current);
  }, [idx]);

  return (
    <div className="hero-frame" id="top">
    <section className="hero" aria-roledescription="carousel" aria-label={h.alts[0]}>
      {SLIDES.map((src, i) => (
        <div key={src} className={'slide' + (i === idx ? ' on' : '')} aria-hidden={i !== idx}>
          <img src={src} alt={h.alts[i]} fetchPriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}

      <div className="hero-copy">
        <h1>
          {h.a}<br />{h.b}{' '}
          <span className="mk mk-squiggle">{h.mark}<Ink kind="squiggle" color="var(--marigold)" width={6} play={drawn} /></span>
        </h1>
        <p>{h.sub}</p>
        <div className="chips">{h.chips.map((c) => <span key={c} className="gl-dark">{c}</span>)}</div>
      </div>

      <aside className="glass gl">
        <span className="tag">{h.cardTag}</span>
        <h2>{h.cardTitle}</h2>
        <p>{h.cardBody}</p>
        <a href="#admissions">{h.cardCta} <i aria-hidden="true">→</i></a>
      </aside>

      <p className="counter" aria-live="polite">{String(idx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</p>
      <div className="thumbs gl-dark">
        {SLIDES.map((src, i) => (
          <button key={src} type="button" className={i === idx ? 'on' : ''} aria-label={h.photo(i + 1)} aria-current={i === idx} onClick={() => setIdx(i)}>
            <img src={src} alt="" />
            <span className="bar" key={i === idx ? 'run' + idx : 'idle'} />
          </button>
        ))}
      </div>
    </section>
    </div>
  );
}
