import PageHero from '@/components/PageHero';
import AdmissionWizard from '@/components/AdmissionWizard';

export const metadata = { title: 'Admissions 2026–27', description: 'Apply online to Safal Vidyalaya — English and Gujarati medium, Std 1 to 12. Takes about 5 minutes.' };

export default function AdmissionsPage() {
  return (
    <>
      <PageHero page="admissions" />
      <section className="bg-mist"><div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}><AdmissionWizard /></div></section>
    </>
  );
}
