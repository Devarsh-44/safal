import PageHero from '@/components/PageHero';
import { BloomSection, StagesSection, ProgramsSection } from '@/components/home/Sections';
import AcademicResources from '@/components/AcademicResources';

export const metadata = { title: 'Academics', description: 'Primary to Higher Secondary at Safal Vidyalaya — English & Gujarati medium, Arts, Commerce and Science streams.' };

export default function AcademicsPage() {
  return (
    <>
      <PageHero page="academics" />
      <StagesSection showLink={false} />
      <AcademicResources />
      <BloomSection />
      <ProgramsSection />
    </>
  );
}
