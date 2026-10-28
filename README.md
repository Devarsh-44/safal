# Safal Vidyalaya: rebranding a school website

> A UI/UX case study from my design journey. I took a K–12 school's website from a generic template to a
> bilingual, notebook-inspired design system with motion that means something, and built it end to end.

**Safal Vidyalaya** is an English and Gujarati medium school for Std 1 to 12 in Sector 22, Gandhinagar,
affiliated with Gujarat Pradesh Vidyabharti. This repository is my redesign of its website. It started as a
plain brochure site and became a full rebrand: a design concept, a design system, eight pages in three
languages, and the working forms and staff tools behind them.

**Status:** a concept build and portfolio piece, not yet the school's official site. Real photos, names and
numbers from the school are still on their way, so text in `[brackets]` and photos marked "sample photo" are placeholders.

---

## The brief

Who the site is for, in order: **prospective parents**, current parents, job seekers, and the school's own staff.

What it had to do:

1. **Turn visits into admission enquiries.** "Apply" is never more than one tap away, on every page.
2. **Earn trust in about 10 seconds.** Real campus, real facts, and a voice that sounds like a school, not a template.
3. **Speak the families' language.** Full English, Gujarati (ગુજરાતી) and Hindi (हिन्दी), switchable on any page.
4. **Work on a budget Android phone.** Motion should never cost a parent the enquiry.
5. **Let the school run it.** Enquiries, messages, job applications and news all go to a staff admin panel.

---

## The journey: three directions in 17 days

Design is mostly deciding what to throw away. This project went through three directions before it found its idea.

| | Direction | What I tried | What I learned |
|---|---|---|---|
| **v1** · 11 Oct | *"Bloom into Brilliance"* | A cinematic hero with the word SAFAL sitting behind a traced outline of the campus roofline, then a calm editorial layout. | It worked as a hero, but the concept stopped at the hero. The rest of the site had no idea of its own. |
| **v2** · 22 Oct | *Porthole*, then *cinematic* | A porthole layout, a date-of-birth class finder, then a 3D chakra, a custom cursor, a film reel and a preloader. | Lots of technique, little meaning. The effects could have belonged to any brand. |
| **v3** · 27–28 Oct | **"The Margin"** ✓ | One idea that drives the whole site, from layout to colour to motion. | This is the one. Details below. |

I also explored and rejected **"Hopscotch"** (the painted tiles on the school's lawn as a motif). It was charming
in a single section, but too literal to carry eight pages.

---

## The concept: "The Margin"

Every Safal student writes in a notebook with a red margin line, and that margin slowly fills with the teacher's
ticks, stars and "very good!" notes.

**The website is that notebook page.** Clean ruled paper for reading, a red margin line down every section, and
hand-drawn marks (underlines, circles, ticks, stars) that draw themselves as you scroll. The concept and the motion
are the same thing, so the animation isn't decoration: it's the teacher marking the page.

Where it shows up:

- Every section has the red margin line, with a handwritten note in it ("the index", "how we teach", "p. 3").
- Key words get a teacher's mark: a squiggle under *bloom*, a circle around *Character*, a double underline under *life*.
- Forms are written on ruled lines. Sending one draws a tick. The contact note folds into a paper plane.
- Each page is numbered like a notebook page, **p. 1 to p. 8**, and has its own colour field.

---

## Design system

### Colour

The page stays white. Each section gets **one** bright colour field. Saffron is kept only for "Apply", and margin red only for marks.
The palette is sampled from the school itself: the chakra in the logo, the SAFAL tower, the window frames, the front lawn.

| Token | Light | Use |
|---|---|---|
| `--ink` | `#241D5C` | Text and dark bands (from the logo's chakra) |
| `--paper` | `#FBFBFE` | Page ground |
| `--rule` | `#DCE5F5` | Notebook ruled lines |
| `--pen` | `#E0453F` | The margin line and teacher's marks |
| `--saffron` | `#EE7A43` | **Apply only** (from the SAFAL tower) |
| `--marigold` | `#F7B928` | Home's colour field (from the window frames) |
| `--sky` | `#4AB3EC` | Admissions |
| `--leaf` | `#34B470` | Academics, success states (from the front lawn) |
| `--violet` · `--teal` · `--rose` | `#8B6CF0` · `#14B8A6` · `#EC5F9A` | About · Contact · Careers |

Every token has a dark-mode pair. Section text on a colour field is always `--ink` for contrast.

### Type

| Role | Typeface |
|---|---|
| Headlines | **Young Serif**, friendly and bookish |
| Body | **Figtree**, 17px / 1.6 |
| Handwritten notes and marks | **Caveat** |
| Gujarati · Hindi | **Baloo Bhai 2** · **Baloo 2** |

### Motion principles

1. **Motion has to mean something.** Every animation is either a teacher's mark, a page being turned, or paper being handled.
2. **Content first.** Everything is readable before any animation runs, and nothing hides content from search engines or screen readers.
3. **Scroll-linked motion is always eased, never 1:1.** Raw scroll positions make wheel notches jump. Every scroll-driven effect glides after the scroll instead (see *Lessons*).
4. **One easing curve**, `cubic-bezier(.2, .7, .2, 1)`, with a springy variant for physical things like cards and paper.
5. **`prefers-reduced-motion` turns it all off**, and the site still works fully without it.

---

## The pages

| Page | Colour | The signature interaction |
|---|---|---|
| **Home** · p. 1 | marigold | Full-bleed campus carousel, the "Why Safal?" notebook ticking itself off, a stage card deck dealt onto the page |
| **Admissions** · p. 2 | sky | A date-of-birth age finder, a document checklist you can tick off, and a 4-step application wizard |
| **Academics** · p. 3 | leaf | Coloured notebook index tabs that turn the page to each stage, and Bloom's taxonomy as a staircase that builds itself |
| **Campus** · p. 4 | saffron | A **sideways journey**: the page pins, and scrolling walks you past six stops while a red pen trail draws underneath |
| **Life at Safal** · p. 5 | red | A **scrapbook wall** of taped polaroids you can drag (they swing with the pull), filter and shuffle, plus a live notice board |
| **About** · p. 6 | violet | The principal's letter **writes itself** word by word as you scroll, and the signature draws at the end |
| **Contact** · p. 7 | teal | A note on ruled paper that **folds into a paper plane** and flies off when sent |
| **Careers** · p. 8 | rose | Job notices pinned to a board, and a 3-step application where your CV clips onto the page |

Across the whole site:

- **First-load screen:** the notebook page draws itself, a pen line fills as the site loads, then the page lifts away.
- **Page transitions:** graph-paper squares fill the screen in the next page's colour, the page name is written in the middle, and the squares clear.
- **Navigation:** a floating glass nav on desktop. On phones, a full-screen notebook menu and an always-visible Call / WhatsApp / Apply bar.

---

## Lessons from feedback

The most useful part of the project was the rounds where something didn't work.

- **Campus, first attempt: "too dark, gimmicky and slow."** I'd made it "cinematic" with letterbox bars, a REC dot, a timecode and a pinned six-screen tour.
  I rebuilt it as a bright sideways journey, based on a Dribbble gallery animation. Lesson: *cinematic* is about how something moves, not about borrowing film props.
- **Campus, second attempt: "make the movement smoother."** Scroll mapped 1:1 felt jerky. I added inertia (the track eases after the scroll) and
  settle-on-stop (when you pause, the nearest stop glides to the centre). This became a rule for the whole site.
- **About: "congested and laggy."** The values were set in type too big to breathe, and the letter followed the scrollbar exactly. I calmed the values into a 2×2 card grid and gave the
  scroll effects the same easing as Campus.
- **Life: "it could use scroll animation."** Rather than adding effects, I gave the scrapbook *depth*: each photo drifts at its own speed, as if pinned at a different height.
- **Engineering lessons:** generic class names (`.track`, `.done`, `.chips`) quietly broke other pages, so new components now get prefixed names.
  And a page transition that gives up after 5 seconds looks broken on a slow first load, so it now waits for the page and shows a gentle "still loading" pulse.

---

## Accessibility and performance

- **Three full languages.** Every page is in English, Gujarati and Hindi, with typefaces chosen for each script.
- **Reduced motion respected everywhere.** Content is visible without JavaScript, including the loader.
- **Keyboard support.** Index tabs (arrow keys, Home/End), the photo viewer (arrows, Escape, focus returned), and every form.
- **Contrast.** Text on colour fields is always deep ink. Filters and chips use `aria-pressed`, and form errors are announced.
- **Responsive.** Checked at 1440, 1366, 1280, 1180, 1100, 1024, 768 and 375px in all three languages, with no sideways scrolling.
- **Light on the public pages.** No animation libraries: motion is CSS, the Web Animations API and `requestAnimationFrame`, and scroll-driven work is written straight to CSS variables so React doesn't re-render on scroll.

---

## Built with

**Next.js 15** (App Router) · **React 19** · plain CSS with design tokens · **Supabase** (Postgres, Auth, Storage)
for forms and the admin panel. Framer Motion is used only inside the staff admin.

### Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

With no `.env.local`, the site runs in **demo mode**: every form works and saves to the browser's localStorage, so the
whole flow can be demoed with no setup.

- Site: `/` · Staff admin: `/admin` (also linked as "Staff login" in the footer)
- Demo admin login: **admin@safal.demo / safal2026** (demo mode only)

### Connect a real database (free)

1. Create a free project at **supabase.com**. Create it directly there, not through Vercel's marketplace.
2. **SQL Editor:** run `supabase/schema.sql`. It creates the tables, row-level security, storage buckets and starter news.
3. **Authentication → Users → Add user** for each staff member, then turn off public sign-ups.
4. Copy the project URL and `anon` key into `.env.local` (see `.env.example`), and add the same two variables in Vercel.

Free Supabase projects pause after a week without activity. Restore the project from the Supabase dashboard before a demo.

### Deploy

Import the repo into **Vercel** as a Next.js project and deploy. Without the Supabase variables, the deployed site runs in demo mode.

---

## Project structure

```
src/app/(site)/          the eight public pages: home, admissions, academics, campus, life, about, contact, careers
src/app/admin/           staff dashboard: enquiries, messages, job applications, news
src/app/v3.css           the design system: tokens, components, motion, responsive rules
src/components/v3/       page components, plus shared pieces:
                         Marks.js (the teacher's marks), Reveal.js (scroll reveals and eased scroll),
                         PageTransition.js, Loader.js, Header, Footer, PageHero, Sheet
src/lib/v3Strings.js     all page copy in English, Gujarati and Hindi
src/lib/content.js       school facts: campuses, phone, facilities, programmes
src/lib/store.js         data layer: Supabase when keys exist, localStorage otherwise
supabase/schema.sql      database, row-level security, storage buckets
docs/                    design briefs: DESIGN-BRIEF.md (v1/v2) and DESIGN-BRIEF-v3.md (The Margin)
```

---

## Credits and references

- **School:** Safal Vidyalaya, Gandhinagar. The logo, building and event photos are the school's own.
- **Sample photos:** some photos are openly licensed (CC BY-SA 4.0) pictures of other Indian schools from Wikimedia Commons, used as stand-ins and credited in the site footer. They will be replaced with Safal's own.
- **Inspiration:** [21oaks.org](https://21oaks.org) for the hero carousel, card deck and drawn underlines, and Wesley van 't Hart's
  "Gallery Animation Exploration" on Dribbble for the Campus journey.
- **Typefaces:** Young Serif, Figtree, Caveat, Baloo Bhai 2 and Baloo 2, via Google Fonts.

## What's next

- Swap in the school's real photos, logo SVG, founding year, numbers, names and job openings.
- A Gujarati and Hindi proof-read by the school.
- A parent portal (notices, circulars, calendar).
- Deploy to a new Vercel project, then connect a free Supabase database for the live demo.
