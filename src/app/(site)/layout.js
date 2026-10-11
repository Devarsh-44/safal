import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteLayout({ children }) {
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
