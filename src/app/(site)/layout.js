import Header from '@/components/v2/Header';
import Footer from '@/components/v2/Footer';
import MotionSystem from '@/components/v2/MotionSystem';
import Preloader from '@/components/v2/Preloader';
import Cursor from '@/components/v2/Cursor';

export default function SiteLayout({ children }) {
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <Preloader />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MotionSystem />
      <Cursor />
    </>
  );
}
