import AdmissionWizard from '@/components/AdmissionWizard';
import { PageHero2 } from '@/components/v2/Inner';

export const metadata = { title: 'Admissions 2026–27', description: 'Apply online to Safal Vidyalaya: English and Gujarati medium, Std 1 to 12. Takes about five minutes.' };

export default function AdmissionsPage() {
  return (
    <>
      <PageHero2 page="admissions" />
      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap" data-reveal><AdmissionWizard /></div></section>
    </>
  );
}
