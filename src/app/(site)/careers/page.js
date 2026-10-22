import CareerForm from '@/components/CareerForm';
import { PageHero2, Openings2 } from '@/components/v2/Inner';

export const metadata = { title: 'Careers', description: 'Teaching and staff openings at Safal Vidyalaya, Gandhinagar and Ahmedabad.' };

export default function CareersPage() {
  return (
    <>
      <PageHero2 page="careers" />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split2">
          <Openings2 />
          <div id="apply" style={{ scrollMarginTop: 120 }} data-reveal><CareerForm /></div>
        </div>
      </section>
    </>
  );
}
