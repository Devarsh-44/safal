'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { school, facilities } from '@/lib/content';
import { media } from '@/lib/media';
import Sheet from './Sheet';
import { Ink } from './Marks';

// One photo per stop, in the order of t.v3.camp.stops.
const STOPS = [media.campus, media.ground, media.classroom, media.lab, media.readingDesks, media.yoga];
// Pictures for "Also on campus", as indexes into `facilities`: hostel, transport, canteen, health, parenting, field trips.
const MORE = [3, 4, 6, 5, 7, 8];
const MORE_TINTS = ['#FDE7DA', '#DDF2FC', '#FFF1C9', '#DCF3E6', '#FBE0DF', '#E6E3F7'];

const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const pad = (n) => String(n).padStart(2, '0');
// Smoothstep: a gentle start and finish, so stops hand over softly instead of at a constant rate.
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * The tour: a notebook page that stays pinned while scrolling moves you sideways from stop to stop.
 * The photo in the middle is full size and its neighbours shrink away; a red pen trail draws itself
 * underneath with a "you are here" marker, and each stop is ticked as you pass it.
 * Scroll maps 1:1 to sideways travel. Positions are written to CSS variables, so React only
 * re-renders when the current stop changes.
 */
function Journey() {
  const { t } = useLang();
  const v = t.v3.camp;
  const n = STOPS.length;
  const sec = useRef(null);
  const track = useRef(null);
  const svg = useRef(null);
  const base = useRef(null);
  const ink = useRef(null);
  const marker = useRef(null);
  const stops = useRef([]);
  const checks = useRef([]);
  const geo = useRef({ max: 0, w: 1, len: 1 });
  const [cur, setCur] = useState(-1);
  const [reached, setReached] = useState(-1);
  const [live, setLive] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), 600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // `target` follows the scrollbar; `x` eases after it every frame, so wheel notches and flicks glide.
    const s = { target: 0, x: 0, raf: 0, last: 0, idle: 0 };
    let lastCur = -2;
    let lastReached = -2;

    const render = (x) => {
      const { w, len } = geo.current;
      track.current.style.transform = `translate3d(${-x}px, 0, 0)`;
      const mid = x + window.innerWidth / 2;
      const frac = clamp(mid / w);
      ink.current.style.strokeDashoffset = String(1 - frac);
      const pt = base.current.getPointAtLength(frac * len);
      marker.current.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      let c = -1;
      let rch = -1;
      stops.current.forEach((el, i) => {
        const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / window.innerWidth;
        el.style.setProperty('--d', reduce ? 0 : clamp(d, -1, 1));
        el.style.setProperty('--a', reduce ? 0 : smooth(clamp(Math.abs(d) * 1.6)));
        if (Math.abs(d) < 0.3) c = i;
        if (d <= 0.04) rch = i;
      });
      if (c !== lastCur) { lastCur = c; setCur(c); }
      if (rch !== lastReached) { lastReached = rch; setReached(rch); }
    };

    const frame = (now) => {
      s.raf = 0;
      const dt = Math.min(64, s.last ? now - s.last : 16);
      s.last = now;
      s.x += (s.target - s.x) * (reduce ? 1 : 1 - Math.exp(-dt / 120));
      if (Math.abs(s.target - s.x) < 0.3) s.x = s.target;
      render(s.x);
      if (s.x !== s.target) s.raf = requestAnimationFrame(frame);
      else s.last = 0;
    };
    const run = () => { if (!s.raf) s.raf = requestAnimationFrame(frame); };

    const readTarget = () => {
      const r = sec.current.getBoundingClientRect();
      s.target = clamp(-r.top / Math.max(1, r.height - window.innerHeight)) * geo.current.max;
    };

    // Once scrolling rests mid-tour, ease the nearest stop (or the intro or the ending) into the centre.
    const settle = () => {
      const r = sec.current.getBoundingClientRect();
      if (reduce || r.top > 0 || r.bottom < window.innerHeight) return;
      const { max } = geo.current;
      const half = window.innerWidth / 2;
      const rests = [0, max, ...stops.current.map((el) => clamp(el.offsetLeft + el.offsetWidth / 2 - half, 0, max))];
      const best = rests.reduce((a, b) => (Math.abs(b - s.target) < Math.abs(a - s.target) ? b : a));
      if (Math.abs(best - s.target) > 2) window.scrollTo({ top: r.top + window.scrollY + best, behavior: 'smooth' });
    };

    // Measure the track, size the section so its scroll length equals the sideways distance, and draw the trail.
    const layout = () => {
      const tr = track.current;
      const w = tr.scrollWidth;
      const h = tr.clientHeight;
      const max = Math.max(0, w - window.innerWidth);
      sec.current.style.height = `${window.innerHeight + max}px`;
      const y0 = h * (window.innerWidth < 800 ? 0.8 : 0.87);
      const amp = Math.min(28, h * 0.035);
      const pts = [[0, y0]];
      stops.current.forEach((el, i) => pts.push([el.offsetLeft + el.offsetWidth / 2, y0 + (i % 2 ? amp : -amp)]));
      pts.push([w, y0]);
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, ya] = pts[i - 1];
        const [x1, yb] = pts[i];
        const mx = (x0 + x1) / 2;
        d += ` C${mx} ${ya} ${mx} ${yb} ${x1} ${yb}`;
      }
      svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.current.style.width = `${w}px`;
      base.current.setAttribute('d', d);
      ink.current.setAttribute('d', d);
      checks.current.forEach((el, i) => {
        if (el) el.style.transform = `translate(${pts[i + 1][0]}px, ${pts[i + 1][1]}px)`;
      });
      geo.current = { max, w, len: base.current.getTotalLength() };
      // Jump straight to the right place after a resize or reload; easing only applies to scrolling.
      readTarget();
      s.x = s.target;
      render(s.x);
    };

    const onScroll = () => {
      readTarget();
      run();
      clearTimeout(s.idle);
      s.idle = setTimeout(settle, 180);
    };
    const onResize = () => { cancelAnimationFrame(s.raf); s.raf = 0; requestAnimationFrame(layout); };
    setLive(true);
    layout();
    document.fonts?.ready.then(layout);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(s.raf);
      clearTimeout(s.idle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Scroll the window so stop `i` sits in the middle of the screen.
  const jump = (i) => {
    const el = stops.current[clamp(i, 0, n - 1)];
    const x = clamp(el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2, 0, geo.current.max);
    window.scrollTo({ top: sec.current.getBoundingClientRect().top + window.scrollY + x, behavior: 'smooth' });
  };

  return (
    <section className={'trip' + (live ? ' live' : '')} ref={sec} id="tour">
      <div className="trip-stage">
        <div className="trip-track" ref={track}>
          <svg className="trail" ref={svg} aria-hidden="true">
            <path ref={base} className="trail-base" />
            <path ref={ink} className="trail-ink" pathLength="1" />
          </svg>
          <div className="trail-me" ref={marker} aria-hidden="true"><span>{v.here}</span><i /></div>
          {STOPS.map((m, i) => (
            <span key={m.src} className={'trail-check' + (i <= reached ? ' on' : '')} ref={(el) => (checks.current[i] = el)} aria-hidden="true">
              <Ink kind="tick" color="var(--pen)" width={3.5} play={i <= reached} />
            </span>
          ))}

          <header className="leg-intro">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">{t.v3.home}</Link><span aria-hidden="true">/</span><span aria-current="page">{v.crumb}</span></nav>
            <p className="hand-note">{v.note}</p>
            <p className="eyebrow">{v.eyebrow}</p>
            <h1>{v.a} <span className="mk mk-squiggle">{v.mark}<Ink kind="squiggle" color="var(--saffron)" width={6} play={drawn} /></span></h1>
            <p className="sub">{v.sub}</p>
          </header>

          {v.stops.map(([title, body], i) => (
            <article key={title} className={'stop' + (i === cur ? ' cur' : '')} ref={(el) => (stops.current[i] = el)} style={{ '--rot': i % 2 ? '1.2deg' : '-1.2deg' }}>
              <div className="label"><span className="no">{pad(i + 1)}</span><h2>{title}</h2></div>
              <figure className="photo">
                {/* Eager: the track moves by transform, so the browser never sees these scroll into view. */}
                <img src={STOPS[i].src} alt="" fetchPriority={i < 2 ? 'high' : 'low'} style={{ objectPosition: STOPS[i].pos }} />
                {!STOPS[i].own && <figcaption className="gl-dark">{v.sample}</figcaption>}
              </figure>
              <p>{body}</p>
            </article>
          ))}

          <div className="leg-end">
            <span className="done"><Ink kind="star" color="var(--pen)" width={3} play={reached === n - 1} />{v.end.done}</span>
            <h2>{v.end.title}</h2>
            <p>{v.end.body}</p>
            <div className="row">
              <a className="btn btn-apply" href="/admissions#apply">{v.end.cta}</a>
              <a className="btn btn-line" href={`tel:${school.phone}`}>{v.end.call}</a>
            </div>
          </div>
        </div>

        <div className="trip-ui">
          <p className={'hint' + (cur < 0 && reached < 0 ? '' : ' gone')} aria-hidden="true">{v.hint} <i>→</i></p>
          <p className="where" aria-live="polite">{cur >= 0 ? v.stop(cur + 1, n) : ''}</p>
          <button type="button" className="rnd" onClick={() => jump(cur - 1)} disabled={cur <= 0} aria-label={v.prev}>←</button>
          <button type="button" className="rnd" onClick={() => jump(cur + 1)} disabled={cur >= n - 1} aria-label={v.next}>→</button>
        </div>
      </div>
    </section>
  );
}

function More() {
  const { t } = useLang();
  const v = t.v3.camp.more;
  return (
    <Sheet note={v.note}>
      <div className="head">
        <p className="eyebrow">{v.eyebrow}</p>
        <h2 className="h2">{v.title}</h2>
      </div>
      <ul className="more-grid">
        {v.items.map(([name, body], i) => (
          <li key={name} style={{ '--tint': MORE_TINTS[i] }}>
            <img src={facilities[MORE[i]].img} alt="" loading="lazy" />
            <div><h3>{name}</h3><p>{body}</p></div>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export default function CampusPage() {
  return (
    <>
      <Journey />
      <More />
    </>
  );
}
