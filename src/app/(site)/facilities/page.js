import PageHero from '@/components/PageHero';
import { Scope, Facilities, Gallery, Visit } from '@/components/home/Porthole';

export const metadata = { title: 'Facilities', description: 'Library, labs, digital classrooms, hostel, transport, health check-ups and more at Safal Vidyalaya.' };

export default function FacilitiesPage() {
  return (
    <>
      <PageHero page="facilities" />
      <Scope>
        <Facilities />
        <Gallery />
        <div className="ph-spacer" />
        <Visit />
      </Scope>
    </>
  );
}
