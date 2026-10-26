import '../v3.css';
import Header from '@/components/v3/Header';
import Footer from '@/components/v3/Footer';
import PageTransition from '@/components/v3/PageTransition';

export default function SiteLayout({ children }) {
  return (
    <div className="v3">
      <a href="#main" className="sr-only">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <PageTransition />
    </div>
  );
}
