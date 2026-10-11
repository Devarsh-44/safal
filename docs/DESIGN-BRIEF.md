# Safal Vidyalaya — Redesign Brief (v1, 2026-10-11)

Source of truth for the Figma file and the code. Figma variables and `globals.css` tokens must match this.

## 1. Goals
1. **More admission enquiries.** Admission is the #1 action on every page and is never more than one tap away.
2. **Trust in 10 seconds.** Real campus, real numbers, real faces (no stock photos).
3. **Content the school can update itself.** News, events, gallery, careers and notices all come from the CMS, with nothing hardcoded.
4. **Fast on a budget Android phone over 4G.** Animations must not cost the school enquiries.

**Audiences:** prospective parents (primary), current parents (portal, notices), job seekers, alumni.

## 2. Decisions locked
| Topic | Decision |
|---|---|
| Visual direction | **Hybrid**: cinematic hero (from the IGLOO reference) and a clean editorial layout for the rest (from the Gridline reference) |
| Branches | One site, with a **branch switch** in the hero and nav (remembered in a cookie). The blocking popup is removed. |
| Languages | **English, Gujarati, Hindi** (`en`, `gu`, `hi`), routed as `/[locale]/...` |
| Backend | **Keep Supabase** (Postgres, Auth, Storage, RLS) and extend the existing `/admin` |
| Scope | Enquiry CRM · CMS (news, events, gallery, careers, notices) · online admission with document upload · parent portal |
| Process | Figma first: design system and Home in Figma, client sign-off, then code |

## 3. Concept: "Bloom into Brilliance"
The real campus is the hero object. A giant **SAFAL** headline sits *behind* the building cut-out, which creates depth the way the IGLOO reference does. As you scroll, the building lifts, the headline tracks, and the branch cards rise. Everything after that is calm and editorial: white space, geometric type, black pill buttons and count-up stats.

## 4. Sitemap
```
/[locale]
├─ /                     Home
├─ /about                Story, philosophy, principal's message, leadership
├─ /academics            Std 1–5 · 6–8 · 9–10 · 11–12 (Arts/Commerce/Science), English/Gujarati medium
├─ /facilities           Library, labs, digital boards, transport, hostel, canteen, health
├─ /life                 Gallery (photo + video), events calendar
├─ /news                 News & blog (CMS)
├─ /admissions           Process, fees enquiry, FAQ → /admissions/apply (wizard) → /admissions/track
├─ /careers              Openings (CMS) + application
├─ /contact              Both branches, maps, callback
└─ /portal               Parent login → notices, circulars, calendar, fee info (phase 3)
/admin                   Staff: enquiries, applications, messages, CMS, notices, parents
```

## 5. Home: section by section
| # | Section | Motion |
|---|---|---|
| 1 | **Hero.** SAFAL display headline behind the campus cut-out, tagline, branch switch (Gandhinagar / Ahmedabad), "Apply 2026-27" and "Book a visit" buttons | Load: headline letters rise with a stagger, then the building fades and scales from 1.04 to 1. Scroll (pinned): the building moves up, the headline parallaxes slower, the branch cards rise. |
| 2 | **Proof strip.** Years · students · board result % · teachers · bus routes | Numbers count up when they enter the screen |
| 3 | **Philosophy.** "Education for Life" | Scroll-scrubbed reveal, word by word (opacity 0.15 → 1) |
| 4 | **Programs.** 4 stage cards, medium toggle | Hover/tap expands the card; toggle uses a shared layout animation |
| 5 | **Facilities** | Horizontal pinned scroll of tall photo cards (from the IGLOO card stack) |
| 6 | **A day at Safal.** 7:30 → 2:00 timeline | Progress line drawn by scroll; photos slide in from alternating sides |
| 7 | **Life & events.** Gallery highlights and next 3 events | Masonry fade-up; lightbox |
| 8 | **Voices.** Parent and alumni quotes | Auto-advancing marquee that pauses on hover |
| 9 | **Admissions CTA.** 3 steps and the button to start | Magnetic button; steps connect with a drawn line |
| 10 | **Footer.** Two branch cards with maps, quick links, socials | Simple fades |

**Global:** Lenis smooth scroll · page transitions · sticky mobile bar (Call / WhatsApp / Apply) · custom cursor on desktop only · everything respects `prefers-reduced-motion`.

## 6. Design tokens (evolved from the current `globals.css`)
Colour comes from the logo's chakra navy and a saffron accent, with a quiet tricolour nod.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0F1533` | Text, dark sections |
| `--indigo` | `#2B2F86` | Brand, chakra |
| `--blue` | `#1D4F9C` | Links, focus |
| `--saffron` | `#E0621F` | Main accent, admission CTA (white text on it: use `#C2511A` for AA) |
| `--saffron-ink` | `#C2511A` | Accessible saffron for text and filled buttons |
| `--green` | `#1D7A46` | Success, tricolour nod |
| `--paper` | `#F7F5F0` | Warm section background (editorial) |
| `--mist` | `#F4F6FB` | Cool section background |
| `--line` | `#E1E5EF` | Borders |
| `--slate` | `#4A5272` | Secondary text |

**Type**
| Role | Latin | Gujarati | Devanagari |
|---|---|---|---|
| Hero wordmark (SAFAL only) | Big Shoulders Display 900 | (Latin wordmark kept) | (Latin wordmark kept) |
| Display / headings | Bricolage Grotesque 700–800 | Hind Vadodara 700 | Mukta 700 |
| Body | Hind Vadodara 400–600 | Hind Vadodara | Mukta |
| Captions / labels | JetBrains Mono 500, uppercase, 0.12em tracking | (falls back to body) | (falls back to body) |

Scale: 14 · 16/17 · 20 · 28 · 48 · 68 · hero `clamp(120px, 22vw, 340px)`. Radius 16 / 24 / pill. Spacing 4-pt grid; sections 96 px desktop, 56 px mobile.
**Motion:** ease `cubic-bezier(.2,.7,.2,1)`; durations 200 ms (UI) · 600 ms (reveal) · scroll-scrubbed (hero, philosophy, timeline).

## 7. Tech plan
- Existing: Next.js 15 · Supabase · Framer Motion
- **Add:** `gsap` + ScrollTrigger (hero pin, horizontal scroll, scrub), `lenis` (smooth scroll), `next-intl` (3 locales, routing)
- Images: `next/image`, AVIF/WebP, hero cut-out as a transparent WebP under 250 KB
- **Supabase additions:** `branches`, `events`, `gallery_items`, `jobs`, `notices`, `parents`, `students` tables; storage buckets `gallery`, `notices`, `admission-docs` (private); RLS by role (`staff`, `parent`)
- Notifications: email (Resend) and a WhatsApp link (later the WhatsApp Cloud API) on a new enquiry
- Performance budget: LCP < 2.5 s on 4G, CLS < 0.05, JS < 200 KB gzipped on Home

## 8. Phases
| Phase | Output | Sign-off |
|---|---|---|
| 0 Foundations | Figma: moodboard, style tiles, variables, components | Client approves the look |
| 1 Marketing site | Figma Home and inner pages, then code (3 languages, branch switch, animations) | Client review on a Vercel preview |
| 2 Admissions | Enquiry CRM upgrade, apply wizard with document upload, application tracking | Test enquiries end to end |
| 3 Parent portal | Login, notices, circulars, calendar, fee info | Pilot with a few parents |
| Launch | Content entry, QA (Lighthouse, mobile, accessibility), domain cut-over from Unity Infoway | Go-live |

## 9. Needed from the school
Logo SVG · high-res campus and drone photos (one straight-on building shot for the cut-out) · founding year, student and teacher counts, board results · Ahmedabad address and phone · principal photo and message · fee structure (or "enquire") · Gujarati and Hindi proof-readers · domain/DNS access from the current vendor.
