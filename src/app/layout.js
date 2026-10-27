import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

export const metadata = {
  title: { default: 'Safal Vidyalaya · Creation of life through education', template: '%s · Safal Vidyalaya' },
  description: 'Safal Vidyalaya, Gandhinagar and Ahmedabad. English and Gujarati medium, Std 1 to 12 with Arts, Commerce and Science streams. Admissions open for 2026–27.',
  metadataBase: new URL('https://www.safalvidhyalaya.com'),
  openGraph: { title: 'Safal Vidyalaya', description: 'Creation of Life Through Education. Admissions open for 2026–27.', images: ['/images/live/safalvidhyalaya.webp'] },
  icons: { icon: '/images/logo.png' },
};

export const viewport = { themeColor: '#FBFBFE', viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme before first paint: the visitor's saved choice, light by default. */}
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('sv_theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Figtree:wght@400;500;600;700&family=Caveat:wght@600;700&family=Baloo+Bhai+2:wght@500;600;700&family=Baloo+2:wght@500;600;700&family=Hind+Vadodara:wght@400;500;600;700&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
