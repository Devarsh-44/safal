import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import { PageHero2 } from '@/components/v2/Inner';

export const metadata = { title: 'Contact', description: 'Call, WhatsApp or visit Safal Vidyalaya in Sector 22, Gandhinagar and in Ahmedabad.' };

export default function ContactPage() {
  return (
    <>
      <PageHero2 page="contact" />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap split2">
          <div data-reveal><ContactInfo /></div>
          <div data-reveal><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
