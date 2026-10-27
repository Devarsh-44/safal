'use client';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { listNews } from '@/lib/store';
import { media } from '@/lib/media';
import PageHero from './PageHero';
import Sheet from './Sheet';
import { Ink, useInView } from './Marks';
import { Head, useReveal } from './Reveal';

const ROBOT = { src: '/images/live/image-38.webp', pos: '50% 64%', own: true };

// One entry per caption in t.v3.lp.wall.caps: the picture, its filter, and where it is first pinned
// (left and top as % of the wall, tilt in degrees, width as % of the wall).
const PHOTOS = [
  { m: media.yoga, cat: 'sports', x: 2, y: 5, r: -6, w: 23 },
  { m: media.ground, cat: 'culture', x: 27, y: 1, r: 4, w: 21 },
  { m: media.boy, cat: 'culture', x: 52, y: 6, r: -3, w: 20 },
  { m: media.lab, cat: 'clubs', x: 77, y: 2, r: 6, w: 20 },
  { m: media.reading, cat: 'clubs', x: 4, y: 50, r: 5, w: 20 },
  { m: media.teacher, cat: 'trips', x: 27, y: 47, r: -4, w: 22 },
  { m: media.classroom, cat: 'clubs', x: 53, y: 52, r: 3, w: 19 },
  { m: media.readingDesks, cat: 'clubs', x: 77, y: 49, r: -6, w: 20 },
  { m: ROBOT, cat: 'clubs', x: 41, y: 29, r: -2, w: 15 },
];
const TAPES = ['#F7B928', '#4AB3EC', '#34B470', '#EE7A43', '#E0453F'];
const TINTS = ['#FDE7DA', '#DDF2FC', '#FFF1C9', '#DCF3E6', '#FBE0DF', '#E6E3F7', '#FFE9C2', '#D9F0F7'];

// How far each photo drifts while the wall scrolls past (px over the whole pass), so they feel pinned at different heights.
// The wall is about a screen tall, so only the middle half of that pass is really seen; these are sized for that.
const DEPTH = [-150, 100, -80, 170, 130, -110, 90, -170, 220];

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const isPhone = () => window.matchMedia('(max-width: 800px)').matches;

/** Big-photo viewer for the scrapbook. Arrows step through the photos the current filter shows. */
function Viewer({ list, at, caps, v, onMove, onClose }) {
  const close = useRef(null);
  const handlers = useRef({ onMove, onClose });
  handlers.current = { onMove, onClose };
  useEffect(() => {
    close.current?.focus();
    const key = (e) => {
      if (e.key === 'Escape') handlers.current.onClose();
      if (e.key === 'ArrowRight') handlers.current.onMove(1);
      if (e.key === 'ArrowLeft') handlers.current.onMove(-1);
    };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; };
  }, []);
  const i = list[at];
  const p = PHOTOS[i];
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={caps[i]} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <figure className="polaroid big" key={i}>
        <img src={p.m.src} alt={caps[i]} />
        <figcaption>{caps[i]}{!p.m.own && <small>{v.sample}</small>}</figcaption>
      </figure>
      <div className="viewer-ctl">
        <button type="button" className="rnd" onClick={() => onMove(-1)} aria-label={v.prev}>←</button>
        <span>{at + 1} / {list.length}</span>
        <button type="button" className="rnd" onClick={() => onMove(1)} aria-label={v.next}>→</button>
        <button type="button" className="btn btn-ink" ref={close} onClick={onClose}>{v.close}</button>
      </div>
    </div>
  );
}

/**
 * The scrapbook: polaroids taped to a page. On larger screens they can be dragged (they tilt with the
 * pull and land with a little bounce), filtered and shuffled; a tap opens the viewer.
 * On phones they sit in a tidy two-column grid.
 */
function Wall() {
  const { t } = useLang();
  const v = t.v3.lp.wall;
  const wall = useRef(null);
  const cards = useRef([]);
  const drag = useRef(null);
  const dragged = useRef(false);
  const [pos, setPos] = useState(() => PHOTOS.map(({ x, y, r }) => ({ x, y, r })));
  const [order, setOrder] = useState(() => PHOTOS.map((_, i) => i));
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const [ref, seen] = useInView(0.3);

  // Depth while scrolling: each photo drifts by its own amount as the wall passes through the screen.
  // It uses the separate `translate` property, so it never fights the drag (left/top) or the tilt (transform).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wall.current;
      if (!el) return;
      const phone = isPhone();
      const r = el.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1) - 0.5;
      cards.current.forEach((c, i) => c && c.style.setProperty('--py', phone ? '0px' : (p * DEPTH[i]).toFixed(1) + 'px'));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const shown = PHOTOS.map((p, i) => i).filter((i) => filter === 'all' || PHOTOS[i].cat === filter);

  const toTop = (i) => setOrder((o) => [...o.filter((x) => x !== i), i]);

  const down = (e, i) => {
    if (isPhone() || e.button > 0) return;
    const el = cards.current[i];
    try { el.setPointerCapture(e.pointerId); } catch {}
    drag.current = { i, el, sx: e.clientX, sy: e.clientY, ox: pos[i].x, oy: pos[i].y, x: pos[i].x, y: pos[i].y, lx: e.clientX, lt: performance.now(), tilt: 0, moved: false };
    toTop(i);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) { d.moved = true; d.el.classList.add('grab'); }
    const box = wall.current.getBoundingClientRect();
    const w = PHOTOS[d.i].w;
    d.x = clamp(d.ox + (dx / box.width) * 100, -3, 100 - w + 3);
    d.y = clamp(d.oy + (dy / box.height) * 100, -3, 70);
    // Tilt follows how fast the photo is pulled sideways, like paper swinging from a pinch.
    const now = performance.now();
    const vx = (e.clientX - d.lx) / Math.max(1, now - d.lt);
    d.lx = e.clientX;
    d.lt = now;
    d.tilt += (clamp(vx * 14, -16, 16) - d.tilt) * 0.35;
    d.el.style.left = d.x + '%';
    d.el.style.top = d.y + '%';
    d.el.style.setProperty('--swing', d.tilt.toFixed(2) + 'deg');
  };
  const up = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    d.el.classList.remove('grab');
    d.el.style.setProperty('--swing', '0deg');
    if (d.moved) {
      dragged.current = true;
      setPos((p) => p.map((q, k) => (k === d.i ? { ...q, x: d.x, y: d.y } : q)));
    }
  };
  const click = (i) => {
    if (dragged.current) { dragged.current = false; return; }
    setOpen(shown.indexOf(i));
  };

  // Deal the photos into the original slots in a new order, each with a fresh tilt.
  const shuffle = () => {
    const slots = PHOTOS.map(({ x, y }) => ({ x, y })).sort(() => Math.random() - 0.5);
    setPos(PHOTOS.map((p, i) => ({
      x: clamp(slots[i].x + (Math.random() * 4 - 2), -2, 100 - p.w + 2),
      y: clamp(slots[i].y + (Math.random() * 4 - 2), -2, 66),
      r: Math.round(Math.random() * 16 - 8),
    })));
  };

  return (
    <Sheet id="scrapbook" note={v.note}>
      <div className="wall-head">
        <Head eyebrow={v.eyebrow} title={v.title} />
        <p className="wall-hint" aria-hidden="true">{v.hint}</p>
      </div>
      <div className="wall-bar">
        <div className="chips" role="group" aria-label={v.eyebrow}>
          {v.filters.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
        <button type="button" className="btn btn-line shuffle" onClick={shuffle}>↻ {v.shuffle}</button>
      </div>
      <div className={'wall' + (seen ? ' seen' : '')} ref={(el) => { wall.current = el; ref.current = el; }}>
        <span className="sticker star" aria-hidden="true"><Ink kind="star" color="var(--marigold)" width={4} play={seen} delay={600} /></span>
        <span className="sticker stamp" aria-hidden="true">{v.stamp}</span>
        <svg className="sticker kite" viewBox="0 0 80 120" aria-hidden="true">
          <path d="M40 4 L72 40 L40 78 L8 40 Z" fill="#4AB3EC" stroke="#241D5C" strokeWidth="3" strokeLinejoin="round" />
          <path d="M40 4 L40 78 M8 40 L72 40" stroke="#241D5C" strokeWidth="2" />
          <path d="M40 4 L72 40 L40 40 Z" fill="#F7B928" />
          <path d="M40 78 C 30 92, 52 98, 40 116" fill="none" stroke="#E0453F" strokeWidth="3" strokeLinecap="round" />
        </svg>
        {PHOTOS.map((p, i) => (
          <button key={p.m.src} type="button" ref={(el) => (cards.current[i] = el)}
            className={'polaroid' + (filter !== 'all' && p.cat !== filter ? ' out' : '')}
            style={{ left: pos[i].x + '%', top: pos[i].y + '%', width: p.w + '%', zIndex: order.indexOf(i) + 1, '--r': pos[i].r + 'deg', '--tape': TAPES[i % TAPES.length], '--i': i }}
            aria-label={v.open(v.caps[i])} tabIndex={filter !== 'all' && p.cat !== filter ? -1 : 0}
            onPointerDown={(e) => down(e, i)} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={() => click(i)}>
            <img src={p.m.src} alt="" draggable="false" style={{ objectPosition: p.m.pos }} />
            <span className="cap">{v.caps[i]}</span>
          </button>
        ))}
      </div>
      {open !== null && shown.length > 0 && (
        <Viewer list={shown} at={Math.max(0, open)} caps={v.caps} v={v}
          onMove={(s) => setOpen((o) => (o + s + shown.length) % shown.length)}
          onClose={() => { const i = shown[open]; setOpen(null); cards.current[i]?.focus(); }} />
      )}
    </Sheet>
  );
}

function Clubs() {
  const { t } = useLang();
  const v = t.v3.lp.clubs;
  const [ref, cls] = useReveal(0.2);
  return (
    <Sheet id="clubs" note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <ul className={'clubs rv-deal' + cls} ref={ref}>
        {v.items.map(([name, body], i) => (
          <li key={name} style={{ '--tint': TINTS[i % TINTS.length] }}>
            <span className="no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{name}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ul>
      <p className="confirm">{v.confirm}</p>
    </Sheet>
  );
}

/** The latest published news from the admin panel, pinned to a board. */
function Board() {
  const { t, lang } = useLang();
  const v = t.v3.lp.board;
  const [ref, cls] = useReveal(0.2);
  const [items, setItems] = useState(null);
  useEffect(() => {
    let on = true;
    listNews().then((rows) => on && setItems(rows.slice(0, 6))).catch(() => on && setItems([]));
    return () => { on = false; };
  }, []);
  const locale = { en: 'en-IN', gu: 'gu-IN', hi: 'hi-IN' }[lang] || 'en-IN';
  const date = (d) => { const x = new Date(d); return Number.isNaN(x.getTime()) ? '' : x.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }); };
  return (
    <Sheet id="news" note={v.note}>
      <div className={'board rv-drop' + cls} ref={ref}>
        <Head eyebrow={v.eyebrow} title={v.title} />
        {items === null && <p className="board-msg">{v.loading}</p>}
        {items?.length === 0 && <p className="board-msg">{v.empty}</p>}
        {items?.length > 0 && (
          <ul className="notices">
            {items.map((n, i) => (
              <li key={n.id || n.title} style={{ '--pin': TAPES[i % TAPES.length] }}>
                <p className="meta"><time dateTime={n.date}>{date(n.date)}</time>{n.tag && <span>{n.tag}</span>}</p>
                {n.image_url && <img src={n.image_url} alt="" loading="lazy" />}
                <h3>{n.title}</h3>
                {n.body && <p className="body">{n.body}</p>}
                {n.video_url && !n.video_url.includes('[') && <a href={n.video_url} target="_blank" rel="noopener noreferrer">{v.watch} →</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  );
}

function Voices() {
  const { t } = useLang();
  const v = t.v3.lp.voices;
  const [ref, cls] = useReveal(0.2);
  return (
    <Sheet note={v.note}>
      <Head eyebrow={v.eyebrow} title={v.title} />
      <div className={'cards-notes rv-slide' + cls} ref={ref}>
        {t.v3.voices.items.map(([q, who]) => (
          <figure key={who + q.slice(0, 12)} className="index-card">
            <blockquote>{q}</blockquote>
            <figcaption>{who}</figcaption>
          </figure>
        ))}
      </div>
    </Sheet>
  );
}

export default function LifePage() {
  const { t } = useLang();
  const v = t.v3.lp;
  return (
    <>
      <PageHero photo={media.yoga.src} pos={media.yoga.pos} color="var(--pen)" note={v.note} crumb={v.crumb} eyebrow={v.eyebrow} a={v.a} mark={v.mark} b={v.b} intro={v.intro}>
        <a className="btn btn-apply" href="#scrapbook">{v.cta}</a>
        <a className="btn btn-line" href="/admissions#apply">{v.apply}</a>
      </PageHero>
      <Wall />
      <Clubs />
      <Board />
      <Voices />
    </>
  );
}
