# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Keep this file updated. It is the single source of truth for all decisions made.

---

## What Is lexi-web

The **public face of Lexi**: `https://lexiarchive.com`. Two jobs, and only two:

1. **Explain the product** to a Moroccan judicial commissioner (مفوض قضائي) well
   enough that they want to try it.
2. **Get the installer onto their machine, with a licence key**, in as few steps
   as possible.

Everything else — the archive, the licence server, the admin console — lives
elsewhere. This site holds no customer data and no credentials.

**It is not the admin console.** The console (lexi-admin `frontend/`) runs on
`localhost` and is deliberately never published. If a task here starts touching
licences, clients or Keygen, it belongs in the other repo.

---

## Who this is for — wider than the copy currently says

**All legal professionals in Morocco and North Africa**: lawyers (محامون /
avocats), legal consultants, notaries/adouls, and judicial commissioners
(مفوضين قضائيين). Stated 2026-08-04.

Commissioners are the **beachhead, not the ceiling** — the best-converting
segment and the workflow the product was built against, but the site currently
reads as if they are the only audience. Eight strings carry that framing:
`title`, `description`, `eyebrow` and `tagline` in each of `src/i18n/{ar,fr}.ts`.

**How to widen without diluting** — vague copy converts worse than specific copy,
so this is not a find-and-replace:

1. **Lead with what is universal** — an offline archive that reads your Arabic
   and French documents, files them, searches them and answers questions about
   them. That is true for any legal practice.
2. **Name the professions explicitly** rather than saying "legal professionals".
   A lawyer should see their own job title in the first screen.
3. **Present signification as one module**, not as the product. Tournées, محاضر
   and `requis` are real commissioner work and a lawyer will never use them —
   keeping them named accurately is honest, and leading with them is what
   narrows the door.

## The three properties, in order

1. **It works on a bad phone connection.** The audience is a legal professional
   in Morocco, often on mobile data. Static HTML/CSS, no framework unless it
   earns itself, images compressed, no video autoplay. A landing page that takes
   six seconds to paint has already lost the person it was written for.
2. **It reads correctly in Arabic and French.** Same rule as the desktop app:
   Arabic is RTL, and layout must flip, not just text. Arabic is the *primary*
   language of the audience even where the legal vocabulary is French.
3. **It never asks for more than it needs.** A licence request needs a name, an
   office, and a way to reach them. Not an address, not a CIN, not a password.

---

## The three-way split (do not blur it)

| What | Where | Public? |
|---|---|---|
| **This site** | `lexiarchive.com` (Netlify) | **Yes** — that is its purpose |
| Licence API | `api.lexiarchive.com` (Cloudflare Tunnel → dev machine) | Yes, but only `/api/app/*` and `/api/public/*` |
| Admin console | `localhost:5173` | **No** — never published |

The middle row is the only one this site may talk to, and it calls **exactly one
endpoint**: `POST /api/public/license-requests`, the licence-request form
(2026-08-04). Everything else on that host is the desktop client's or the
console's. See `docs/API.md` §3 for the list of paths this site must never call.

**The form still falls back to Netlify Forms, deliberately.** That API is a
tunnel to a workstation and is sometimes off; a licence request is the most
valuable event on this site, so it must not depend on that machine being awake.
Anything other than an outright refusal lets the native submission through.

**The endpoint went live on 2026-08-04** — `lexi-api` was rebuilt, the migration
ran against the live Postgres, and `https://api.lexiarchive.com` now grants CORS
to `https://lexiarchive.com` on the preflight. Which path a given submission took
is invisible from this side; the tell is the reference number, `REQ-YYYY-NNNN`,
which only the API issues. A submission that fell back exists solely in the
Netlify inbox, so check both while the tunnel is not up permanently.

---

## Stack — decided 2026-08-03

**Astro 5, static output, zero client framework.** Reasons in `docs/PHASES.md`
Phase 0; the short version is that Arabic and French are two real URLs built
from one component tree, which a single page with a JS toggle cannot be.

- **Plain CSS with custom properties**, not Tailwind. `src/styles/tokens.css`
  lifts the desktop app's dark scale verbatim and adds the light surfaces this
  repo needs. The tokens *are* the shared system; a utility framework on three
  pages would be a second one.
- **The JavaScript on the page** is a ~20-line IntersectionObserver driving the
  scroll reveal, plus the request form's submit handler. Both degrade: the
  reveal falls back to "everything visible" (the hidden state is applied by a
  class the script itself adds), and the form falls back to its own native
  submission, which is a real Netlify Forms post. **Neither is required for the
  site to do its two jobs**, which is the test any new script has to pass.
- **No React.** A download button and a form do not need it.

### Where things live

```
src/config.ts        release (null until published), site constants, licence API base, Turnstile slot
src/components/RequestForm.astro  the form + its submit handler (API first, Netlify fallback)
src/i18n/ar.ts       Arabic — the canonical dictionary; `Dict` is derived from it
src/i18n/fr.ts       French — typed as `Dict`, so a missing string fails the build
src/styles/tokens.css   design tokens (dark half = the app's, verbatim)
src/styles/global.css   reset, type scale, tiles, buttons, reveal, icon sizing
src/components/Landing.astro   the whole page, once; both routes pass a dictionary
src/pages/index.astro          Arabic at the apex
src/pages/fr/index.astro       French
```

### Four rules, each learned by looking at the rendered page

1. **All icon sizing lives in `global.css`, unscoped.** Astro scopes a
   component's `<style>` to its own elements, so a size written next to the
   markup that *uses* an icon never reaches the `<svg>` inside `Icon.astro`.
   That shipped 200px checkmarks once.
2. **Quantities in Arabic prose must not contain Latin runs.** The bidi
   algorithm rendered `(64-bit)` as `(bit-64)`. Either spell the unit in Arabic
   (preferred — it also reads faster for this audience) or isolate it with the
   `.q` class.
3. **Nothing sticky may be translucent.** A sticky element is in normal flow,
   so at scroll 0 it sits over the *page* background, not over whatever section
   follows it. The nav was navy-at-88% over a cream page and rendered grey until
   you scrolled. Surfaces that overlap on scroll are opaque here.
4. **Anything that slides along the inline axis multiplies by `--flip`.** CSS
   mirrors layout for `dir` but never mirrors `transform`, so an untreated
   `translateX` moves Arabic content against its own reading direction. Same
   token resolves `transform-origin`, which takes no logical keyword.

### Motion

Scroll reveal is one IntersectionObserver in `Base.astro`; everything else is
CSS. Scroll-linked effects (progress rule, nav settle) sit behind
`@supports (animation-timeline: scroll())` — **the guard is load-bearing**, not
politeness: unsupported browsers would run the keyframes on load and show a
full progress bar over an unscrolled page. Every animation is disabled under
`prefers-reduced-motion: reduce`, and none is required to read the page.

Whatever changes, it must stay a static bundle Netlify can serve — no server
runtime, because there is nothing here worth running a server for.

---

## Hosting

**Netlify free tier.** Chosen over Vercel for one specific reason: **Vercel's
Hobby plan forbids commercial use**, and Lexi is a commercial product. Netlify's
free plan permits commercial projects within its limits (100 GB bandwidth, 300
build minutes/month) — far beyond what this site will use.

DNS is Cloudflare (the domain is registered there). Point the apex and `www` at
Netlify; leave `api.` alone — it is the tunnel.

---

## Critical Rules

1. **No secrets, ever.** Everything in a static bundle is readable by anyone who
   opens devtools. If something here needs a credential, the design is wrong.
2. **No analytics that phone home to a third party** without deciding it
   deliberately. The audience is legal professionals; a court-facing tool
   quietly loading trackers is a bad look and possibly a compliance problem.
   Cloudflare Web Analytics (no cookies, already in the stack) is the default
   answer if analytics are wanted.
3. **No CDN imports.** Same rule as the desktop app: assets are local. It also
   happens to be faster on a bad connection.
4. **Arabic first in the markup order** where the page is bilingual, and
   `dir="rtl"` set on the document, not on individual elements.
5. **The installer link must be versioned and verifiable.** Link to a specific
   GitHub Release asset, never a "latest.exe" that silently changes. Publish the
   SHA-256 next to it — a commissioner downloading a legal tool should be able
   to check what they got.

---

## Current Phase

**Phase 3 — the site is built, runs, and is wired to the licence API.** Both
languages, all sections, `astro check` and `npm run build` clean.

**The form was walked end to end in a browser (2026-08-04)**, against a local
admin backend, in both languages, and all three paths were verified rather than
reasoned about:

- API up → `201` → thank-you page, and the row lands in the console's queue with
  Arabic names intact;
- honeypot filled → `400` → the **French** error on the French page, the form
  still filled, and nothing written;
- API killed mid-test → native submit → `/fr/merci/`, i.e. the Netlify inbox.

Still left (see `docs/PHASES.md`): real screenshots, a Netlify deploy + DNS
(**leave `api.` alone — that record is the tunnel**), a phone check, and setting
`VITE_LICENSE_REQUEST_URL` in the desktop app.

The blocking dependency runs the other way from what you would expect: the
desktop app's `VITE_LICENSE_REQUEST_URL` is still empty, which means **an office
that installs Lexi without a key has nowhere to go**. The queue behind this form
now exists; what is missing is the link from the product to the page.

---

## Session Startup

```
Read CLAUDE.md and docs/PHASES.md. Tell me what phase we're in and what's next.
```

---

## Related repos

| Repo | Holds |
|---|---|
| `lexi` | the desktop app (Tauri + FastAPI sidecar) |
| `lexi-admin` | the licence API + admin console |
| `lexi-releases` | **public** — installers + `latest.json` for the updater |
| `lexi-web` | **this** — the public landing page |

`docs/HANDOFF.md` carries the context needed to start without re-reading the
other two repos.
