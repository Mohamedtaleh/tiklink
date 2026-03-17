# Tiklink — TikTok Bulk Downloader Plan

## Context

Med wants to add a Bulk Downloader as a Pro feature on Tiklink.ink. Users paste multiple TikTok URLs (or a @username) and the system resolves all download links in sequence, then lets the user download everything at once. This is the #1 requested feature and the primary upsell for the Pro tier ($5-10/month).

**Architecture decision (from Opus 4.6 analysis):**
Option B — frontend + lightweight API proxy. The backend only fetches tiny JSON metadata (~1KB per video). Videos download directly from TikTok's CDN to the user's browser. Zero bandwidth cost for us.

**Key integration decision:**
Do NOT create a separate Express server. Use Next.js API routes (`/app/api/`) — same infrastructure, same Firebase deployment, no extra VPS cost, same env vars.

**TikTok API decision:**
Reuse `tikwm.com` which already works perfectly for single downloads. No new npm packages needed for TikTok. For username mode, tikwm.com has a user posts endpoint.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/bulk/page.tsx` | Route + SEO metadata (server component) |
| `src/components/bulk-downloader.tsx` | Full client UI component |
| `src/app/api/bulk-resolve/route.ts` | API: resolve single TikTok URL → download link |
| `src/app/api/bulk-user/route.ts` | API: fetch a user's video list |

## Files to Update

| File | Change |
|------|--------|
| `src/components/header.tsx` | Add "Bulk" link under Tools dropdown |
| `src/app/pro/page.tsx` | Add Bulk Downloads as the #1 Pro feature highlight |
| `next-sitemap.config.js` | Add `/bulk` route |

---

## Implementation Details

### 1. API Route — Single URL Resolver
**`src/app/api/bulk-resolve/route.ts`**

```
POST /api/bulk-resolve
Body: { url: string }
Response: { downloadUrl, cover, title, author, duration }
```

Reuse the tikwm.com logic already in `actions.ts`:
```
GET https://www.tikwm.com/api/?url={url}&hd=1
```
Extract: `data.play` (HD video URL), `data.cover`, `data.title`, `data.author.nickname`, `data.duration`

Rate limiting: track requests per IP using a simple in-memory Map with timestamps (no extra package). Free: 10 req/min. No hard enforcement on free users for MVP — rely on the video count cap instead.

### 2. API Route — User Video List
**`src/app/api/bulk-user/route.ts`**

```
POST /api/bulk-user
Body: { username: string, limit: number }
Response: { videos: [{ url, cover, title, author, duration }] }
```

tikwm.com user posts endpoint:
```
GET https://www.tikwm.com/api/user/posts?unique_id={username}&count={limit}&cursor=0
```
Map each video to `{ url: "https://www.tiktok.com/@{username}/video/{id}", cover, title, author, duration }`.

### 3. Page — Route + Metadata
**`src/app/bulk/page.tsx`** (server component)

```typescript
export const metadata = {
  title: 'TikTok Bulk Downloader — Download Multiple Videos | Tiklink',
  description: 'Download multiple TikTok videos at once...',
}
export default function BulkPage() {
  return <BulkDownloader />
}
```

### 4. Client Component — Full UI
**`src/components/bulk-downloader.tsx`**

**Design: match existing Tiklink design system exactly**
- Use Tailwind classes, NOT inline styles (unlike the Opus example)
- Use existing ShadCN components: `Button`, `Textarea`, `Input`, `Progress`
- Colors: `bg-surface`, `border-border`, `text-primary`, `text-secondary`, `text-accent`
- Same card style as `video-info-card.tsx` (bg-surface, border, rounded-xl)

**Component state:**
```typescript
const [mode, setMode] = useState<'urls' | 'username'>('urls')
const [input, setInput] = useState('')
const [videos, setVideos] = useState<BulkVideo[]>([])
const [processing, setProcessing] = useState(false)
const [progress, setProgress] = useState({ done: 0, total: 0 })
const isPro = false // Connect to auth later; localStorage flag for now
```

**BulkVideo type:**
```typescript
type BulkVideoStatus = 'pending' | 'loading' | 'success' | 'error'
interface BulkVideo {
  url: string
  status: BulkVideoStatus
  downloadUrl?: string
  cover?: string
  title?: string
  author?: string
  duration?: number
  error?: string
}
```

**Layout (3 sections):**

```
[Hero]
  "Bulk Downloader"  [PRO badge]
  "Download up to 50 TikTok videos at once"

[Input Card]  bg-surface, border, rounded-xl, p-6
  [Paste URLs] [@ Username]  ← mode toggle tabs

  URL mode:   <Textarea> 6 rows, monospace, one URL per line
  User mode:  <Input> "@username or profile URL"

  Line count / limit indicator
  [Process & Download All] button  ← full width, bg-accent

[Progress Bar]  (visible while processing)
  "Processing 3/10 videos..."
  <Progress value={30} />

[Download All button]  green border, when ≥2 ready

[Video List]
  [VideoCard × N]
    thumbnail (56×72px) | title + @author + duration | [status badge] [↓ Save]
```

**Free / Pro gate:**
- FREE: 3 videos max. Show amber warning: "Free limit: 3 videos • Upgrade to Pro for 50"
- PRO: 50 videos max
- Link to `/pro` for upgrade
- Store `isPro` in localStorage key `tiklink_pro` for now (real Stripe auth later)

**Processing loop:**
```typescript
for (let i = 0; i < urls.length; i++) {
  if (aborted) break
  setStatus(i, 'loading')
  try {
    const res = await fetch('/api/bulk-resolve', { method: 'POST', body: JSON.stringify({ url: urls[i] }) })
    const data = await res.json()
    setStatus(i, 'success', data)
  } catch {
    setStatus(i, 'error')
  }
  await sleep(600) // respect tikwm rate limits
}
```

**Download single:** `<a href={downloadUrl} download target="_blank">`
**Download all:** Loop through ready videos with 400ms stagger between each

**Empty state:** "📦 Paste TikTok URLs above to get started"

---

## Design Reference

Match these existing patterns (read these files before coding):
- `src/components/video-info-card.tsx` — card style, thumbnail layout
- `src/app/pro/page.tsx` — pro badge style, feature card style
- `src/app/youtube/page.tsx` — page layout, hero section pattern
- `src/components/header.tsx` — Tools dropdown — add "Bulk Download" item

Color tokens to use:
- `bg-background` / `bg-surface` / `bg-surface-2`
- `border-border` / `border-border-hover`
- `text-primary` / `text-secondary` / `text-tertiary`
- `text-accent` (indigo) for badges, highlights
- `bg-accent` for primary buttons
- `text-success` / `bg-success/10` for ready state

---

## Free/Pro Gate Logic

```typescript
const MAX_FREE = 3
const MAX_PRO = 50

// On mount, check localStorage
const [isPro] = useState(() =>
  typeof window !== 'undefined' && localStorage.getItem('tiklink_pro') === 'true'
)
const limit = isPro ? MAX_PRO : MAX_FREE
```

When free user exceeds 3:
- Don't crash — just slice URLs to 3
- Show banner: "You're on the free plan (3 videos). Upgrade to Pro to download up to 50 at once."
- Button: "Upgrade to Pro →" linking to `/pro`

---

## Header Update

In `src/components/header.tsx`, add to the Tools dropdown array:
```typescript
{ label: t('nav.toolItems.bulk'), href: '/bulk', description: 'Download multiple videos at once' }
```

Add to all 6 locale files under `nav.toolItems`:
```
bulk: "Bulk Download"  // en
bulk: "Téléchargement en masse"  // fr
bulk: "تحميل متعدد"  // ar
bulk: "Descarga masiva"  // es
bulk: "बल्क डाउनलोड"  // hi
bulk: "Unduh Massal"  // id
```

---

## Pro Page Update

Add to `src/app/pro/page.tsx` as the first/hero feature card:
```
[★ Bulk Downloads]
Download up to 50 TikTok videos at once — by URL or @username.
Perfect for saving collections, archiving creators, or batch processing.
[Try Free (3 videos)] → /bulk
```

---

## Verification

1. Visit `/bulk` — page loads with dark design, matches Tiklink aesthetic
2. Paste 2-3 TikTok URLs → click Process → cards show loading → switch to success with thumbnails
3. Click "↓ Save" on a card → video downloads from TikTok CDN
4. Click "Download All" → multiple videos download sequentially
5. Paste 5 URLs as free user → only 3 processed, banner shows upgrade CTA
6. Enter `@username` → mode switches → fetch button works → videos appear
7. Check `/api/bulk-resolve` directly with Postman/curl → returns JSON
8. Mobile: card layout stacks correctly, buttons accessible
9. `npm run build` → no TypeScript errors
