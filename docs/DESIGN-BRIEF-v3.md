# Safal Vidyalaya — Design Brief v3 (2026-10-27)

This brief replaces `DESIGN-BRIEF.md` (v2) for anything visual. v2 still decides the plumbing: Supabase, `en`/`gu`/`hi` routing, enquiries and admin.
Live direction page: https://claude.ai/artifact/RhHhVqCp5ED9ePQ91tPfR4

## 1. Concept: "The Margin" (approved)
Every Safal child writes in a notebook with a red margin line, and that margin fills up with a teacher's ticks, stars and "very good!".
The site is that page: clean ruled paper for reading, and a margin where hand-drawn marks live.
The animated underlines, circles and ticks are the teacher's marks, so the concept and the motion are the same thing.

Mood: bright and youthful, but serious about learning. Main reference: https://21oaks.org (secondary: Ranty, Safal's own social posters).

## 2. Where the motif appears
- A red margin line runs down each section, and the footer ends with a margin band.
- Handwritten notes and ticks sit beside key facts.
- Faint ruled lines sit behind cards and forms.
- A tick draws itself when an enquiry is sent.
- "A day at Safal" is a timetable that gets ticked off as you scroll.

## 3. Colour
The page stays white. Each section gets one bright colour field. Saffron is used only for Apply, and margin red only for marks.

| Token | Light | Dark | Source / use |
|---|---|---|---|
| `--ink` | `#241D5C` | `#F2F0FF` | The logo's chakra. Text and dark bands |
| `--paper` | `#FBFBFE` | `#13112A` | Page ground |
| `--surface` | `#FFFFFF` | `#1C1940` | Cards |
| `--soft` | `#5B5785` | `#B3AFD8` | Secondary text |
| `--line` | `#E3E1F0` | `#2F2B58` | Borders |
| `--rule` | `#DCE5F5` | `#2D2A5A` | Notebook ruled lines |
| `--saffron` | `#EE7A43` | `#F58A55` | The SAFAL tower. **Apply only** |
| `--marigold` | `#F7B928` | `#F8C03E` | The window frames. Main colour field |
| `--sky` | `#4AB3EC` | `#5BBDF1` | The admission posters |
| `--leaf` | `#34B470` | `#43C380` | The front lawn. Success |
| `--pen` | `#E0453F` | `#F06A5F` | The margin line and teacher's marks |

Text on colour fields is always `#241D5C`.

## 4. Type
| Role | Font |
|---|---|
| Headlines | Young Serif 400. Hero 92/0.98, section 58/1.05, card 22–24 |
| Body | Figtree 400–700. 17/1.6 |
| Hand-drawn notes | Caveat 700 |
| Gujarati | Baloo Bhai 2 600–700 |
| Hindi | Baloo 2 600–700 |
| Labels | Figtree 600, 13px, uppercase, 0.14em tracking |

## 5. Motion (from 21oaks)
1. **Hero carousel.** Full-bleed campus photos crossfade every 5 s, with a slow 1.06 → 1 zoom. A thumbnail strip has a marigold progress bar. A glass admissions card floats over the photo.
2. **Card deck.** Std 1–5 / 6–8 / 9–10 / 11–12 cards on a marigold field. They are dealt in from the right with a 110 ms stagger and rest tilted between −5° and 5°. On hover a card straightens and lifts.
3. **Teacher's marks.** SVG strokes draw over about 1.1 s (`pathLength=1` with a dash offset): a squiggle under a key word, a circle around dates, a double underline for the motto, ticks and stars.

Rules: one ease, `cubic-bezier(.2,.7,.2,1)`. Buttons take 0.2 s and reveals take 0.6–1 s. Content is readable before any animation runs. `prefers-reduced-motion` stops all of it.

## 6. Home page order
1. Hero (carousel)
2. Proof in numbers (count-up)
3. Our belief, "Creation of Life Through Education" (underline)
4. Every stage (card deck, medium switch)
5. A day at Safal (timetable ticks)
6. Campus and facilities (sticky photo split)
7. Life and events (photo grid)
8. Parents speak (slow marquee)
9. Admissions in 3 steps (underline, then Apply)
10. Footer (margin line)

Global: a floating pill nav with an always-visible saffron "Apply 2026-27" button, and a sticky Call / WhatsApp / Apply bar on mobile.

## 7. Content status
- **Real:** logo, building render, Yoga Day photos, Std 1–12 in English and Gujarati medium, Science / Commerce / Arts, AI, robotics and cyber-law for Std 1–8, phone 93163 93763, Sector 22 Gandhinagar.
- **Placeholder:** the headline ("Where bright minds learn to bloom"), stage card copy, all numbers and quotes, and photos of classrooms, labs and the library.
- **Expected from the school around 2026-10-29:** a hero photo, 6–10 candid photos, the logo SVG, the founding year, student count and board results.
