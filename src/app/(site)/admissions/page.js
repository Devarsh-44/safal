import PageHero from '@/components/PageHero';
import AdmissionWizard from '@/components/AdmissionWizard';
import { Scope } from '@/components/home/Porthole';

export const metadata = { title: 'Admissions 2026–27', description: 'Apply online to Safal Vidyalaya: English and Gujarati medium, Std 1 to 12. Takes about five minutes.' };

export default function AdmissionsPage() {
  return (
    <>
      <PageHero page="admissions" />
      <Scope><section className="ph-flow"><div className="ph-wrap"><AdmissionWizard /></div></section></Scope>
    </>
  );
}
