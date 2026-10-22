import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { Scope, Where } from '@/components/home/Porthole';

export const metadata = { title: 'Contact', description: 'Call, WhatsApp or visit Safal Vidyalaya in Sector 22, Gandhinagar and in Ahmedabad.' };

export default function ContactPage() {
  return (
    <>
      <PageHero page="contact" />
      <Scope>
        <div className="ph-spacer" />
        <Where />
        <ContactForm />
      </Scope>
    </>
  );
}
