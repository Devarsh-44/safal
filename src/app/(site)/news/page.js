import PageHero from '@/components/PageHero';
import NewsGrid from '@/components/NewsGrid';

export const metadata = { title: 'News & events', description: 'Latest news, circulars, events and videos from Safal Vidyalaya.' };

export default function NewsPage() {
  return (
    <>
      <PageHero page="news" />
      <section className="section"><div className="container"><NewsGrid heading={<span />} /></div></section>
    </>
  );
}
