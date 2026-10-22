/**
 * Home page copy (the "porthole" redesign) in English, Gujarati and Hindi. Merged into `t.home`.
 * Gujarati and Hindi should be proof-read by the school before launch.
 *
 * The intro statement is a list of text runs and picture slots: `{ img: n }` places the n-th
 * inline photograph from Home.js between the words.
 */

export const homeStrings = {
  en: {
    nav: { academics: 'Academics', admissions: 'Admissions', facilities: 'Facilities', news: 'News', contact: 'Contact' },
    hero: {
      h1: ['Admissions open', 'for 2026–27'],
      sub: 'English and Gujarati medium, Std 1 to 12, with Arts, Commerce and Science in Std 11 and 12.',
      cta: 'Start admission enquiry', call: 'Call', whatsapp: 'WhatsApp', visit: 'Book a visit',
      porthole: 'Life at Safal Vidyalaya, seen through the oval windows of the Sector 22 building',
    },
    intro: ['Safal means successful: children who', { img: 0 }, 'think for themselves,', { img: 1 }, 'speak two languages and', { img: 2 }, 'are ready for life.'],
    finder: {
      label: "Child's date of birth",
      joins: (n) => `Joins Std ${n} in June 2026`,
      young: 'Needs to be 6 by 1 June 2026 to join Std 1',
      old: 'Past Std 12, our last standard',
      note: "Worked out from Gujarat's rule of 6 years by 1 June for Std 1. Our admissions desk confirms it.",
      applyStd: (n) => `Apply for Std ${n}`,
      apply: (r) => `Apply for ${r}`,
      syllabus: 'Syllabus and planner',
      stages: 'School stages',
    },
    facilities: { title: 'Nine things on campus' },
    bloom: { title: 'How a lesson climbs' },
    gallery: {
      title: 'Life at Safal',
      caps: {
        yoga: 'Yoga day on the school ground', std: 'Standards', gu: 'Gujarati medium', en: 'English medium', neet: 'Safal Career Foundation',
        ground: 'Morning on the ground', jee: 'Safal Career Foundation', yle: 'Cambridge English', bee: 'Spell Bee International',
        bus: 'Bus routes across the city', streams: 'Arts, Commerce, Science', campus: 'The Sector 22 building',
      },
      words: { std: '1–12', gu: 'ગુજ', en: 'Eng', bus: 'Bus', streams: '3' },
    },
    stats: {
      title: 'Twelve years, one school',
      items: [['12', 'standards, from Std 1 to Std 12'], ['3', 'streams in Std 11 and 12'], ['2', 'campuses, Gandhinagar and Ahmedabad']],
    },
    where: {
      title: 'Sector 22, Gandhinagar',
      body: 'Gandhinagar was planned as thirty sectors among green roads. We are near the Post Office in Sector 22.',
      map: 'Open in Google Maps',
      plan: 'The town concept for Gandhinagar: residential sectors, work centres and green ways between them.',
      trees: 'Trees in a Sector 28 garden, Gandhinagar.',
    },
    visit: {
      title: 'Book a campus visit',
      body: 'Leave your number. Our admissions desk calls to fix a time to show you the school.',
    },
    footer: {
      school: 'School', admissions: 'Admissions', updates: 'Updates', about: 'About', apply: 'Apply online', brochure: 'Get the brochure',
      top: 'Back to top', credits: 'Photographs of Gandhinagar',
    },
  },

  gu: {
    nav: { academics: 'શિક્ષણ', admissions: 'પ્રવેશ', facilities: 'સુવિધાઓ', news: 'સમાચાર', contact: 'સંપર્ક' },
    hero: {
      h1: ['પ્રવેશ શરૂ', 'સત્ર 2026–27'],
      sub: 'અંગ્રેજી અને ગુજરાતી માધ્યમ, ધોરણ 1 થી 12, ધોરણ 11 અને 12 માં આર્ટ્સ, કોમર્સ અને સાયન્સ.',
      cta: 'પ્રવેશ પૂછપરછ શરૂ કરો', call: 'ફોન', whatsapp: 'વોટ્સએપ', visit: 'મુલાકાત બુક કરો',
      porthole: 'સેક્ટર 22 ની ઇમારતની અંડાકાર બારીમાંથી દેખાતું સફળ વિદ્યાલયનું જીવન',
    },
    intro: ['સફળ એટલે સફળતા: એવાં બાળકો જે', { img: 0 }, 'જાતે વિચારે,', { img: 1 }, 'બે ભાષા બોલે અને', { img: 2 }, 'જીવન માટે તૈયાર હોય.'],
    finder: {
      label: 'બાળકની જન્મ તારીખ',
      joins: (n) => `જૂન 2026 માં ધોરણ ${n} માં`,
      young: 'ધોરણ 1 માટે 1 જૂન 2026 સુધીમાં 6 વર્ષ જરૂરી',
      old: 'ધોરણ 12 પછી, અમારું છેલ્લું ધોરણ',
      note: 'ધોરણ 1 માટે 1 જૂન સુધીમાં 6 વર્ષના ગુજરાતના નિયમ પરથી ગણેલું. અમારું પ્રવેશ કાર્યાલય ખાતરી કરશે.',
      applyStd: (n) => `ધોરણ ${n} માટે અરજી કરો`,
      apply: (r) => `${r} માટે અરજી કરો`,
      syllabus: 'અભ્યાસક્રમ અને આયોજન',
      stages: 'શાળાના તબક્કા',
    },
    facilities: { title: 'કેમ્પસ પર નવ સુવિધાઓ' },
    bloom: { title: 'પાઠ કેવી રીતે આગળ વધે છે' },
    gallery: {
      title: 'સફળમાં જીવન',
      caps: {
        yoga: 'શાળાના મેદાનમાં યોગ દિવસ', std: 'ધોરણ', gu: 'ગુજરાતી માધ્યમ', en: 'અંગ્રેજી માધ્યમ', neet: 'સફળ કરિયર ફાઉન્ડેશન',
        ground: 'મેદાન પર સવાર', jee: 'સફળ કરિયર ફાઉન્ડેશન', yle: 'કેમ્બ્રિજ ઇંગ્લિશ', bee: 'સ્પેલ બી ઇન્ટરનેશનલ',
        bus: 'શહેરભરમાં બસ રૂટ', streams: 'આર્ટ્સ, કોમર્સ, સાયન્સ', campus: 'સેક્ટર 22 ની ઇમારત',
      },
      words: { std: '1–12', gu: 'ગુજ', en: 'Eng', bus: 'બસ', streams: '3' },
    },
    stats: {
      title: 'બાર વર્ષ, એક શાળા',
      items: [['12', 'ધોરણ, ધોરણ 1 થી ધોરણ 12'], ['3', 'ધોરણ 11 અને 12 માં પ્રવાહ'], ['2', 'કેમ્પસ, ગાંધીનગર અને અમદાવાદ']],
    },
    where: {
      title: 'સેક્ટર 22, ગાંધીનગર',
      body: 'ગાંધીનગર લીલા રસ્તાઓ વચ્ચે ત્રીસ સેક્ટરમાં આયોજિત છે. અમે સેક્ટર 22 માં પોસ્ટ ઓફિસ પાસે છીએ.',
      map: 'Google Maps માં ખોલો',
      plan: 'ગાંધીનગરની નગર કલ્પના: રહેણાંક સેક્ટર, કાર્ય કેન્દ્રો અને વચ્ચે લીલા માર્ગો.',
      trees: 'સેક્ટર 28 ના બગીચામાં વૃક્ષો, ગાંધીનગર.',
    },
    visit: {
      title: 'કેમ્પસ મુલાકાત બુક કરો',
      body: 'તમારો નંબર આપો. અમારું પ્રવેશ કાર્યાલય શાળા બતાવવાનો સમય નક્કી કરવા ફોન કરશે.',
    },
    footer: {
      school: 'શાળા', admissions: 'પ્રવેશ', updates: 'અપડેટ', about: 'અમારા વિશે', apply: 'ઓનલાઇન અરજી', brochure: 'બ્રોશર મેળવો',
      top: 'ઉપર જાઓ', credits: 'ગાંધીનગરના ફોટોગ્રાફ',
    },
  },

  hi: {
    nav: { academics: 'शिक्षा', admissions: 'प्रवेश', facilities: 'सुविधाएँ', news: 'समाचार', contact: 'संपर्क' },
    hero: {
      h1: ['प्रवेश शुरू', 'सत्र 2026–27'],
      sub: 'अंग्रेज़ी और गुजराती माध्यम, कक्षा 1 से 12, कक्षा 11 और 12 में आर्ट्स, कॉमर्स और साइंस.',
      cta: 'प्रवेश पूछताछ शुरू करें', call: 'कॉल', whatsapp: 'व्हाट्सऐप', visit: 'विज़िट बुक करें',
      porthole: 'सेक्टर 22 की इमारत की अंडाकार खिड़की से दिखता सफल विद्यालय का जीवन',
    },
    intro: ['सफल का मतलब कामयाब: ऐसे बच्चे जो', { img: 0 }, 'खुद सोचें,', { img: 1 }, 'दो भाषाएँ बोलें और', { img: 2 }, 'जीवन के लिए तैयार हों.'],
    finder: {
      label: 'बच्चे की जन्म तिथि',
      joins: (n) => `जून 2026 में कक्षा ${n} में`,
      young: 'कक्षा 1 के लिए 1 जून 2026 तक 6 वर्ष ज़रूरी',
      old: 'कक्षा 12 के बाद, हमारी अंतिम कक्षा',
      note: 'कक्षा 1 के लिए 1 जून तक 6 वर्ष के गुजरात के नियम से निकाला गया. हमारा प्रवेश कार्यालय पुष्टि करेगा.',
      applyStd: (n) => `कक्षा ${n} के लिए आवेदन करें`,
      apply: (r) => `${r} के लिए आवेदन करें`,
      syllabus: 'पाठ्यक्रम और योजना',
      stages: 'स्कूल के चरण',
    },
    facilities: { title: 'कैंपस में नौ सुविधाएँ' },
    bloom: { title: 'पाठ कैसे आगे बढ़ता है' },
    gallery: {
      title: 'सफल में जीवन',
      caps: {
        yoga: 'स्कूल मैदान में योग दिवस', std: 'कक्षाएँ', gu: 'गुजराती माध्यम', en: 'अंग्रेज़ी माध्यम', neet: 'सफल करियर फ़ाउंडेशन',
        ground: 'मैदान पर सुबह', jee: 'सफल करियर फ़ाउंडेशन', yle: 'कैम्ब्रिज इंग्लिश', bee: 'स्पेल बी इंटरनेशनल',
        bus: 'पूरे शहर में बस रूट', streams: 'आर्ट्स, कॉमर्स, साइंस', campus: 'सेक्टर 22 की इमारत',
      },
      words: { std: '1–12', gu: 'ગુજ', en: 'Eng', bus: 'बस', streams: '3' },
    },
    stats: {
      title: 'बारह साल, एक स्कूल',
      items: [['12', 'कक्षाएँ, कक्षा 1 से कक्षा 12'], ['3', 'कक्षा 11 और 12 में स्ट्रीम'], ['2', 'कैंपस, गांधीनगर और अहमदाबाद']],
    },
    where: {
      title: 'सेक्टर 22, गांधीनगर',
      body: 'गांधीनगर हरी सड़कों के बीच तीस सेक्टरों में बसाया गया है. हम सेक्टर 22 में पोस्ट ऑफ़िस के पास हैं.',
      map: 'Google Maps में खोलें',
      plan: 'गांधीनगर की नगर अवधारणा: आवासीय सेक्टर, कार्य केंद्र और बीच में हरे रास्ते.',
      trees: 'सेक्टर 28 के बगीचे में पेड़, गांधीनगर.',
    },
    visit: {
      title: 'कैंपस विज़िट बुक करें',
      body: 'अपना नंबर दें. हमारा प्रवेश कार्यालय स्कूल दिखाने का समय तय करने के लिए कॉल करेगा.',
    },
    footer: {
      school: 'स्कूल', admissions: 'प्रवेश', updates: 'अपडेट', about: 'हमारे बारे में', apply: 'ऑनलाइन आवेदन', brochure: 'ब्रोशर पाएँ',
      top: 'ऊपर जाएँ', credits: 'गांधीनगर की तस्वीरें',
    },
  },
};
