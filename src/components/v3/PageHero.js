'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { Ink } from './Marks';

/**
 * Top of every inner page: a shorter framed photo with a glass title card. `color` is the page's own
 * colour field (Admissions sky, Academics leaf…), shown on the page tab and the underline.
 */
export default function PageHero({ photo, pos = '50% 50%', color = 'var(--sky)', note, crumb, eyebrow, a, mark, b, intro, children }) {
  const { t } = useLang();
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), 450);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="hero-frame" id="top">
      <section className="hero hero-page" style={{ '--page': color }}>
        <div className="slide on"><img src={photo} alt="" fetchPriority="high" style={{ objectPosition: pos }} /></div>
        <span className="page-tab gl-dark">{note}</span>
        <div className="title-card gl">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">{t.v3.home}</Link><span aria-hidden="true">/</span><span aria-current="page">{crumb}</span></nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{a} <span className="mk mk-squiggle">{mark}<Ink kind="squiggle" color={color} width={6} play={drawn} /></span>{b ? ' ' + b : ''}</h1>
          {intro && <p className="intro">{intro}</p>}
          {children && <div className="actions">{children}</div>}
        </div>
      </section>
    </div>
  );
}
