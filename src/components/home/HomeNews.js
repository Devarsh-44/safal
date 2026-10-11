'use client';
import Link from 'next/link';
import NewsGrid from '../NewsGrid';
import { Reveal } from '../Motion';
import { useLang } from '@/lib/i18n';

export default function HomeNews() {
  const { t } = useLang();
  return (
    <section className="section" id="news">
      <div className="container">
        <NewsGrid
          limit={4}
          heading={
            <div>
              <Reveal as="p" className="eyebrow">{t.newsEyebrow}</Reveal>
              <Reveal as="h2" className="display h2" delay={0.05}>{t.newsTitle}</Reveal>
              <Link href="/news" style={{ display: 'inline-block', marginTop: 12, fontWeight: 600 }}>{t.common.allNews} →</Link>
            </div>
          }
        />
      </div>
    </section>
  );
}
