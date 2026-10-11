'use client';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '../Icons';
import { useLang, pick } from '@/lib/i18n';
import { school } from '@/lib/content';
import { ROOFLINE } from './roofline';

gsap.registerPlugin(ScrollTrigger);

const PHOTO = '/images/live/safalvidhyalaya.webp';

/**
 * Cinematic hero. The campus photo is drawn twice inside one SVG: the full photo, then the giant
 * SAFAL wordmark, then the photo again clipped to the roofline — so the letters sit *behind* the
 * building. On load the wordmark rises from behind the roof; on scroll the camera pushes in and it sinks.
 * Intro and scroll animations target different wrappers so they never fight over the same property.
 */
export default function Hero() {
  const { t, lang, branch, setBranch } = useLang();
  const root = useRef(null);
  const c = school.campuses[branch];

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hx-cam', { scale: 1.12, duration: 2.4, ease: 'power2.out', svgOrigin: '512 450' }, 0)
        .from('.hx-rise', { y: 230, duration: 1.8 }, 0.2)
        .from('.hx-in', { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.8)
        .from('.hx-branch', { y: 40, opacity: 0, duration: 1 }, 1.1)
        .from('.hx-cue', { opacity: 0, duration: 1 }, 1.4);

      const mm = gsap.matchMedia();
      mm.add('(min-width: 961px)', () => {
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=90%', scrub: 0.6, pin: true },
        })
          .to('.hx-zoom', { scale: 1.22, svgOrigin: '512 470', ease: 'none' }, 0)
          .to('.hx-word', { y: 150, ease: 'none' }, 0)
          .to('.hx-bottom', { y: -60, opacity: 0, ease: 'none' }, 0)
          .to('.hx-cue', { opacity: 0, ease: 'none', duration: 0.2 }, 0)
          .to('.hx-shade', { opacity: 1, ease: 'none' }, 0);
      });
      mm.add('(max-width: 960px)', () => {
        gsap.to('.hx-word', { y: 70, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hx" ref={root}>
      <svg className="hx-scene hx-desk" viewBox="0 -150 1024 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Scene id="d" size={280} x={372} y={200} len={640} />
      </svg>
      <svg className="hx-scene hx-mob" viewBox="400 -60 520 520" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <Scene id="m" size={190} x={445} y={180} len={430} />
      </svg>
      <div className="hx-shade" aria-hidden="true" />

      <div className="container hx-bottom">
        <div className="hx-copy">
          <p className="hx-in mono">● {t.session}</p>
          <h1 className="hx-in display hx-h1">{t.h1a} <em>{t.h1b}</em></h1>
          <p className="hx-in hx-sub">{t.sub}</p>
          <div className="hx-in hx-ctas">
            <Link href="/admissions" className="btn btn-pill btn-primary btn-lg">{t.cta1} <Icon name="arrow" size={20} /></Link>
            <Link href="/#visit" className="btn btn-pill btn-glass btn-lg">{t.cta2}</Link>
          </div>
        </div>

        <div className="hx-branch">
          <p className="mono" style={{ margin: '0 0 10px' }}>{t.campusPick}</p>
          <div className="hx-seg" role="group" aria-label={t.campusPick}>
            {school.campuses.map((cp, i) => (
              <button key={cp.id} aria-pressed={branch === i} onClick={() => setBranch(i)}>{pick(lang, cp)}</button>
            ))}
          </div>
          <div className="hx-branch-info" key={c.id}>
            <span><Icon name="pin" size={16} /> {c.address}</span>
            {!c.phone.startsWith('[') && <a href={`tel:${c.phone.replace(/\s/g, '')}`}><Icon name="phone" size={16} /> {c.phone}</a>}
          </div>
        </div>
      </div>

      <div className="hx-cue mono" aria-hidden="true"><span />{t.scroll}</div>
    </section>
  );
}

function Scene({ id, size, x, y, len }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F86D6" />
          <stop offset="1" stopColor="#A6CDFB" />
        </linearGradient>
        <linearGradient id={`blend-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A6CDFB" />
          <stop offset="1" stopColor="#A6CDFB" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`ink-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E3EEFF" />
        </linearGradient>
        <clipPath id={`roof-${id}`}><path d={ROOFLINE} /></clipPath>
        <filter id={`soft-${id}`} x="-10%" y="-20%" width="120%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#1B3F7A" floodOpacity="0.28" />
        </filter>
      </defs>
      <g className="hx-zoom">
        <g className="hx-cam">
          <rect x="-300" y="-500" width="1624" height="520" fill={`url(#sky-${id})`} />
          <image href={PHOTO} x="0" y="0" width="1024" height="618" />
          <rect x="-300" y="-2" width="1624" height="70" fill={`url(#blend-${id})`} />
          <g className="hx-word">
            <g className="hx-rise">
              <text x={x} y={y} textLength={len} lengthAdjust="spacingAndGlyphs" className="hx-wordmark" style={{ fontSize: size }} fill={`url(#ink-${id})`} filter={`url(#soft-${id})`}>SAFAL</text>
            </g>
          </g>
          <image href={PHOTO} x="0" y="0" width="1024" height="618" clipPath={`url(#roof-${id})`} />
        </g>
      </g>
    </>
  );
}
