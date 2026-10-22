import NewsGrid from '@/components/NewsGrid';
import { PageHero2 } from '@/components/v2/Inner';

export const metadata = { title: 'News & events', description: 'Latest news, circulars, events and videos from Safal Vidyalaya.' };

export default function NewsPage() {
  return (
    <>
      <PageHero2 page="news" />
      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap" data-reveal><NewsGrid heading={<span />} /></div></section>
    </>
  );
}
