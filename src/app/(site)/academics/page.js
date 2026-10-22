import PageHero from '@/components/PageHero';
import AcademicResources from '@/components/AcademicResources';
import { Scope, Intro, Stages, Bloom, Programs } from '@/components/home/Porthole';

export const metadata = { title: 'Academics', description: 'Primary to Higher Secondary at Safal Vidyalaya: English and Gujarati medium, Arts, Commerce and Science streams.' };

export default function AcademicsPage() {
  return (
    <>
      <PageHero page="academics" />
      <Scope>
        <Intro />
        <Stages />
        <AcademicResources />
        <Bloom />
        <Programs />
      </Scope>
    </>
  );
}
