import './globals.css';
import './porthole.css';
import { LanguageProvider } from '@/lib/i18n';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: { default: 'Safal Vidyalaya, English and Gujarati medium school in Sector 22, Gandhinagar', template: '%s · Safal Vidyalaya' },
  description: 'Safal Vidyalaya, Gandhinagar and Ahmedabad. English and Gujarati medium, Std 1 to 12 with Arts, Commerce and Science streams. Admissions open for 2026–27.',
  metadataBase: new URL('https://www.safalvidhyalaya.com'),
  openGraph: { title: 'Safal Vidyalaya', description: 'Creation of Life Through Education. Admissions open for 2026–27.', images: ['/images/live/safalvidhyalaya.webp'] },
  icons: { icon: '/images/logo.png' },
};

export const viewport = { themeColor: '#0E1630' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets reveal animations hide content only when script is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" />
        {/* Gujarati and Devanagari glyphs only: General Sans has no Indic scripts. Their Latin subsets are never downloaded. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Vadodara:wght@400;500;600;700&family=Mukta:wght@400;500;600;700&display=swap" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider><SmoothScroll />{children}</LanguageProvider>
      </body>
    </html>
  );
}
