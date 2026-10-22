import { PageHero2, Resources, Programs } from '@/components/v2/Inner';
import { Statement, Stages, Steps } from '@/components/v2/Home';

export const metadata = { title: 'Academics', description: 'Primary to Higher Secondary at Safal Vidyalaya: English and Gujarati medium, Arts, Commerce and Science streams.' };

export default function AcademicsPage() {
  return (
    <>
      <PageHero2 page="academics" />
      <Statement />
      <Stages />
      <Resources />
      <Steps />
      <Programs />
    </>
  );
}
