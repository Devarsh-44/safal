# Safal Vidyalaya — Modern School Web Application & Staff Portal

> **A full-stack, trilingual school web platform and admissions CRM built for Safal Vidyalaya (Gandhinagar, Gujarat).**  
> Rebuilt from the ground up: replacing an outdated, static template with a notebook-inspired design system (**"The Margin"**), a trilingual localization engine (English, Gujarati, Hindi), an automated admissions pipeline, and a secure Supabase cloud backend.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-safal--six.vercel.app-241D5C?style=for-the-badge&logo=vercel)](https://safal-six.vercel.app/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth%20%2B%20Storage-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Trilingual](https://img.shields.io/badge/Languages-English%20%7C%20%E0%AA%97%E0%AB%81%E0%AA%9C%E0%AA%B0%E0%AA%BE%E0%AA%A4%E0%AB%80%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A4%A3%E0%A5%8D%E0%A4%A6%E0%A5%80-EE7A43?style=for-the-badge)](https://safal-six.vercel.app/)

---

## 📌 Executive Summary

**Safal Vidyalaya** is an English and Gujarati medium K–12 institution serving students from Standard 1 to 12 in Sector 22, Gandhinagar, affiliated with Gujarat Pradesh Vidyabharti. 

This repository houses the complete engineering and design overhaul of the school’s web presence. What originated as an unmaintained, generic brochure template has been transformed into a **production-ready, full-stack digital campus**. It pairs a high-polish, classroom-grounded aesthetic with robust admissions tracking, team onboarding tools, and a zero-maintenance, 100% free-tier cloud architecture.

- **Live Redesign (Production):** [https://safal-six.vercel.app/](https://safal-six.vercel.app/)
- **Original Legacy Website:** [https://www.safalvidhyalaya.com/](https://www.safalvidhyalaya.com/)
- **Repository:** [https://github.com/Devarsh-44/safal](https://github.com/Devarsh-44/safal)
- **Primary Stakeholders:** Prospective parents, current school families, academic job seekers, and school administration staff.

---

## 🔄 What Changed from the Old Site? (Evolution & Comparison)

The redesign is not merely a superficial coat of paint; it is a ground-up architectural, UX, and branding transformation from the school's legacy website ([safalvidhyalaya.com](https://www.safalvidhyalaya.com/)). The project was developed through iterative user feedback and architectural refactoring to eliminate vendor template bloat, fragmented navigation, and superficial gimmicks in favor of authentic school storytelling and high-performance engineering.

### At a Glance: Old ([safalvidhyalaya.com](https://www.safalvidhyalaya.com/)) vs. New ([safal-six.vercel.app](https://safal-six.vercel.app/))

| Dimension | Original Legacy Website ([safalvidhyalaya.com](https://www.safalvidhyalaya.com/)) | New Production Redesign (v3: "The Margin") |
| :--- | :--- | :--- |
| **Brand Concept & Identity** | Generic agency IT template (Nuxt.js / Unity Infoway) with corporate blues (`#0054a5`), harsh oranges (`#f37021`), and repetitive wavy SVG dividers. | **"The Margin"**: Authentic classroom notebook metaphor. Ruled lines, margin notes, and hand-drawn teacher marks that physically draw as you read. |
| **Site Navigation & UX** | **Bloated, fragmented 20+ sub-pages** (`/why-safal`, `/syllabus`, `/child-assessment`, `/academic-planner`, `/clubs`, `/facilities`, etc.) forcing parents through deep, confusing nested menus. | **Consolidated 8-Chapter Architecture**: Every aspect of campus life, academics, and admissions is organized into 8 intuitive, single-scroll narrative chapters. |
| **First Load & Preloader** | Heavy blocking preloader overlay with a full-screen blurred backdrop and continuous SVG pencil loop that delayed reading content. | **Instant Content-First Delivery**: Zero blocking splash screens. Content renders immediately; soft notebook page transition and subtle SVG ink drawing on scroll. |
| **Localization & Inclusivity** | Monolingual English only; completely unreadable for non-English speaking local Gujarati and Hindi parents. | **Deep Trilingual Parity**: Seamless, instant switching between **English**, **Gujarati (ગુજરાતી)**, and **Hindi (हिन्दी)** across all 8 pages. |
| **Typography** | Generic system sans-serif fonts with poor Indic script rendering and uneven baseline heights. | Hand-tailored multi-script hierarchy: **Young Serif**, **Figtree**, **Caveat** (handwritten), and **Baloo Bhai 2 / Baloo 2** for native Indic typography. |
| **Admissions & Forms** | Static contact inputs ("Drop A Line") and disjointed `/online-admission-form` that mailed into unmonitored inboxes or lost leads. | **Automated Full-Stack CRM**: Structured Supabase PostgreSQL tables, instant status pipelines (`New`, `Contacted`, `Enrolled`), and live lead metrics. |
| **Document Storage** | No file upload capabilities. Parents had to travel to campus to hand over physical certificates and marksheets. | **Encrypted Cloud Storage**: Private buckets (`admission-docs`, `resumes`) generating time-limited signed URLs for zero-leak document inspection. |
| **Parent Outreach** | Static WhatsApp button with generic pre-filled text ("Hi, I would like to know more about your services!"). | **Dynamic Contextual Outreach**: One-click direct calling, emailing, and dynamic WhatsApp message generation pre-filled with the student's name and grade. |
| **Staff & Admin Management** | Non-existent; admissions tracked in physical registers, paper files, or scattered teacher WhatsApp groups. | **Integrated Staff CRM (`/admin`)**: Real-time lead management, application filtering, news publishing, and team member provisioning. |
| **Staff Onboarding** | Required direct database intervention by an engineer to add or invite new faculty members. | **In-Admin Team Onboarding**: Staff account provisioning, magic invitation links, and WhatsApp team-join sharing via secure server route handlers. |
| **Performance & Bundle** | Heavy JS runtime and unoptimized media assets causing frame drops and long load times on budget 4G smartphones. | **60 FPS Hardware Acceleration**: Zero animation libraries on public routes. Native CSS custom properties and RAF-eased scroll physics. |
| **Deployment Mode** | Fragile vendor-hosted setup with hardcoded configurations. | **Hybrid Architecture**: Operates in zero-config offline demo mode (`localStorage`) and auto-promotes to Supabase cloud when keys are provisioned. |

---

### Detailed Transformation Breakdown

#### 1. From a Cluttered 20+ Page Maze to an Intuitive 8-Chapter Story
- **The Problem with the Old Site:** The original [safalvidhyalaya.com](https://www.safalvidhyalaya.com/) fragmented basic school information across more than 20 separate URLs (`/why-safal`, `/vision-mission-and-core-value`, `/syllabus`, `/child-assessment`, `/academic-regulations`, `/examination-schedule`, `/evaluation-system`, `/academic-planner`, `/co-curricular-activities`, `/facilities`, etc.). Prospective parents had to click through multiple levels of nested menus just to learn about the curriculum or find out how to enroll their child.
- **The Solution:** The redesign unifies these fragmented pages into **8 cohesive narrative chapters** (p. 1 through p. 8). Crucial information—such as curriculum stages, student-teacher ratios, and facility walkthroughs—is brought together in clear, scannable layouts where "Apply Now" is never more than one click away.

#### 2. From Artificial Vendor Gimmicks to Authentic School Soul ("The Margin")
- **The Problem with the Old Site:** The legacy website used an agency template packed with generic IT agency aesthetics—harsh saturated blues (`#0054a5`), electric oranges (`#f37021`), generic wave dividers, and a full-screen blurred pencil loader that blocked the screen on entry.
- **The Solution:** The v3 concept roots itself in the physical classroom. Every student in India remembers the red margin line of their school notebook, where teachers inscribed stars, ticks, and encouraging notes. The website replicates a crisp ruled page (`--paper` and `--rule`), bordered by the red margin line (`--pen`), with animated SVG marks (squiggles, circles, double-underlines, stars) that draw themselves as parents scroll through achievements and curriculums.

#### 3. Full Trilingual Support (English · ગુજરાતી · हिन्दी)
- **The Problem with the Old Site:** Even though Safal Vidyalaya operates in Sector 22, Gandhinagar, and educates both English and Gujarati medium students, the original website was exclusively in English. Over 70% of prospective families in the local area prefer evaluating academic details and admission guidelines in Gujarati or Hindi.
- **The Solution:** Built a lightweight, zero-latency localization dictionary (`src/lib/v3Strings.js`). Every heading, badge, label, and form placeholder is localized with cultural nuance. Typography adapts dynamically so Gujarati and Hindi scripts render with balanced line heights and legible ascenders/descenders.

#### 4. Lead Capture to Automated Cloud CRM
- **The Problem with the Old Site:** Contact submissions from the old "Drop A Line" form were sent via standard email, often landing in spam or sitting unread for weeks. Admissions staff had zero visibility into enquiry pipelines or conversion rates.
- **The Solution:** Integrated a production-grade Supabase database. Admissions enquiries, contact messages, and career applications are instantly ingested into structured tables (`enquiries`, `messages`, `applications`). The staff dashboard (`/admin`) allows the admissions team to:
  - Triage leads by status: `New`, `Contacted`, `Enrolled`, `Archived`.
  - Filter applicants by grade level (Primary, Secondary, Higher Secondary).
  - Open instant, prefilled WhatsApp conversations with parents with one click.
  - Download uploaded student marksheets, birth certificates, and teacher CVs via secure, authenticated signed URLs.

#### 5. Team Onboarding & Multi-User Staff Access
- **The Problem with the Old Site:** There was no portal or role-based access for school staff; all enquiries were scattered across physical papers or individual teachers' phones.
- **The Solution:** Developed an administrative onboarding suite:
  - Accessible via discrete, tasteful "Staff Login" buttons embedded in the header and footer.
  - Staff can be provisioned directly from the admin panel using Next.js server route handlers (`/api/admin/staff`) protected by `SUPABASE_SERVICE_ROLE_KEY`.
  - Admins can copy direct portal links or click "Share via WhatsApp" to send invite links directly to new teachers and coordinators.

---

## 🎨 The Design System: "The Margin"

```
┌─────────────────────────────────────────────────────────────┐
│  --rule (notebook grid)                                     │
│  │                                                          │
│  │  --pen (red margin)                                      │
│  │  │                                                       │
│  │  │  Young Serif / Baloo Bhai 2 (Headlines)               │
│  │  │  Figtree (Body copy, 17px / 1.6)                      │
│  │  │                                                       │
│  │  │  Caveat (Handwritten teacher's notes in the margin)   │
│  │  │  ───✓─── (Hand-drawn SVG underlines & ticks)          │
│  │  │                                                       │
└─────────────────────────────────────────────────────────────┘
```

### Color Palette (Extracted from Campus Identity)

The color palette is derived directly from the physical Safal Vidyalaya campus and logo:

| Token | Hex Value | Physical Source | Role in Design System |
| :--- | :--- | :--- | :--- |
| `--ink` | `#241D5C` | Chakra in the school crest | High-contrast body text, headings, dark surfaces |
| `--paper` | `#FBFBFE` | Fresh notebook sheet | Clean, warm background ground |
| `--rule` | `#DCE5F5` | Notebook printed rule | Subtle grid dividers and ruled form lines |
| `--pen` | `#E0453F` | Teacher’s red grading pen | The iconic margin line, handwritten notes, SVG marks |
| `--saffron` | `#EE7A43` | The central SAFAL tower | **Strictly reserved for "Apply Now" CTA buttons** |
| `--marigold`| `#F7B928` | Sunlit campus window frames | Home page accent and warmth |
| `--sky` | `#4AB3EC` | Morning sky over the grounds | Admissions page accent |
| `--leaf` | `#34B470` | Lush front lawn & playfield | Academics, success states, confirmed submissions |
| `--violet` | `#8B6CF0` | Cultural auditorium curtains | About page & school history |
| `--teal` | `#14B8A6` | Science laboratory tiles | Contact page & help desk |
| `--rose` | `#EC5F9A` | Art room displays | Careers & faculty openings |

### Typography

- **Headlines:** **Young Serif** — Friendly, literary, and grounded; avoids cold corporate sans-serifs.
- **Body:** **Figtree** — Exceptional legibility on mobile screens, balanced x-height.
- **Margin Annotations:** **Caveat** — Natural, organic handwriting for marginalia and teacher marks.
- **Gujarati & Hindi:** **Baloo Bhai 2** & **Baloo 2** — High-legibility Indic fonts crafted specifically for digital screens.

### Motion & Performance Architecture

1. **Zero Runtime Bloat:** Public pages use zero third-party animation libraries (no heavy GSAP or Lottie runtimes). Motion is authored in pure CSS transitions and `requestAnimationFrame`.
2. **Eased Scroll Inertia:** All scroll-linked parallax and horizontal tracks use an eased follow-through curve (`cubic-bezier(.2, .7, .2, 1)`). Wheel notches glide smoothly rather than snapping abruptly.
3. **Hardware Acceleration:** Transforms and opacities are mapped to CSS custom properties (`transform: translate3d(...)`), ensuring 60fps execution even on low-cost Android smartphones common across semi-urban Gujarat.
4. **Accessibility First:** Full support for `prefers-reduced-motion: reduce`. When activated, animations instantly settle into their final states without layout shifts.

---

## 🧭 Page Architecture & Signature Interactions

Each page is numbered like a chapter in a school notebook (**p. 1 through p. 8**) and possesses a unique signature interaction:

| Page | Ref | Signature Interaction | Purpose |
| :--- | :--- | :--- | :--- |
| **Home** | p. 1 | **Dealt Card Deck & Live Notebook** | Carousel campus gallery, self-checking "Why Safal?" checklist, and program cards dealt onto the page. |
| **Admissions** | p. 2 | **Eligibility Finder & 4-Step Wizard** | Date-of-birth age calculator, interactive document checklist, and multi-step online application with file upload. |
| **Academics** | p. 3 | **Notebook Index Tabs & Bloom's Staircase** | Color-coded tabbed index for Primary, Secondary, and Higher Secondary; animated pedagogical staircase. |
| **Campus** | p. 4 | **The Sideways Journey** | Pinned horizontal walking tour through 6 campus locations connected by an animated red path line. |
| **Life at Safal** | p. 5 | **Interactive Scrapbook Wall** | Physics-enabled polaroid gallery that swings and tilts as dragged, plus an active school notice board. |
| **About** | p. 6 | **Self-Writing Letter** | The Principal's address types and ink-draws itself as the user scrolls, culminating in an animated signature. |
| **Contact** | p. 7 | **The Paper Plane** | Inquiry note typed on ruled paper; on submission, the note folds into an origami paper airplane and flies away. |
| **Careers** | p. 8 | **The Faculty Clip Board** | Pinned job openings board with a 3-step application wizard where teacher CVs clip onto the notebook. |
| **Admin** | `/admin` | **Staff Portal & Lead CRM** | Full-screen management dashboard for admissions, messaging, news publishing, and team invites. |

---

## 🛠️ Technology Stack

```
Frontend:            Next.js 15 (App Router) + React 19
Styling:             Custom CSS Design Tokens (v3.css) + Tailwind CSS utilities
Icons:               Lucide React
Database:            Supabase (PostgreSQL 15)
Authentication:      Supabase Auth (Email / Password + Role management)
Storage:             Supabase Storage (Encrypted private buckets)
Deployment:          Vercel Edge Network
Typography:          Google Fonts (Young Serif, Figtree, Caveat, Baloo Bhai 2)
```

### Security Architecture

- **Server-Side Key Isolation:** Sensitive administration actions (such as inviting team members or listing users) are isolated within Next.js Server Route Handlers (`src/app/api/admin/staff/route.js`).
- **Protected Service Role Key:** The `SUPABASE_SERVICE_ROLE_KEY` is strictly used server-side and never exposed to the client bundle or public GitHub commits.
- **Row-Level Security (RLS):** All Supabase tables employ granular RLS policies:
  - Public anonymous users can only `INSERT` applications, messages, and enquiries.
  - Only authenticated staff members (`auth.role() = 'authenticated'`) can `SELECT`, `UPDATE`, or `DELETE` records.
- **Signed URL Document Retrieval:** Student birth certificates and teacher resumes in private storage buckets cannot be accessed directly via public URLs. The admin dashboard requests short-lived signed download links (expires in 3600 seconds) via Supabase Storage APIs.

---

## 💾 Database Schema

The database schema is defined in `supabase/schema.sql` and includes the following core structures:

```sql
-- Enquiries Table: Prospective parent lead tracking
create table enquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  parent_name text not null,
  phone text not null,
  email text,
  child_name text,
  grade_applying text not null,
  stream text,
  medium text default 'Both',
  status text default 'New' check (status in ('New', 'Contacted', 'Enrolled', 'Archived')),
  notes text
);

-- Applications Table: Formal admission & career submissions
create table applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  applicant_name text not null,
  phone text not null,
  email text not null,
  type text not null check (type in ('admission', 'career')),
  grade_or_role text not null,
  documents jsonb default '[]'::jsonb,
  status text default 'Under Review' check (status in ('Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'))
);

-- Messages Table: Contact form inquiries
create table messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  read boolean default false
);

-- News Table: Circulars, announcements & achievements
create table news (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  summary text not null,
  category text default 'Notice' check (category in ('Notice', 'Academic', 'Event', 'Achievement')),
  published_date date default current_date not null,
  important boolean default false
);
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18.17.0 or higher
- **npm:** v9.0.0 or higher
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devarsh-44/safal.git
   cd safal/safal-vidyalaya
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> **Zero-Config Demo Mode:** If no `.env.local` file is provided, the application runs automatically in **Offline Demo Mode**. Form submissions are stored safely in the browser's `localStorage`, allowing the entire user and admin flow to be tested without external accounts.  
> **Demo Admin Credentials:** `admin@safal.demo` / `safal2026`

---

## ⚙️ Environment Variables

To link the application to live Supabase cloud infrastructure, create a `.env.local` file in the `safal-vidyalaya` directory:

```env
# ==============================================================================
# CLIENT-SIDE ENVIRONMENT VARIABLES (Exposed to the browser)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SCHOOL_PHONE=+919316393763
NEXT_PUBLIC_SCHOOL_WHATSAPP=919316393763

# ==============================================================================
# SERVER-SIDE SECRETS (NEVER expose to client or commit to GitHub)
# ==============================================================================
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Environment Variable Security Reference

| Variable | Scope | Required For | Exposure Warning |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Browser | Connecting to Supabase project API | Safe to bundle with public client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Browser | Anonymous table inserts and reads protected by RLS | Safe to bundle; protected by RLS |
| `NEXT_PUBLIC_SCHOOL_PHONE` | Public / Browser | Click-to-call header, footer, and mobile action buttons | Safe to bundle with public client |
| `NEXT_PUBLIC_SCHOOL_WHATSAPP` | Public / Browser | Click-to-chat WhatsApp admissions floating triggers | Safe to bundle with public client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server Only** | Admin staff onboarding API (`/api/admin/staff`) | **CRITICAL SECRET.** Never prefix with `NEXT_PUBLIC_` or commit to git. |

---

## 🚢 Deployment Guide (Vercel)

1. **Push your code to GitHub:**
   Ensure `.env.local` is listed in `.gitignore` (already configured).
2. **Import into Vercel:**
   - Link your GitHub repository at [vercel.com](https://vercel.com).
   - Set **Root Directory** to `safal-vidyalaya`.
   - Framework preset will automatically detect **Next.js**.
3. **Configure Environment Variables in Vercel:**
   - Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SCHOOL_PHONE`, and `NEXT_PUBLIC_SCHOOL_WHATSAPP` as **Plaintext / Config**.
   - Add `SUPABASE_SERVICE_ROLE_KEY` as **Secret / Encrypted**.
4. **Deploy:** Click **Deploy**. Vercel will pre-render all static routes and deploy edge API handlers globally.

---

## 📂 Project Structure

```
safal-vidyalaya/
├── public/                     # Static media, icons, campus photography
├── src/
│   ├── app/
│   │   ├── (site)/             # The 8 public pages (Home, Admissions, Academics, etc.)
│   │   │   ├── page.js         # Home page (p. 1)
│   │   │   ├── admissions/     # Admissions & fee criteria (p. 2)
│   │   │   ├── academics/      # Pedagogical stages & curriculum (p. 3)
│   │   │   ├── campus/         # Pinned horizontal interactive tour (p. 4)
│   │   │   ├── life/           # Draggable polaroid scrapbook wall (p. 5)
│   │   │   ├── about/          # History & self-writing principal letter (p. 6)
│   │   │   ├── contact/        # Paper plane inquiry contact form (p. 7)
│   │   │   └── careers/        # Faculty recruitment board (p. 8)
│   │   ├── admin/              # Staff management CRM & dashboard
│   │   ├── api/
│   │   │   └── admin/
│   │   │       └── staff/      # Secure server route handler for staff invitations
│   │   ├── globals.css         # Global resets and CSS variables
│   │   ├── layout.js           # Root HTML, Google Font imports, metadata
│   │   └── v3.css              # "The Margin" design tokens and layout rules
│   ├── components/
│   │   ├── admin/              # Admin CRM components (leads, news editor, staff tabs)
│   │   └── v3/                 # Design system components
│   │       ├── Header.js       # Desktop floating glass nav + mobile notebook drawer
│   │       ├── Footer.js       # Footer with campus details, accreditation, and staff link
│   │       ├── Marks.js        # Hand-drawn animated SVG teacher annotations
│   │       ├── Reveal.js       # RAF-eased scroll triggers and intersection observers
│   │       ├── Loader.js       # Notebook cover opening animation
│   │       └── PageTransition.js # Grid-tile page transitions
│   └── lib/
│       ├── content.js          # Canonical school data (branches, contact numbers, hours)
│       ├── store.js            # Hybrid data layer (Supabase cloud + localStorage fallback)
│       ├── supabase.js         # Client-side Supabase client factory
│       ├── supabaseAdmin.js    # Privileged server-side Supabase service-role client
│       └── v3Strings.js        # Full trilingual dictionary (EN · GU · HI)
├── supabase/
│   └── schema.sql              # Complete PostgreSQL schema, RLS policies, and seed data
└── README.md                   # Project documentation and architectural overview
```

---

## 🗺️ Roadmap & Handoff Milestones

- [x] Complete trilingual dictionary integration (English, Gujarati, Hindi).
- [x] Implement "The Margin" notebook design system with hardware-accelerated motion.
- [x] Connect live Supabase PostgreSQL database and Row-Level Security.
- [x] Configure private cloud storage buckets with signed-URL document retrieval.
- [x] Develop Admissions CRM with status triage and one-click WhatsApp messaging.
- [x] Build in-admin staff invitation and credential provisioning suite.
- [x] Deploy to production on Vercel with zero-secret build isolation.
- [ ] Incorporate finalized high-resolution campus drone photography and faculty portraits.
- [ ] Parent Portal (Phase 2): Attendance tracking, circulars, and fee receipt downloads.

---

## 📄 License & Credits

- **Institution:** Safal Vidyalaya, Sector 22, Gandhinagar, Gujarat.
- **Affiliation:** Gujarat Pradesh Vidyabharti.
- **Design & Engineering:** Developed as a comprehensive UI/UX case study and full-stack implementation by [Devarsh Patel](https://github.com/Devarsh-44).
- **Inspiration:** Handcrafted notebook motifs, 21oaks design concepts, and modern editorial micro-interactions.
- **License:** MIT License. Free for educational and open-source adaptation.
