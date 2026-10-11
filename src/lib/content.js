/**
 * School content. Text in [BRACKETS] is a placeholder the school still needs to supply.
 * Items with `gu` / `hi` fields show Gujarati / Hindi when that language is chosen.
 */

export const school = {
  name: 'Safal Vidyalaya',
  tagline: 'Creation of Life Through Education',
  affiliation: 'Gujarat Pradesh Vidyabharti',
  phone: process.env.NEXT_PUBLIC_SCHOOL_PHONE || '+919316393763',
  phoneDisplay: '+91 93163 93763',
  whatsapp: process.env.NEXT_PUBLIC_SCHOOL_WHATSAPP || '919316393763',
  email: 'info@safalvidhyalaya.com',
  session: '2026–27',
  campuses: [
    { id: 'gandhinagar', name: 'Gandhinagar', gu: 'ગાંધીનગર', hi: 'गांधीनगर', area: 'Sector 22', address: 'Near Post Office, Sector 22, Gandhinagar – 382022', phone: '+91 93163 93763' },
    { id: 'ahmedabad', name: 'Ahmedabad', gu: 'અમદાવાદ', hi: 'अहमदाबाद', area: '[AREA]', address: '[AHMEDABAD ADDRESS]', phone: '[AHMEDABAD PHONE]' },
  ],
};

export const stats = [
  { value: 12, label: 'Standards, Std 1 to 12', gu: 'ધોરણ, 1 થી 12', hi: 'कक्षाएँ, 1 से 12' },
  { value: 2, label: 'Mediums — English & Gujarati', gu: 'માધ્યમ — અંગ્રેજી અને ગુજરાતી', hi: 'माध्यम — अंग्रेज़ी और गुजराती' },
  { value: 3, label: 'Higher-secondary streams', gu: 'ઉચ્ચતર માધ્યમિક પ્રવાહ', hi: 'उच्च माध्यमिक स्ट्रीम' },
  { value: 9, label: 'Campus facilities', gu: 'કેમ્પસ સુવિધાઓ', hi: 'कैंपस सुविधाएँ' },
];

export const bloom = [
  { name: 'Remembering', color: '#6A3596', desc: 'Recall facts and basic concepts — the foundation every later step builds on.' },
  { name: 'Understanding', color: '#B0174F', desc: 'Explain ideas in their own words, not just repeat them.' },
  { name: 'Application', color: '#C23A2C', desc: 'Use what they have learned in new and practical situations.' },
  { name: 'Analysis', color: '#B4570E', desc: 'Break information into parts and see how those parts connect.' },
  { name: 'Evaluation', color: '#3F7420', desc: 'Weigh evidence, judge ideas and defend a point of view.' },
  { name: 'Creating', color: '#4A2FB0', desc: 'Put ideas together to produce something new and original.' },
];

// NOTE: std ranges assume the usual Gujarat split — confirm with the school.
export const stages = [
  { id: 'primary', name: 'Primary', gu: 'પ્રાથમિક', hi: 'प्राथमिक', range: 'Std 1–5', points: [
    'Emphasis on improving the conceptual understanding of core subjects.',
    'Thematic and integrated learning to explore lessons outside the textbook.',
    'Introduction to language training, logical reasoning and creative writing.' ] },
  { id: 'upper-primary', name: 'Upper Primary', gu: 'ઉચ્ચ પ્રાથમિક', hi: 'उच्च प्राथमिक', range: 'Std 6–8', points: [
    'Become successful learners who enjoy learning.',
    'Become responsible citizens who make a positive contribution to society.',
    'Understand and apply knowledge to real-life experiences.' ] },
  { id: 'secondary', name: 'Secondary', gu: 'માધ્યમિક', hi: 'माध्यमिक', range: 'Std 9–10', points: [
    'Focus on competitive exams such as NEET, JEE and CAT with the Safal Career Foundation program.',
    '[ADD SECONDARY CURRICULUM POINT]' ] },
  { id: 'higher-secondary', name: 'Higher Secondary', gu: 'ઉચ્ચતર માધ્યમિક', hi: 'उच्चतर माध्यमिक', range: 'Std 11–12', points: [
    'Students identify their subjects of interest and gain a clearer understanding of their career path.',
    'Subject-based objectives that build logical thinking, reasoning and problem-solving.',
    'Humanities (Arts), Commerce and Science streams.' ] },
];

export const academicLinks = ['Syllabus', 'Child Assessment', 'Academic Regulations', 'Examination Schedule', 'Evaluation System', 'Academic Planner'];

export const facilities = [
  { icon: 'book', name: 'Library', gu: 'પુસ્તકાલય', hi: 'पुस्तकालय', img: '/images/live/library.webp', desc: 'A quiet reading room and lending library for every standard.' },
  { icon: 'flask', name: 'Education Lab', gu: 'શૈક્ષણિક લેબ', hi: 'शैक्षणिक लैब', img: '/images/live/Eduation-lab.webp', desc: 'Hands-on science and activity-based learning.' },
  { icon: 'board', name: 'Digital Board', gu: 'ડિજિટલ બોર્ડ', hi: 'डिजिटल बोर्ड', img: '/images/live/blackboard.webp', desc: 'Smart classrooms with digital boards.' },
  { icon: 'bed', name: 'Hostel', gu: 'છાત્રાલય', hi: 'छात्रावास', img: '/images/live/hostel.webp', desc: 'Residential facility for students.' },
  { icon: 'bus', name: 'Transportation', gu: 'પરિવહન', hi: 'परिवहन', img: '/images/live/transportation.webp', desc: 'School bus routes across the city.' },
  { icon: 'pulse', name: 'Health Checkup', gu: 'આરોગ્ય તપાસ', hi: 'स्वास्थ्य जाँच', img: '/images/live/helth-checkup.webp', desc: 'Regular health check-ups for students.' },
  { icon: 'food', name: 'Canteen', gu: 'કેન્ટીન', hi: 'कैंटीन', img: '/images/live/canteen.webp', desc: 'Meals and snacks on campus.' },
  { icon: 'people', name: 'Parenting', gu: 'પેરેન્ટિંગ', hi: 'पेरेंटिंग', img: '/images/live/parents.webp', desc: 'Parent sessions and regular parent–teacher meets.' },
  { icon: 'map', name: 'Field Trips', gu: 'પ્રવાસ', hi: 'शैक्षिक यात्रा', img: '/images/live/fieldtrip.webp', desc: 'Learning trips beyond the classroom.' },
];

export const programs = [
  { tag: 'Std 9 – 12', name: 'Safal Career Foundation', desc: 'Focused preparation for competitive exams such as NEET, JEE and CAT.', dark: true },
  { tag: 'English', name: 'Cambridge English YLE', desc: 'Young Learners English assessments to build confident communicators.' },
  { tag: 'Competitions', name: 'Spell Bee International', desc: 'Spelling, vocabulary and stage confidence at an international level.' },
];

export const personas = [
  { label: 'New parent', gu: 'નવા વાલી', hi: 'नए अभिभावक', links: [
    { title: 'Programs offered', note: 'Std 1–12, both mediums', href: '/academics' },
    { title: 'Online admission form', note: 'About 5 minutes', href: '/admissions' },
    { title: 'Download brochure', note: 'PDF', href: '/brochure.pdf' },
    { title: 'Book a campus visit', note: 'We call you back', href: '/#visit' } ] },
  { label: 'Current parent', gu: 'હાલના વાલી', hi: 'वर्तमान अभिभावक', links: [
    { title: 'Academic planner', note: 'Term calendar', href: '/academics#planner' },
    { title: 'Examination schedule', note: 'Upcoming exams', href: '/academics#exams' },
    { title: 'Evaluation system', note: 'How grading works', href: '/academics#evaluation' },
    { title: 'News & circulars', note: 'Latest updates', href: '/news' } ] },
  { label: 'Student', gu: 'વિદ્યાર્થી', hi: 'विद्यार्थी', links: [
    { title: 'Syllabus', note: 'By standard', href: '/academics#syllabus' },
    { title: 'Safal Career Foundation', note: 'NEET · JEE · CAT', href: '/academics#programs' },
    { title: 'Cambridge YLE', note: 'Registration', href: '/academics#programs' },
    { title: 'Spell Bee International', note: 'Registration', href: '/academics#programs' } ] },
  { label: 'Job seeker', gu: 'નોકરી ઇચ્છુક', hi: 'नौकरी चाहने वाले', links: [
    { title: 'Open positions', note: 'Both campuses', href: '/careers' },
    { title: 'Apply with your CV', note: 'PDF or DOC', href: '/careers#apply' },
    { title: 'Life at Safal', note: 'Facilities', href: '/facilities' },
    { title: 'Contact us', note: 'Call or email', href: '/contact' } ] },
];

export const seedNews = [
  { title: 'Admissions open for Session 2026–27 — English & Gujarati medium', tag: 'Admissions', type: 'photo', date: '2026-10-01', published: true, image_url: '', video_url: '', body: 'Admissions are open for Std 1 to Std 10 and Std 11–12 (Arts, Commerce and Science streams) in both English and Gujarati medium.' },
  { title: 'A glimpse of Safal Vidyalaya, Gandhinagar', tag: 'Video', type: 'video', date: '2026-09-20', published: true, image_url: '', video_url: 'https://www.youtube.com/@[CHANNEL]', body: 'Take a short video tour of our Gandhinagar campus.' },
  { title: 'Spell Bee International — explore new heights', tag: 'Competition', type: 'photo', date: '2026-09-10', published: true, image_url: '', video_url: '', body: 'Registrations are open for Spell Bee International.' },
  { title: 'Cambridge English Language Assessment — YLE exams', tag: 'Assessment', type: 'photo', date: '2026-08-28', published: true, image_url: '', video_url: '', body: 'Students can register for Cambridge Young Learners English exams.' },
  { title: 'Safal Vidyalaya events & activities', tag: 'Events', type: 'video', date: '2026-08-15', published: true, image_url: '', video_url: '', body: 'Highlights from recent events and activities.' },
];

// Photos from the current website — replace with high-res originals from the school.
export const gallery = [
  { src: '/images/live/event-a.webp', caption: 'Annual function', w: 1600, h: 1200 },
  { src: '/images/live/image-42.webp', caption: 'Celebrations', w: 1080, h: 1080 },
  { src: '/images/live/img_r2Xk.webp', caption: 'Campus life', w: 1280, h: 720 },
  { src: '/images/live/image-14.webp', caption: 'Activities', w: 1080, h: 1080 },
  { src: '/images/live/event-b.webp', caption: 'Events', w: 1600, h: 1200 },
  { src: '/images/live/image-40.webp', caption: 'Competitions', w: 1080, h: 1080 },
  { src: '/images/live/image-39.webp', caption: 'Programs', w: 1080, h: 1080 },
  { src: '/images/live/safal-video.webp', caption: 'Safal glimpse', w: 1104, h: 594 },
];
