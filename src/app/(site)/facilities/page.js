import { PageHero2 } from '@/components/v2/Inner';
import { Reel, Gallery, Visit } from '@/components/v2/Home';

export const metadata = { title: 'Facilities', description: 'Library, labs, digital classrooms, hostel, transport, health check-ups and more at Safal Vidyalaya.' };

export default function FacilitiesPage() {
  return (
    <>
      <PageHero2 page="facilities" />
      <Reel />
      <Gallery />
      <Visit />
    </>
  );
}
