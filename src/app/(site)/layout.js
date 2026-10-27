import '../v3.css';
import Header from '@/components/v3/Header';
import Footer from '@/components/v3/Footer';
import PageTransition from '@/components/v3/PageTransition';
import Loader from '@/components/v3/Loader';

export default function SiteLayout({ children }) {
  return (
    <div className="v3">
      {/* Without JavaScript the loader would never lift, so hide it. */}
      <noscript><style>{'.v3 .ldr { display: none !important; }'}</style></noscript>
      <Loader />
      <a href="#main" className="sr-only">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <PageTransition />
    </div>
  );
}
