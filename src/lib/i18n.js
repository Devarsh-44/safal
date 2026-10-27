'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { pageStrings } from './strings';
import { v3Strings } from './v3Strings';

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
    badge: 'ચાલુ', session: 'શૈક્ષણિક વર્ષ 2026–27 માટે પ્રવેશ ચાલુ',
    h1a: 'શિક્ષણ થકી', h1b: 'જીવનનું ઘડતર.',
    sub: 'ધોરણ 1 થી 12, અંગ્રેજી અને ગુજરાતી માધ્યમ. ધોરણ 11–12 માં આર્ટ્સ, કોમર્સ અને સાયન્સ પ્રવાહ.',
    cta1: 'પ્રવેશ માટે પૂછપરછ કરો', cta2: 'શાળાની મુલાકાત ગોઠવો',
    campusPick: 'કેમ્પસ પસંદ કરો', scroll: 'સ્ક્રોલ',
    iam: 'હું છું…', quick: 'ઝડપી શરૂઆત',
    philEyebrow: 'જીવન માટે શિક્ષણ',
    phil: 'માત્ર નોકરી માટેની આવડત શીખવતું શિક્ષણ જીવનની સૌથી જરૂરી વાત ચૂકી જાય છે. સફળમાં અમે દરેક બાળકને સંતુલન, સંસ્કાર અને આનંદ સાથે જીવનનો સામનો કરવા તૈયાર કરીએ છીએ.',
    howEyebrow: 'અમે કેવી રીતે ભણાવીએ છીએ', howTitle: 'યાદ રાખવાથી નવું સર્જવા સુધીનાં છ પગથિયાં.',
    howBody: 'સફળમાં દરેક પાઠ બ્લૂમના વર્ગીકરણ (Bloom’s Taxonomy) મુજબ ઘડાય છે, જેથી બાળકો ગોખણપટ્ટીથી આગળ વધીને ઊંડું વિચારતાં શીખે.',
    acadEyebrow: 'શિક્ષણ', acadTitle: 'ધોરણ 1 થી મનગમતા પ્રવાહ સુધીનો સ્પષ્ટ રસ્તો.',
    facEyebrow: 'કેમ્પસ અને સુવિધાઓ', facTitle: 'શાળાના દિવસ માટે જોઈએ તે બધું.', facHint: 'સ્ક્રોલ કરતા રહો',
    galEyebrow: 'સફળમાં જીવન', galTitle: 'શાળાને બીજું ઘર બનાવતી પળો.',
    progEyebrow: 'વર્ગખંડની બહાર', progTitle: 'વહેલી તકે નવા દ્વાર ખોલતા કાર્યક્રમો.',
    newsEyebrow: 'સમાચાર અને કાર્યક્રમો', newsTitle: 'સફળમાં શું નવું છે.',
    visitTitle: 'શાળા રૂબરૂ આવીને જુઓ.',
    visitBody: 'તમારો નંબર આપો, અમારું પ્રવેશ કાર્યાલય મુલાકાતનો સમય નક્કી કરવા ફોન કરશે. અથવા અત્યારે જ વોટ્સએપ કરો.',
    call: 'ફોન', whatsapp: 'વોટ્સએપ',
  },
  hi: {
    nav: { about: 'हमारे बारे में', academics: 'शिक्षा', admissions: 'प्रवेश', facilities: 'सुविधाएँ', news: 'समाचार', careers: 'करियर', contact: 'संपर्क' },
    apply: 'प्रवेश 2026–27', applyShort: 'प्रवेश',
    badge: 'जारी', session: 'शैक्षणिक वर्ष 2026–27 के लिए प्रवेश जारी',
    h1a: 'शिक्षा से', h1b: 'जीवन का निर्माण।',
    sub: 'कक्षा 1 से 12 तक, अंग्रेज़ी और गुजराती माध्यम। कक्षा 11–12 में कला, वाणिज्य और विज्ञान संकाय।',
    cta1: 'प्रवेश के लिए पूछताछ करें', cta2: 'स्कूल देखने का समय तय करें',
    campusPick: 'कैंपस चुनें', scroll: 'स्क्रॉल',
    iam: 'मैं हूँ…', quick: 'त्वरित शुरुआत',
    philEyebrow: 'जीवन के लिए शिक्षा',
    phil: 'जो शिक्षा सिर्फ़ नौकरी का हुनर सिखाती है, वह जीवन की सबसे ज़रूरी बात छोड़ देती है। सफल में हम हर बच्चे को संतुलन, संस्कार और आनंद के साथ जीवन का सामना करने के लिए तैयार करते हैं।',
    howEyebrow: 'हम कैसे पढ़ाते हैं', howTitle: 'याद करने से रचने तक के छह पड़ाव।',
    howBody: 'सफल में हर पाठ ब्लूम्स टैक्सोनॉमी के आधार पर बनाया जाता है, ताकि बच्चे रटने से आगे बढ़कर गहराई से सोचना सीखें।',
    acadEyebrow: 'शिक्षा', acadTitle: 'कक्षा 1 से मनपसंद संकाय तक एक साफ़ रास्ता।',
    facEyebrow: 'कैंपस और सुविधाएँ', facTitle: 'स्कूल के दिन के लिए ज़रूरी हर चीज़।', facHint: 'स्क्रॉल करते रहें',
    galEyebrow: 'सफल में जीवन', galTitle: 'वे पल जो स्कूल को दूसरा घर बनाते हैं।',
    progEyebrow: 'कक्षा से आगे', progTitle: 'जल्दी नए रास्ते खोलने वाले कार्यक्रम।',
    newsEyebrow: 'समाचार और कार्यक्रम', newsTitle: 'सफल में क्या नया है।',
    visitTitle: 'स्कूल खुद आकर देखिए।',
    visitBody: 'अपना नंबर दें, हमारा प्रवेश कार्यालय मुलाक़ात का समय तय करने के लिए फ़ोन करेगा। या अभी व्हाट्सऐप करें।',
    call: 'फ़ोन', whatsapp: 'व्हाट्सऐप',
  },
};

export const languages = [
  { id: 'en', label: 'EN', name: 'English' },
  { id: 'gu', label: 'ગુ', name: 'ગુજરાતી' },
  { id: 'hi', label: 'हि', name: 'हिन्दी' },
];

const build = (l) => ({ ...dict[l], ...pageStrings[l], content: pageStrings[l].content ?? {}, v3: v3Strings[l] });
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
