import './globals.css';
import './redesign.css';
import { LanguageProvider } from '@/lib/i18n';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: { default: 'Safal Vidyalaya — English & Gujarati Medium School, Gandhinagar', template: '%s · Safal Vidyalaya' },
  description: 'Safal Vidyalaya, Gandhinagar and Ahmedabad — English and Gujarati medium, Std 1 to 12 with Arts, Commerce and Science streams. Admissions open for 2026–27.',
  metadataBase: new URL('https://www.safalvidhyalaya.com'),
  openGraph: { title: 'Safal Vidyalaya', description: 'Creation of Life Through Education. Admissions open for 2026–27.', images: ['/images/campus.jpg'] },
  icons: { icon: '/images/logo.png' },
};

export const viewport = { themeColor: '#141A3C' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Hind+Vadodara:wght@400;500;600;700&family=JetBrains+Mono:wght@500&family=Mukta:wght@400;600;700&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider><SmoothScroll />{children}</LanguageProvider>
      </body>
    </html>
  );
}
