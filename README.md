# Safal Vidyalaya — website (Next.js + Supabase)

Redesigned school website: animated, bilingual (English / ગુજરાતી), with working admission,
callback, careers and contact forms, and a staff admin panel.

## Run it (2 minutes)

```bash
npm install
npm run dev          # http://localhost:3000
```

With no `.env.local` the site runs in **demo mode**: every form works and data is saved in the
browser's localStorage, so you can demo the full flow with zero setup.

- Website: `/`  ·  Admissions form: `/admissions`  ·  Staff admin: `/admin`
- Demo admin login: **admin@safal.demo / safal2026** (only in demo mode)

## Go live with Supabase (15 minutes)

1. Create a free project at supabase.com (region: Mumbai `ap-south-1`).
2. SQL Editor → paste `supabase/schema.sql` → Run. This creates the tables, security rules,
   upload buckets and three starter news posts.
3. Authentication → Users → **Add user** for each staff member (email + password).
   Then Authentication → Providers → Email → turn **off** "Allow new users to sign up".
4. Project Settings → API → copy the URL and `anon` key into `.env.local`
   (see `.env.example`). Restart `npm run dev`. The demo banner disappears.

## Deploy (Vercel, free)

Push this folder to GitHub → vercel.com → **Add New Project** → import the repo →
add the two `NEXT_PUBLIC_SUPABASE_*` env vars → Deploy. You get a live `*.vercel.app` link;
add `safalvidhyalaya.com` under Settings → Domains when the school approves.

## What's where

```
src/app/(site)/        public pages: home, academics, facilities, news, admissions, careers, contact
src/app/(site)/template.js   page-transition animation
src/app/admin/         staff dashboard (enquiries, messages, job applications, news CMS)
src/components/        Header, Footer, Motion (Reveal / Stagger / Counter / Chakra), forms
src/lib/content.js     ALL school text — edit here. [BRACKETS] = still needed from the school
src/lib/i18n.js        English / Gujarati strings
src/lib/store.js       data layer: Supabase when keys exist, localStorage otherwise
supabase/schema.sql    database, row-level security, storage buckets
public/images/         logo + campus photo (replace with high-res originals)
```

## Animations

GSAP + ScrollTrigger + Lenis: cinematic hero (wordmark clipped behind the campus roofline,
traced from the photo — `src/components/home/roofline.js`), pinned horizontal facilities strip, scrubbed
philosophy reveal. Framer Motion: hero entrance + parallax photo, floating cards, rotating chakra motif,
scroll reveals with stagger, counting stats, Bloom's hexagons (spring), tab/panel transitions,
news filter re-layout, modal, mobile drawer, page transitions, admission wizard slide + success pop.
CSS: announcement ticker, CTA pulse, hover lifts. Everything respects
`prefers-reduced-motion`.

## Demo script (5 minutes, for the client meeting)

1. Home → wait 2 s for the intro (SAFAL rises from behind the building). Switch campus in the glass card.
   Scroll slowly: camera pushes in and the wordmark sinks → stats count up → philosophy lights up word by word
   → facilities scroll sideways → gallery (click a photo, use ← →). Hover the Bloom hexagons.
2. Switch **EN / ગુ / हि** in the header (nav, hero and home copy change; inner pages are English for now).
3. "I am a…" → Current parent → shows their shortcuts.
4. **Start admission enquiry** → fill the 4 steps (pick Std 11 to show the stream picker) → submit
   → reference number.
5. Footer → **Staff login** → sign in → the enquiry you just made is at the top →
   open it → move to "Visit booked" → WhatsApp parent button.
6. News & events → New post → publish → open `/news` — it's live.
7. Resize to phone width (or open on a phone): bottom Call / WhatsApp / Apply bar, slide-in menu.

## Still needed from the school

Ahmedabad address & phone · founding year · std ranges per stage (assumed 1–5, 6–8, 9–10, 11–12)
· real photos / video links · brochure PDF (`public/brochure.pdf`) · syllabus & planner PDFs ·
current job openings · Gujarati proof-read.
