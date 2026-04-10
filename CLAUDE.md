# Tribes Website & Admin — Next.js Repository

## Project
This repository contains two distinct surfaces that share a single codebase:

1. **Marketing site** (`/`, `/neighbors`, `/partners`, `/feedback`, `/mvp`) — a Next.js 15 recreation of the Tribes landing page originally built with vanilla HTML/CSS/JS on GHL. Pixel-level fidelity with the original is the goal.
2. **Admin panel** (`/admin/*`) — an internal staff tool that replaced a legacy FlutterFlow admin in April 2026. Connects directly to the Tribes Supabase database. See [docs/admin-architecture.md](./docs/admin-architecture.md) before touching anything under `src/app/admin/` or `src/components/admin/`.

## Stack
- **Framework:** Next.js 15.5 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom colors (firefly, granny, casablanca, offwhite, ink)
- **Animations:** CSS @keyframes for hero entrance, framer-motion ScrollReveal for scroll-triggered reveals
- **Font:** Plus Jakarta Sans (via next/font/google) — used for both headings and body
- **Form:** GHL iframe embed (shared `GHLForm` component) on all pages
- **Deployment:** Vercel (auto-deploys from main branch)

## Original Reference
The original HTML/CSS lives at: `../Website/LandingPage/Current/` (index.html, neighbors.html, partners.html, style.css)

Always compare against the original when making visual changes.

## Key Patterns
- **Hero animations:** Pure CSS (`animate-hero-fade-up` class in globals.css), NOT framer-motion — avoids hydration-dependent skip/stutter on mobile
- **Scroll animations:** `ScrollReveal` component (framer-motion `whileInView`) for below-fold content
- **Counter animations:** `useCountUp` hook in `src/hooks/useCountUp.ts` — used by Neighborhood stats and Impact metrics
- **FAQ accordion:** `ClientFAQ` component with mutual exclusivity (one open at a time)
- **iOS safe area:** body bg is `#103730` (firefly green) so iOS safe area matches footer; `#main` has white bg
- **Section backgrounds:** Match original's class system — `section--sage` = `bg-granny`, `section--gray` = `bg-gray-50`, `section--cta` = `bg-firefly`

## Pages
- `/` — Main landing page (14 sections)
- `/neighbors` — For Neighbors sub-page
- `/partners` — For Partners sub-page

## OG Images
Static 1200x630 PNGs in `public/` — one per page (`og-home.png`, `og-neighbors.png`, `og-partners.png`). Generated via `scripts/generate-og.mjs` using sharp. To regenerate: `node scripts/generate-og.mjs` (all) or `node scripts/generate-og.mjs og-home` (single).

## Brand Assets
- **Logo files:** `public/tribes-logo-white.png` (white logo for dark backgrounds), `public/tribes-logo-white.svg`
- **Favicon:** `public/favicon.png` (sourced from `../Marketing/Tribes_Brand_Assets/:Logo/PNG/Fav Icon-2.png`)
- **Source brand assets:** `../Marketing/Tribes_Brand_Assets/` (logos, icons in PNG and SVG)

## Build & Dev
```
npm install
npm run dev    # local dev server
npm run build  # production build
```

---

## Admin Panel (April 2026+)

A mobile-responsive staff admin at `/admin/*` — separate surface from the marketing pages but lives in the same repo and deploys through the same Vercel pipeline.

### Critical things to know before touching it

**Data source**: Supabase (Postgres) is the source of truth. Firebase is used only for FCM push notifications to the mobile app — there is **no Firestore data**, no Storage data, no Firebase Auth. Any instinct to read/write from Firebase is wrong.

**Two Supabase projects in play**:
- `pnlknurdxcduhbtxdefl` — the Tribes data/auth project. All admin queries hit this one.
- `ktboxzgxzbjajngatuho` — a separate CDN project for brand logo images, referenced in `next.config.ts`. Do not query it.

**Auth gate**: three layers. `src/middleware.ts` → `(protected)/layout.tsx` calls `requireAdmin()` → every Server Action and Route Handler calls `requireAdmin()` before touching anything. Never skip any of them. The middleware alone is not sufficient (CVE-2025-29927).

**Two server-side Supabase clients**, and the rule matters:
- `createClient()` from `src/lib/supabase/server.ts` — regular client, respects RLS, carries the admin's JWT. Use for RPCs that check `auth.uid()` internally.
- `createAdminClient()` from `src/lib/supabase/admin.ts` — service role, bypasses RLS. Use for direct writes and RLS-bypass reads. Never import from a client component.

**Every admin mutation writes a row to `public.admin_audit_log`** with a canonical action string. There are ~10 allowed action strings — see the architecture doc for the list.

**Do NOT call `public.delete_want_have`** — it's a vulnerable SECURITY DEFINER RPC with EXECUTE granted to anon. We soft-delete via `UPDATE want_have SET is_deleted = true` through the service role client instead.

**Data quirks that look like bugs but aren't**:
- `user_rattings` table — typo of "ratings", load-bearing (mobile app reads that name).
- `users.is_varify_email` — typo of "verify", load-bearing.
- `chat_rooms.reported_by` is often NULL even when a report exists. Check `reported_by OR reported_reason OR reported_at` when detecting reports.
- `chat_messages` has no `is_deleted` column — message deletion is the ONE intentional hard-delete in the entire admin.
- `projects` table is dead test data — do not build UI for it.

### For everything else

Read [docs/admin-architecture.md](./docs/admin-architecture.md) — has the file structure, client selection rules, RPC inventory (including two deferred security issues), design system (brand colors, typography, animation classes, `<TribesLogo />` component), and a step-by-step recipe for adding a new admin view.

For the data spec (which tables, which mutations are allowed per table), read [docs/admin-backend-contract.md](./docs/admin-backend-contract.md).

### Design language for admin-only code

- Same palette as the marketing site: firefly, casablanca, granny, offwhite, ink
- Same font: Plus Jakarta Sans
- **But lean into extralight (200–300) weights much more heavily** for display numbers and headings — editorial-magazine feel, not marketing polish
- Use the six animation utility classes in `globals.css` (`.admin-fade-up`, `.admin-stagger > *`, `.admin-drawer-anim`, `.admin-overlay-anim`, `.admin-lift`, `.admin-press`) — they all respect `prefers-reduced-motion`
- Use the `<TribesLogo />` component (`src/components/admin/brand/TribesLogo.tsx`) for brand marks — it uses `currentColor` so one component works on any background via `text-*` utilities
- Mobile-first responsive at the `lg:` (1024px) breakpoint — sidebar above, slide-in drawer below
- Touch targets ≥44px everywhere, 48px on inputs, 52px on primary submit buttons
