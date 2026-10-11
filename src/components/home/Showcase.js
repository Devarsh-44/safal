'use client';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '../Icons';
import { Reveal } from '../Motion';
import { useLang, pick } from '@/lib/i18n';
import { facilities, gallery } from '@/lib/content';

gsap.registerPlugin(ScrollTrigger);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** "Education for life" — each word brightens as it scrolls through the viewport. */
export function Philosophy() {
  const { t, lang } = useLang();
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-w', { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.ph-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [lang]);
  return (
    <section className="ph" ref={root}>
      <div className="container">
        <p className="mono ph-eyebrow">{t.philEyebrow}</p>
        <p className="ph-text display" key={lang}>
          {t.phil.split(' ').map((w, i) => <span key={i} className="ph-w">{w} </span>)}
        </p>
      </div>
    </section>
  );
}

/** Facilities as a horizontal strip of photo cards, scrolled sideways while the section is pinned. */
export function FacilitiesScroll() {
  const { t, lang } = useLang();
  const root = useRef(null);
  const track = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 961px)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth + 64;
        gsap.to(track.current, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: 0.6, pin: true, invalidateOnRefresh: true },
        });
        gsap.utils.toArray('.fx-card img').forEach((img) => {
          gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true } });
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="fx" ref={root} id="facilities">
      <div className="fx-inner">
        <div className="container fx-head">
          <div>
            <p className="mono">{t.facEyebrow}</p>
            <h2 className="display h2" style={{ maxWidth: 560 }}>{t.facTitle}</h2>
          </div>
          <span className="mono fx-hint">{t.facHint} →</span>
        </div>
        <div className="fx-track" ref={track}>
          {facilities.map((f, i) => (
            <Link key={f.name} href={'/facilities#' + f.icon} className="fx-card">
              <img src={f.img} alt="" loading="lazy" />
              <span className="fx-num mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="fx-label">
                <b className="display">{pick(lang, f)}</b>
                <span>{t.content.facDesc?.[f.icon] ?? f.desc}</span>
              </span>
            </Link>
          ))}
          <Link href="/facilities" className="fx-card fx-more">
            <b className="display">{t.common.seeEvery}</b>
            <Icon name="arrow" size={28} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Masonry photo gallery with a keyboard-friendly lightbox. */
export function Gallery() {
  const { t } = useLang();
  const [open, setOpen] = useState(-1);
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % gallery.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start(); };
  }, [open]);
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal as="p" className="mono">{t.galEyebrow}</Reveal>
            <Reveal as="h2" className="display h2" delay={0.05} style={{ maxWidth: 640 }}>{t.galTitle}</Reveal>
          </div>
          <Link href="/news" style={{ fontWeight: 600 }}>{t.newsEyebrow} →</Link>
        </div>
        <div className="gal">
          {gallery.map((g, i) => (
            <motion.button
              key={g.src} className="gal-item" onClick={() => setOpen(i)} aria-label={`Open photo: ${g.caption}`}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <img src={g.src} alt={g.caption} loading="lazy" style={{ aspectRatio: `${g.w} / ${g.h}` }} />
              <span className="gal-cap mono">{g.caption}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open >= 0 && (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[open].caption}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(-1)}>
            <AnimatePresence mode="wait">
              <motion.img key={open} src={gallery[open].src} alt={gallery[open].caption} onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} />
            </AnimatePresence>
            <p className="mono lb-cap">{gallery[open].caption} · {open + 1}/{gallery.length}</p>
            <button className="lb-btn lb-close" aria-label="Close" onClick={() => setOpen(-1)}><Icon name="close" /></button>
            <button className="lb-btn lb-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + gallery.length) % gallery.length); }}>←</button>
            <button className="lb-btn lb-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % gallery.length); }}>→</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Endless editorial marquee under the hero. */
export function Marquee() {
  const { t } = useLang();
  const items = t.common.marquee;
  return (
    <div className="mq" aria-label="Highlights">
      <div className="mq-track">
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1}>
            {items.map((x) => <span key={x}>{x}<i>✦</i></span>)}
          </span>
        ))}
      </div>
    </div>
  );
}
