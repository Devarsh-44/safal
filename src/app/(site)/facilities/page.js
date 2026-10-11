import PageHero from '@/components/PageHero';
import { FacilitiesGrid } from '@/components/home/Sections';
import CallbackForm from '@/components/CallbackForm';

export const metadata = { title: 'Facilities', description: 'Library, labs, digital classrooms, hostel, transport, health check-ups and more at Safal Vidyalaya.' };

export default function FacilitiesPage() {
  return (
    <>
      <PageHero page="facilities" />
      <section className="section">
        <div className="container"><FacilitiesGrid detailed /></div>
      </section>
      <CallbackForm />
    </>
  );
}
