import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export const metadata = { title: 'Contact', description: 'Call, WhatsApp or visit Safal Vidyalaya — Sector 22, Gandhinagar and Ahmedabad.' };

export default function ContactPage() {
  return (
    <>
      <PageHero page="contact" />
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40, alignItems: 'start' }}>
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
