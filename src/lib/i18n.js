'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { pageStrings } from './strings';

// Gujarati and Hindi strings should be proof-read by the school before launch.
const dict = {
  en: {
    nav: { about: 'About', academics: 'Academics', admissions: 'Admissions', facilities: 'Facilities', news: 'News', careers: 'Careers', contact: 'Contact' },
    apply: 'Apply 2026–27', applyShort: 'Apply',
    badge: 'Open', session: 'Admissions for Session 2026–27',
    h1a: 'Creation of life', h1b: 'through education.',
    sub: 'English and Gujarati medium schooling from Std 1 to 12, with Arts, Commerce and Science streams in Std 11–12.',
    cta1: 'Start admission enquiry', cta2: 'Book a campus visit',
    campusPick: 'Choose your campus', scroll: 'Scroll',
    iam: 'I am a…', quick: 'Quick start',
    philEyebrow: 'Education for life',
    phil: 'Any education that teaches only job skills neglects what matters most. At Safal, we prepare every child to face life with balance, character and joy — and to keep learning long after school.',
    howEyebrow: 'How we teach', howTitle: 'Six steps from remembering to creating.',
    howBody: "Every lesson at Safal is planned on Bloom's Taxonomy, so students move past memorising toward the higher-level thinking skills they will use for life.",
    acadEyebrow: 'Academics', acadTitle: 'A clear path from Std 1 to the stream that fits.',
    facEyebrow: 'Campus & facilities', facTitle: 'Everything a school day needs.', facHint: 'Keep scrolling',
    galEyebrow: 'Life at Safal', galTitle: 'Moments that make a school a second home.',
    progEyebrow: 'Beyond the classroom', progTitle: 'Programs that open doors early.',
    newsEyebrow: 'News & events', newsTitle: "What's happening at Safal.",
    visitTitle: 'See the school for yourself.',
    visitBody: 'Leave your number and our admissions desk will call to fix a campus visit — or message us on WhatsApp right now.',
    call: 'Call', whatsapp: 'WhatsApp',
  },
  gu: {
    nav: { about: 'અમારા વિશે', academics: 'શિક્ષણ', admissions: 'પ્રવેશ', facilities: 'સુવિધાઓ', news: 'સમાચાર', careers: 'કારકિર્દી', contact: 'સંપર્ક' },
    apply: 'પ્રવેશ 2026–27', applyShort: 'પ્રવેશ',
    badge: 'શરૂ', session: 'શૈક્ષણિક સત્ર 2026–27 માટે પ્રવેશ',
    h1a: 'શિક્ષણ દ્વારા', h1b: 'જીવનનું સર્જન.',
    sub: 'ધોરણ 1 થી 12 સુધી અંગ્રેજી અને ગુજરાતી માધ્યમ, ધોરણ 11–12 માં આર્ટ્સ, કોમર્સ અને સાયન્સ પ્રવાહ.',
    cta1: 'પ્રવેશ પૂછપરછ શરૂ કરો', cta2: 'શાળાની મુલાકાત બુક કરો',
    campusPick: 'તમારું કેમ્પસ પસંદ કરો', scroll: 'સ્ક્રોલ',
    iam: 'હું છું…', quick: 'ઝડપી શરૂઆત',
    philEyebrow: 'જીવન માટે શિક્ષણ',
    phil: 'ફક્ત નોકરીની કુશળતા શીખવતું શિક્ષણ સૌથી મહત્વની બાબત ભૂલી જાય છે. સફળમાં અમે દરેક બાળકને સંતુલન, ચારિત્ર્ય અને આનંદ સાથે જીવનનો સામનો કરવા તૈયાર કરીએ છીએ.',
    howEyebrow: 'અમે કેવી રીતે શીખવીએ છીએ', howTitle: 'યાદ રાખવાથી સર્જન સુધીના છ પગથિયાં.',
    howBody: 'સફળમાં દરેક પાઠ બ્લૂમના વર્ગીકરણ પર આધારિત છે, જેથી વિદ્યાર્થીઓ ગોખણપટ્ટીથી આગળ વધી ઉચ્ચ વિચારશક્તિ કેળવે.',
    acadEyebrow: 'શિક્ષણ', acadTitle: 'ધોરણ 1 થી યોગ્ય પ્રવાહ સુધીનો સ્પષ્ટ માર્ગ.',
    facEyebrow: 'કેમ્પસ અને સુવિધાઓ', facTitle: 'શાળાના દિવસ માટે જરૂરી બધું.', facHint: 'સ્ક્રોલ કરતા રહો',
    galEyebrow: 'સફળમાં જીવન', galTitle: 'શાળાને બીજું ઘર બનાવતી પળો.',
    progEyebrow: 'વર્ગખંડની બહાર', progTitle: 'વહેલા દરવાજા ખોલતા કાર્યક્રમો.',
    newsEyebrow: 'સમાચાર અને કાર્યક્રમો', newsTitle: 'સફળમાં શું ચાલી રહ્યું છે.',
    visitTitle: 'શાળા જાતે જુઓ.',
    visitBody: 'તમારો નંબર આપો, અમારું પ્રવેશ કાર્યાલય મુલાકાત નક્કી કરવા ફોન કરશે — અથવા હમણાં જ વોટ્સએપ કરો.',
    call: 'ફોન', whatsapp: 'વોટ્સએપ',
  },
  hi: {
    nav: { about: 'हमारे बारे में', academics: 'शिक्षा', admissions: 'प्रवेश', facilities: 'सुविधाएँ', news: 'समाचार', careers: 'करियर', contact: 'संपर्क' },
    apply: 'प्रवेश 2026–27', applyShort: 'प्रवेश',
    badge: 'शुरू', session: 'शैक्षणिक सत्र 2026–27 के लिए प्रवेश',
    h1a: 'शिक्षा के माध्यम से', h1b: 'जीवन का निर्माण.',
    sub: 'कक्षा 1 से 12 तक अंग्रेज़ी और गुजराती माध्यम, कक्षा 11–12 में आर्ट्स, कॉमर्स और साइंस स्ट्रीम.',
    cta1: 'प्रवेश पूछताछ शुरू करें', cta2: 'स्कूल विज़िट बुक करें',
    campusPick: 'अपना कैंपस चुनें', scroll: 'स्क्रॉल',
    iam: 'मैं हूँ…', quick: 'त्वरित शुरुआत',
    philEyebrow: 'जीवन के लिए शिक्षा',
    phil: 'जो शिक्षा केवल नौकरी के कौशल सिखाती है, वह सबसे ज़रूरी बात भूल जाती है. सफल में हम हर बच्चे को संतुलन, चरित्र और आनंद के साथ जीवन का सामना करने के लिए तैयार करते हैं.',
    howEyebrow: 'हम कैसे पढ़ाते हैं', howTitle: 'याद करने से सृजन तक के छह कदम.',
    howBody: 'सफल में हर पाठ ब्लूम के वर्गीकरण पर आधारित है, ताकि विद्यार्थी रटने से आगे बढ़कर उच्च स्तरीय सोच विकसित करें.',
    acadEyebrow: 'शिक्षा', acadTitle: 'कक्षा 1 से सही स्ट्रीम तक एक स्पष्ट रास्ता.',
    facEyebrow: 'कैंपस और सुविधाएँ', facTitle: 'स्कूल के दिन के लिए ज़रूरी सब कुछ.', facHint: 'स्क्रॉल करते रहें',
    galEyebrow: 'सफल में जीवन', galTitle: 'वे पल जो स्कूल को दूसरा घर बनाते हैं.',
    progEyebrow: 'कक्षा से आगे', progTitle: 'जल्दी अवसर खोलने वाले कार्यक्रम.',
    newsEyebrow: 'समाचार और कार्यक्रम', newsTitle: 'सफल में क्या चल रहा है.',
    visitTitle: 'स्कूल खुद आकर देखें.',
    visitBody: 'अपना नंबर दें, हमारा प्रवेश कार्यालय विज़िट तय करने के लिए कॉल करेगा — या अभी व्हाट्सऐप करें.',
    call: 'कॉल', whatsapp: 'व्हाट्सऐप',
  },
};

export const languages = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'gu', label: 'ગુ', name: 'ગુજરાતી' },
  { id: 'hi', label: 'हि', name: 'हिन्दी' },
];

const build = (l) => ({ ...dict[l], ...pageStrings[l], content: pageStrings[l].content ?? {} });
const LangContext = createContext({ lang: 'en', t: build('en'), setLang: () => {}, branch: 0, setBranch: () => {} });

/** Holds the chosen language and campus (branch); both are remembered in localStorage. */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [branch, setBranch] = useState(0);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sv_lang');
      if (dict[saved]) setLang(saved);
      const b = localStorage.getItem('sv_branch');
      if (b === '0' || b === '1') setBranch(Number(b));
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('sv_lang', lang); } catch {}
  }, [lang]);
  useEffect(() => {
    try { localStorage.setItem('sv_branch', String(branch)); } catch {}
  }, [branch]);
  const t = useMemo(() => build(lang), [lang]);
  return <LangContext.Provider value={{ lang, t, setLang, branch, setBranch }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Picks the Gujarati/Hindi field of a content item when available. */
export const pick = (lang, item, field = 'name') => (lang !== 'en' && item[lang] ? item[lang] : item[field]);
