import Hero from '@/components/home/Hero';
import { PersonaPicker, Stats, BloomSection, StagesSection, ProgramsSection } from '@/components/home/Sections';
import { Marquee, Philosophy, FacilitiesScroll, Gallery } from '@/components/home/Showcase';
import HomeNews from '@/components/home/HomeNews';
import CallbackForm from '@/components/CallbackForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Philosophy />
      <PersonaPicker />
      <StagesSection />
      <FacilitiesScroll />
      <BloomSection />
      <Gallery />
      <ProgramsSection />
      <HomeNews />
      <CallbackForm />
    </>
  );
}
