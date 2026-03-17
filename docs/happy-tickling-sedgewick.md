# Tiklink Redesign — Master Plan

## Context

Tiklink.ink is a TikTok video downloader that grew to 400-500 daily users organically. The current site is cluttered — 8 tools on the homepage, flashy badges, popups, mega-menus. The redesign transforms it into a premium, designer-grade multi-platform video downloader inspired by how Claude.ai, Linear, and Vercel design their products: restrained, typographic, spacious, elegant. The clean UI itself becomes the competitive moat against ad-ridden competitors.

---

## Phase 0: Design System (THE FOUNDATION)

This phase defines the entire visual identity. Every component, page, and interaction derives from these decisions.

### 0.1 — New Color Palette
**File:** `src/app/globals.css` (complete rewrite of CSS variables)

Replace the current bright TikTok blue (#29ABE2) / orange (#FF9933) with a sophisticated, muted palette:

```
DARK MODE (default):
  --background:    #0A0A0B     (near-black, not pure black)
  --surface:       #141415     (cards, elevated surfaces)
  --surface-2:     #1E1E20     (secondary surfaces, hover states)
  --border:        #27272A     (very subtle zinc borders)
  --border-hover:  #3F3F46     (border on hover)
  --text-primary:  #FAFAFA     (headings, important text)
  --text-secondary:#A1A1AA     (body text, descriptions)
  --text-tertiary: #71717A     (hints, timestamps, labels)
  --accent:        #6366F1     (indigo — modern, premium feel)
  --accent-hover:  #818CF8     (lighter indigo on hover)
  --accent-muted:  #6366F1/10  (accent backgrounds, 10% opacity)
  --success:       #22C55E     (download complete, positive)
  --glow:          #6366F1/20  (subtle accent glow)

LIGHT MODE:
  --background:    #FAFAFA
  --surface:       #FFFFFF
  --surface-2:     #F4F4F5
  --border:        #E4E4E7
  --text-primary:  #09090B
  --text-secondary:#52525B
  --text-tertiary: #A1A1AA
  --accent:        #6366F1
```

Why indigo: It's neutral enough for a multi-platform tool (not tied to any one social platform), modern (Linear, Framer, Raycast all use indigo/purple tones), and it pops beautifully on dark backgrounds.

### 0.2 — Typography System
**Files:** `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.ts`

Replace Space Grotesk + Inter with a more refined pairing:

**Option: Keep Inter but use it better**
- Inter is already excellent (used by Linear, Vercel, GitHub). The issue isn't the font — it's how it's used.
- Remove Space Grotesk entirely. Use Inter for everything with weight variation.
- Headlines: Inter Semi-Bold (600) or Bold (700), with tight letter-spacing (-0.02em)
- Body: Inter Regular (400), with relaxed line-height (1.6)
- Labels/UI: Inter Medium (500), with wide letter-spacing (0.05em), uppercase, small

**Type Scale (mobile → desktop):**
```
Hero heading:     text-4xl → text-6xl    (36px → 60px), font-semibold, tracking-tight
Section heading:  text-2xl → text-3xl    (24px → 30px), font-semibold, tracking-tight
Card heading:     text-lg → text-xl      (18px → 20px), font-medium
Body:             text-base              (16px), text-secondary, leading-relaxed
Small/Label:      text-xs                (12px), text-tertiary, uppercase, tracking-widest, font-medium
```

### 0.3 — Spacing & Layout Philosophy
- **Max content width:** 1080px (not 1280px — tighter feels more editorial)
- **Section padding:** py-24 on desktop, py-16 on mobile
- **Card padding:** p-6 consistently
- **Generous whitespace** — let elements breathe, no cramming
- **No decorative icons in navigation** — text only, weight and color create hierarchy
- **Border radius:** 12px for cards, 10px for buttons, 8px for inputs (slightly less rounded = more mature)

### 0.4 — Component Design Language

**Input Field (the hero element):**
```
- Height: 56px (tall, commanding)
- Background: surface color with 1px border
- Border: subtle zinc, transitions to accent on focus
- No inner shadow, no gradient
- Placeholder: text-tertiary, "Paste a video link..."
- On focus: border-accent + subtle outer glow (0 0 0 3px accent/10)
- Platform icon appears inside the input (left side) when URL is detected
- Submit button: solid accent background, white text, right-aligned inside input
```

**Buttons:**
```
Primary:    bg-accent text-white, hover:bg-accent-hover, subtle shadow
Secondary:  bg-surface-2 text-primary, hover:bg-border
Ghost:      transparent, hover:bg-surface-2
            All: font-medium, h-10, px-4, rounded-[10px], transition-all duration-150
```

**Cards:**
```
- bg-surface, border border-border, rounded-xl
- No shadows by default (flat design, depth via background contrast)
- Hover: border-border-hover transition
- No gradients on cards
```

**Navigation:**
```
- Text-only links, no icons in main nav
- font-medium text-secondary, hover:text-primary
- Active state: text-primary
- Minimal dropdown: bg-surface, border, 8px padding, rounded-xl
- No mega-menu, no badges, no gradients
```

### 0.5 — Background & Ambient Effects
**File:** `src/app/globals.css`

- Subtle dot grid pattern on homepage background (very low opacity, 5%)
- Radial gradient glow behind the hero input (accent color, large blur, 5-8% opacity)
- NO: floating animations, shimmer effects, pulsing glows, gradient borders
- The page should feel still and confident, not busy

### 0.6 — Micro-Interactions
- Button hover: slight scale(1.01) + color shift, 150ms ease
- Input focus: border color transition + glow, 200ms ease
- Page transitions: fade-in on mount, 300ms
- Download button: subtle pulse once when download is ready
- Platform icon: fade-in when detected, 200ms
- Everything else: just color/opacity transitions, no transforms

### 0.7 — Remove All Current "Premium" Effects
**Delete from globals.css:**
- `.animate-float`, `.animate-pulse-glow`, `.animate-shimmer`, `.animate-gradient`
- `.glass`, `.glass-strong` (no glassmorphism)
- `.text-gradient`, `.text-gradient-animated` (no gradient text)
- `.shadow-premium`, `.shadow-premium-lg`, `.shadow-premium-xl`
- `.glow-primary`, `.glow-accent`
- `.bg-gradient-hero-light`, `.bg-gradient-hero-dark`
- `.border-gradient`

These are the hallmarks of template/generic design. Replace with the subtle, confident effects described above.

---

## Phase 1: Homepage Redesign

### 1.1 — New Homepage Structure
**File:** `src/app/page.tsx` (complete rewrite)

The page has 3 sections max. No scrolling required to use the core feature.

**Section 1: Hero (above the fold, centered)**
```
[header]

              Tiklink
    Download any video, instantly.

    No watermark. No signup. No nonsense.

    [====================================]
    [ Paste a video link...    [Download]]
    [====================================]

    TikTok  ·  Instagram  ·  YouTube  ·  Twitter  ·  Facebook

[/header area]
```
- "Tiklink" as a subtle label in text-tertiary, uppercase, letter-spaced
- Main heading: text-5xl/6xl, font-semibold, tracking-tight, text-primary
- Subheading: text-lg, text-secondary, max-w-md, centered
- Platform names as plain text with dot separators, text-tertiary, text-sm
- NO platform icons/logos — just clean text
- The input is the visual focal point (largest, most prominent element)

**Section 2: How It Works (minimal, below fold)**
```
    How it works

    1               2               3
    Paste           Download        Done
    Copy any        Choose your     Video saved
    video URL       quality         to your device
```
- 3-column grid, each with a number (large, text-accent), title (font-medium), description (text-secondary, text-sm)
- No icons. Numbers are the visual element.
- Section heading: text-2xl, font-semibold, centered, mb-12

**Section 3: Tools Teaser (subtle)**
```
    More tools

    [AI Captions]     [Hashtag Generator]     [Video to MP3]
     Generate viral     Trending tags for       Extract audio
     captions with AI   any niche               from any video
                                                              →
```
- 3 cards, bg-surface, border, rounded-xl, p-6
- Title: font-medium, text-primary
- Description: text-sm, text-secondary
- Each links to /captions, /hashtags, /mp3
- Small "Explore tools →" link at bottom right, text-accent

**That's it.** No testimonials, no stats, no newsletter, no blog teaser.

### 1.2 — New Header
**File:** `src/components/header.tsx` (complete rewrite)

```
[Logo]          Download    Tools    Pro         [Lang] [Theme]
```

- Logo: clean wordmark "tiklink" or existing SVG, links to /
- **Download**: text link to / (active state: text-primary)
- **Tools**: text link that opens a minimal dropdown
  - Dropdown: 3 items (AI Captions, Hashtags, Video to MP3), no icons, just text
  - Each item: title (font-medium) + one-line description (text-sm text-tertiary)
- **Pro**: text link to /pro with a small "Soon" text badge (text-xs, text-accent)
- Language switcher: compact, just 2-letter codes (EN, FR, AR...)
- Theme toggle: simple sun/moon icon, no label
- **Mobile**: hamburger opens a clean sheet with the same items, no banners, no badges
- Header height: h-16 (not h-20)
- On scroll: add border-b border-border, bg-background/80 backdrop-blur-sm

### 1.3 — Layout Changes
**File:** `src/app/layout.tsx`

- `defaultTheme="dark"`
- Remove PromoBanner, ScrollProgressCTA, NewsletterPopup
- Remove hero gradient div
- Update metadata:
  - Title: "Tiklink — Download Videos Without Watermark"
  - Description: "Download TikTok, Instagram, YouTube, Twitter and Facebook videos instantly. No watermark, no signup, completely free."
- Keep Google Analytics and AdSense scripts

### 1.4 — New Footer
**File:** `src/components/footer.tsx` (rewrite)

```
tiklink                          Download    Tools       Company
The fastest way to               Home        Captions    About
download social media             Instagram   Hashtags    Blog
videos.                          YouTube     MP3         Contact
                                 Pro                     Privacy
                                                         Terms

                    © 2026 Tiklink. All rights reserved.
```

- 4 columns on desktop, stacked on mobile
- text-sm throughout, text-tertiary for links, hover:text-primary
- Minimal, no decorations, generous vertical spacing
- Subtle border-t border-border at top

---

## Phase 2: Multi-Platform Download Support

### 2.1 — Platform Detection
**New file:** `src/lib/platform-detect.ts`
```typescript
export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'unknown';
// Regex patterns for each platform URL format
```

### 2.2 — Update Types
**File:** `src/lib/types.ts`
- Add `platform: Platform` and `originalUrl: string` to `VideoInfo`

### 2.3 — Multi-Platform Server Actions
**File:** `src/lib/actions.ts` (refactor)

```
getVideoInfo(formData) →
  detectPlatform(url) →
    'tiktok'    → existing tikwm.com logic (keep as-is)
    'instagram' → fetchCobaltVideo(url)
    'youtube'   → fetchCobaltVideo(url)
    'twitter'   → fetchCobaltVideo(url)
    'facebook'  → fetchCobaltVideo(url)
```

New `fetchCobaltVideo(url)` function:
- POST to cobalt.tools API
- Map response to VideoInfo type
- Graceful error handling

### 2.4 — Update Downloader Form
**File:** `src/components/video-downloader-form.tsx`
- Platform auto-detection on input change
- Small platform name appears inside input when detected (e.g., "TikTok" in text-accent, not an icon)
- Accept `defaultPlatform` prop for platform-specific pages

### 2.5 — Update Video Info Card
**File:** `src/components/video-info-card.tsx`

New design matching the design system:
- bg-surface, border, rounded-xl
- Thumbnail on left (rounded-lg, aspect-video)
- Title, author, duration on right
- Platform name as a small label (uppercase, letter-spaced, text-accent)
- Download buttons: Primary (HD) = accent button, Secondary (Audio) = secondary button
- Remove watermarked download button for non-TikTok
- Clean, no badges, no gradients

### 2.6 — Update Image Domains
**File:** `next.config.ts`
- Add: `*.cdninstagram.com`, `i.ytimg.com`, `pbs.twimg.com`

---

## Phase 3: SEO Platform Pages

### 3.1 — Shared Component
**New file:** `src/components/platform-download-page.tsx`
- Reusable layout: heading, description, form (pre-configured), FAQ accordion
- Follows the same design system (no platform-specific colors — keep it unified)

### 3.2 — Pages
**New files:**
- `src/app/instagram/page.tsx` — "Download Instagram Reels — No Watermark | Tiklink"
- `src/app/youtube/page.tsx` — "Download YouTube Shorts — No Watermark | Tiklink"

Each: Server component with metadata + client form component. FAQ section for SEO.

### 3.3 — Locale Strings
**Files:** All 6 locale files in `src/locales/`
- Add platform page titles, descriptions, FAQ translations

---

## Phase 4: Tool Pages & Routes

### 4.1 — Video to MP3
**New file:** `src/app/mp3/page.tsx`
- Same design language as homepage
- URL input → getVideoInfo → prominent "Download MP3" button
- Clean, focused on one action

### 4.2 — Caption Generator
**New file:** `src/app/captions/page.tsx`
- Reuse AI logic from `src/ai/flows/generate-caption.ts`
- Redesigned UI matching new design system
- Clean form: topic input, niche select, tone select → Generate button → results as clean cards

### 4.3 — Hashtag Generator
**New file:** `src/app/hashtags/page.tsx`
- Reuse logic from `src/ai/flows/generate-hashtags.ts`
- Minimal UI: topic input → Generate → hashtag results in a clean grid

### 4.4 — Pro Page
**New file:** `src/app/pro/page.tsx`
- "Coming Soon" with email signup
- Teaser: bulk downloads, no ads, priority speed
- Design: centered, minimal, elegant

### 4.5 — Redirects
**File:** `next.config.ts`
```
/tools/caption-generator → /captions (301)
/tools/hashtag-generator → /hashtags (301)
```

---

## Phase 5: Cleanup & Deletion

### 5.1 — Delete Tool Pages
- `src/app/tools/` (entire directory — all 8 tool pages, layout, hub page)

### 5.2 — Delete Unused AI Flows
- `src/ai/flows/generate-bio.ts`
- `src/ai/flows/predict-viral-score.ts`
- `src/ai/flows/generate-script.ts`
- `src/ai/flows/generate-shareable-caption.ts`

### 5.3 — Delete Viral Components
- `src/components/viral/` (entire directory)
- `src/components/tools/tool-layout.tsx`
- `src/components/tools/share-result-card.tsx`

### 5.4 — Clean globals.css
Remove all old utility classes (glass, gradients, floats, shimmer, premium shadows, glows, patterns, gradient borders). Replace with the new minimal design tokens from Phase 0.

### 5.5 — Update Sitemap
**File:** `next-sitemap.config.js`
- Add: `/instagram`, `/youtube`, `/mp3`, `/captions`, `/hashtags`, `/pro`
- Remove all `/tools/*` routes

### 5.6 — Clean Unused ShadCN Components
Review and remove unused UI components from `src/components/ui/` (calendar, menubar, sidebar, chart, carousel — if not used after cleanup).

---

## Files Summary

### New Files (8)
| File | Purpose |
|------|---------|
| `src/lib/platform-detect.ts` | URL → platform detection |
| `src/app/instagram/page.tsx` | Instagram downloader page |
| `src/app/youtube/page.tsx` | YouTube Shorts downloader page |
| `src/app/mp3/page.tsx` | Video to MP3 converter |
| `src/app/captions/page.tsx` | AI Caption Generator |
| `src/app/hashtags/page.tsx` | Hashtag Generator |
| `src/app/pro/page.tsx` | Pro tier coming soon |
| `src/components/platform-download-page.tsx` | Shared platform page layout |

### Major Rewrites (8)
| File | Change |
|------|--------|
| `src/app/globals.css` | Complete new design system (colors, tokens, effects) |
| `src/app/page.tsx` | Minimal homepage (700 → 200 lines) |
| `src/components/header.tsx` | Text-only 3-item nav |
| `src/components/footer.tsx` | Clean 4-column footer |
| `src/app/layout.tsx` | Dark default, remove clutter, new metadata |
| `src/lib/actions.ts` | Multi-platform routing + cobalt API |
| `src/components/video-downloader-form.tsx` | Platform detection, new design |
| `src/components/video-info-card.tsx` | Platform-aware, new design |

### Minor Updates (3)
| File | Change |
|------|--------|
| `src/lib/types.ts` | Add platform field |
| `next.config.ts` | Image domains + redirects |
| `tailwind.config.ts` | Remove Space Grotesk, clean theme |

### Deletions
- `src/app/tools/` (entire directory)
- `src/ai/flows/generate-bio.ts`, `predict-viral-score.ts`, `generate-script.ts`, `generate-shareable-caption.ts`
- `src/components/viral/` (entire directory)
- `src/components/tools/` (tool-layout.tsx, share-result-card.tsx)

---

## Verification Plan

1. `npm run dev` — no build errors
2. Homepage — clean design renders correctly in dark mode
3. Paste TikTok URL — download works as before
4. Paste Instagram/YouTube URL — platform detected, cobalt download works
5. Visit `/instagram`, `/youtube` — platform pages render with correct metadata
6. Visit `/mp3`, `/captions`, `/hashtags` — tools work
7. Visit `/tools/caption-generator` — 301 redirects to `/captions`
8. Header — 3 items, dropdown works, mobile sheet works
9. Footer — 4 columns, all links work
10. Language switcher — all 6 languages work
11. Theme toggle — dark/light switch works, dark is default
12. `npm run build` — production build succeeds
13. `npm run typecheck` — no TypeScript errors
14. Visual check — no old badges, no gradients, no floating animations, no popups
