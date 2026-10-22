import PageHero from '@/components/PageHero';
import CareerForm from '@/components/CareerForm';
import Openings from '@/components/Openings';
import { Scope } from '@/components/home/Porthole';

export const metadata = { title: 'Careers', description: 'Teaching and staff openings at Safal Vidyalaya, Gandhinagar and Ahmedabad.' };

export default function CareersPage() {
  return (
    <>
      <PageHero page="careers" />
      <Scope>
        <section className="ph-flow">
          <div className="ph-wrap ph-flow-grid">
            <Openings />
            <div id="apply" style={{ scrollMarginTop: 120 }}><CareerForm /></div>
          </div>
        </section>
      </Scope>
    </>
  );
}
