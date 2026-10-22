import PageHero from '@/components/PageHero';
import NewsGrid from '@/components/NewsGrid';
import { Scope } from '@/components/home/Porthole';

export const metadata = { title: 'News & events', description: 'Latest news, circulars, events and videos from Safal Vidyalaya.' };

export default function NewsPage() {
  return (
    <>
      <PageHero page="news" />
      <Scope><section className="ph-flow"><div className="ph-wrap"><NewsGrid heading={<span />} /></div></section></Scope>
    </>
  );
}
