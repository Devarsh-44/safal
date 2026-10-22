import PageHero from '@/components/PageHero';
import CareerForm from '@/components/CareerForm';
import Openings from '@/components/Openings';

export const metadata = { title: 'Careers', description: 'Teaching and staff openings at Safal Vidyalaya, Gandhinagar and Ahmedabad.' };

export default function CareersPage() {
  return (
    <>
      <PageHero page="careers" />
      <section className="section bg-mist">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          <Openings />
          <div id="apply" style={{ scrollMarginTop: 120 }}><CareerForm /></div>
        </div>
      </section>
    </>
  );
}
