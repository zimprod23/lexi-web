# lexi-web — Build Phases

> Update this file as tasks are completed. Claude Code reads it every session.
> Current phase is the first one with incomplete items.

---

## Status Key
- `[ ]` not started
- `[x]` done
- `[~]` in progress

---

## CURRENT STATUS (2026-08-04)

**The site is built, runs, and is wired to the licence API.** Both languages,
all sections, `astro check` clean and `npm run build` clean (4 pages). It has
been driven in a browser at desktop width in Arabic **and** French, which is how
the three defects listed under Phase 2 were found — and, on 2026-08-04, how all
three of the form's submission paths were verified against a live backend.

**A licence request is now a row in the client registry**, not a line in a
third-party inbox: the form posts to `POST /api/public/license-requests` and the
admin console issues the licence from it. Netlify Forms stayed on as the
fallback for when that machine is off. See Phase 3.

**Still needed before it can be announced:** real screenshots, a Netlify
deploy + DNS, and `VITE_LICENSE_REQUEST_URL` set in the desktop app. See
Phase 3 and Phase 4.

**Why this exists:** `VITE_LICENSE_REQUEST_URL` in the desktop app is empty,
so the wizard's licence step and the splash screen's activation card hide the
"request a licence" link entirely (`utils/externalLink.safeExternalUrl` only
honours `http(s)`, and an unset value renders nothing). An office that installs
Lexi without a key currently has **nowhere to go**. Until this site is live, no
trial licence can sensibly be distributed — and wide trial distribution is the
whole go-to-market plan.

---

## Phase 0 — Decide the shape  `[x]`

- [x] Repo created, docs seeded.
- [x] **`docs/DESIGN.md`** — user-authored, delivered 2026-08-03. It is an
      analysis of Apple's web design language, not a Lexi brand sheet: a
      **craft** reference (edge-to-edge alternating tiles, one accent, one
      shadow, tight display type, pill CTAs, `scale(0.96)` press) rather than a
      palette. See the colour decision below.
- [x] **Stack: Astro.** Not because the other repos use a framework — they use
      React and this does not. The deciding property is that Arabic and French
      are **two real URLs** (`/` and `/fr/`) built from one component tree. A
      single-page site with a JS language toggle would make a shared link open
      in the wrong language, would make a phone on mobile data download both
      translations, and would break the switch entirely with JS off. Astro emits
      static HTML with **zero JS** except the ~20-line reveal observer, which is
      as close to "no framework" as a bilingual site gets.
- [x] **Styling: plain CSS with custom properties, not Tailwind.** CLAUDE.md
      suggested Tailwind "to match the desktop app's tokens without inventing a
      second system" — but the tokens *are* the system, and they are CSS custom
      properties. `src/styles/tokens.css` lifts the app's dark scale verbatim.
      A utility framework on three pages would be the second system, not the
      cure for one.
- [x] **Licence requests: Netlify Forms** (docs/API.md §2's cheap option). The
      licence API is the machine that mints and revokes every licence; adding a
      public write path to it — plus CORS, rate limiting and abuse handling — to
      collect four fields is the wrong trade. Netlify captures the submission
      with no server of ours in the path at all.
- [x] **Language: Arabic at the apex, French at `/fr/`.** Arabic is the working
      language of the audience, so it is what a shared link opens; French is the
      translation. The reverse of the usual Moroccan-web habit, and deliberate.
- [x] **Colour: Lexi's navy and gold, not `DESIGN.md`'s white and Action Blue.**
      The document's *structure* is followed closely; its palette is not. A
      white-and-blue site for a product that is deep navy and gold would look
      like a different company — the exact failure CLAUDE.md's "lift the tokens"
      rule exists to prevent. Gold needed one adaptation to be legible as text
      on a light surface (`--gold-deep`, ~6.6:1); as a *fill* with navy on top
      it stays the brand gold at ~9:1. One accent, two legible expressions.

## Phase 1 — Scaffold  `[~]`

- [x] Project scaffolded (Astro 5, static output, `trailingSlash: 'always'`);
      `npm run build` verified — 4 pages, CSS inlined, no client framework.
- [x] `dir`/`lang` switching end to end: `<html dir>` is set from the
      dictionary, every layout rule uses logical properties, and the switch is
      a real `<a href>` rather than a toggle. Verified in the browser in both
      languages, not reasoned about.
- [x] Design tokens lifted from the desktop app's `globals.css`
      (`src/styles/tokens.css`), including the mark itself — `Brand.astro`
      reproduces `LexiLogo.tsx` so the icon on the page is the icon in the
      taskbar.
- [ ] Netlify site connected to the repo, apex + `www` pointed at it from
      Cloudflare DNS. **Leave `api.lexiarchive.com` alone** — that record is the
      tunnel, and repointing it takes the licence server off the air.

## Phase 2 — The page  `[~]`

- [x] Hero: "ملفاتك كلها في مكان واحد، على حاسوبك، وبدون إنترنت." No "AI-powered",
      no "archive numérique" — the sentence names the problem, and the words
      "ذكاء اصطناعي" appear nowhere on the page. The feature is described as
      *يقرأ الوثيقة عوضاً عنك*, because that is what it does for them.
- [x] The four things that sell it, written as outcomes: the archive and
      instant search, the document read for you, actes and محاضر already
      filled, the tournée on one sheet.
- [x] Requirements section, honest about the machine: the archive, search,
      actes and tournée run on any recent Windows PC; only automatic reading
      benefits from a GPU, and the page says so rather than letting a
      commissioner blame the product on an old laptop.
- [x] Arabic and French complete, both hand-written. French uses the
      profession's own vocabulary (acte, procès-verbal, signification, requis)
      rather than a literal rendering of the Arabic. `fr.ts` is typed as
      `Dict` (derived from `ar.ts`), so a string added to one language and
      forgotten in the other is a **build error** — the failure mode the
      desktop app hit when every toast stayed French.
- [ ] **Screenshots. Real ones, from the seeded demo archive** — never mocked,
      never a real party's name. `AppFrame.astro` renders its caption in a
      window frame until a `src` is passed; drop PNGs into `public/shots/` and
      nothing else changes. **This is the largest remaining gap** — three
      captioned empty frames are honest but they are not persuasive.

**Motion, and the rule it follows.** Animation carries the page, but not one
line of JavaScript was added for it beyond the original reveal observer:

- Scroll reveal, with directional variants — on side-by-side rows the two
  halves arrive from opposite edges and meet. `transform` is *not* flipped by
  `dir`, so `--flip` (1 / -1) resolves the direction; without it the motion
  would fight the reading direction in Arabic.
- A reading-progress rule, and a nav that earns its background as content
  passes beneath it. Both are CSS **scroll-driven** animations behind
  `@supports (animation-timeline: scroll())`. The guard is not politeness: an
  unsupported browser would otherwise run the keyframes immediately on load and
  show a full progress bar over an unscrolled page.
- The gold rule above each step draws itself from the reading edge outward.
- A slow gold sweep across the *empty* screenshot frames, so three waiting
  frames read as screens rather than holes. It applies only to the placeholder;
  a sheen crawling over a real screenshot would look like a cheap ad.
- Cards lift 3px on hover, and only under `@media (hover: hover)` — deliberately
  smaller than a typical card hover, because these are statements about the
  product, not clickable things, and a card that leaps invites a click that
  leads nowhere.

Every one of them is off under `prefers-reduced-motion: reduce`, and none is
required for the page to be readable.

**Four defects found by running it, none of which a build would have caught:**

- **The nav was grey at rest and only looked right once you scrolled.** A
  sticky header sits in normal flow, so at scroll 0 it occupies its own band
  with the *page* background behind it — not the hero. The page background is
  cream, so `rgba(navy, .88)` rendered grey, then turned navy the moment the
  hero slid underneath. The frosted-glass effect was only ever correct *after*
  scrolling began, which is backwards. The bar is now solid `--bg-0`: it
  disappears into the hero at rest and reads as a top bar over the light tiles.
  `backdrop-filter` went with it — a real GPU cost on the mid-range laptops
  this audience owns, and something the desktop app bans outright.

- The hero's primary call to action rendered **gold on gold — a button with no
  visible text.** `.tile--dark a` is specificity (0,1,1) and beat
  `.btn--primary` at (0,1,0). Fixed with `:not(.btn)`: the rule is about links
  in prose, and a button is not one.
- Check icons rendered at ~200px down the middle of the privacy section. Astro
  scopes a component's `<style>` to its own elements, so `.ticks__icon` written
  in `Landing.astro` never reached the `<svg>` inside `Icon.astro`. All icon
  sizing now lives unscoped in `global.css`, and `Icon.astro` carries a default
  size so the same mistake cannot produce a 200px glyph again.
- **`(64-bit)` rendered as `(bit-64)`** in the Arabic requirements table — the
  bidi algorithm reordering a Latin run inside RTL text, exactly the class of
  bug the desktop app's `Quantity` component exists for. Fixed by removing
  Latin units from the Arabic entirely (`64 بت`, `غيغابايت`), which also reads
  faster for an audience that does not work in IT. French keeps GB.

## Phase 3 — Download + licence request  `[~]`

- [x] **Download button → a specific GitHub Release asset**, built from the tag
      and the asset name in `src/config.ts` rather than stored as a third field
      that could disagree with them. Never a floating "latest".
- [x] **SHA-256 published next to the download**, with the `Get-FileHash`
      command to check it. Both are `direction: ltr; unicode-bidi: isolate` —
      a bidi-reordered hash is a *wrong* hash.
- [x] **`release` is `null` until one is published**, and that is a real state,
      not a placeholder: the section renders a "trial is by request" panel
      instead of a button that 404s. The installer does nothing without a key
      anyway, so the form is the honest route for V1.
- [x] **Licence request form** — name, office/city, email, phone, optional
      message. No CIN, no address. Both languages share one form name so
      submissions land in one inbox, and only the redirect differs so a French
      applicant is not thanked in Arabic.
- [x] **Posts to the licence API** (2026-08-04): `POST /api/public/license-requests`
      on `api.lexiarchive.com`, so a request becomes a row in the client
      registry and the admin console can issue a licence from it directly —
      docs/API.md §2, Option B. **Netlify Forms remains the fallback**, and the
      form is still a real Netlify form: anything other than an outright refusal
      (offline, 5xx, rate limit, JavaScript off) lets the native submission
      through. That API is a tunnel to a workstation, so "the machine was
      asleep" must not be a way to lose a customer.
- [x] Walked end to end in a browser, both languages, all three paths: `201` →
      thank-you page and the row appears in the console; honeypot → the French
      error on the French page with nothing written; API killed → native submit
      to `/fr/merci/`. Needs `connect-src` in `netlify.toml` — without it the
      fetch is blocked and every submission silently takes the fallback.
- [x] Confirmation pages (`/thanks/`, `/fr/merci/`) that set an expectation —
      "within a day or two", what the reply will contain, and where to write if
      it does not arrive.
- [ ] **Cloudflare Turnstile.** A honeypot ships now (`bot-field`, plus
      Netlify's own filtering), which is enough until the page has traffic.
      Turnstile needs a site key minted in the dashboard — `turnstileSiteKey` in
      `src/config.ts` is the slot. **Do not ship the widget without a key**: it
      renders a permanently-failing challenge in front of the one form the
      business depends on.
- [ ] **Create `contact@lexiarchive.com`.** `src/config.ts` already names it and
      it is printed in three places — the form fallback, the footer, and both
      thank-you pages — but **the mailbox does not exist yet**, so every one of
      those is currently a dead end.

      *Receiving* is free and takes five minutes: Cloudflare dashboard → the
      zone → **Email** → Email Routing → forward `contact@` to a real inbox.
      Cloudflare writes the MX and SPF records itself. MX does not conflict with
      the apex/`www` records for Netlify or the `api.` CNAME for the tunnel —
      but if a provider offers to configure DNS "automatically", check what it
      proposes to delete first.

      *Sending* needs an actual mailbox provider, and it matters more than it
      looks: **licence keys are delivered by hand from a person's mailbox**
      (lexi-admin's approve drawer writes the message; a human sends it). A key
      arriving at a law office from a personal `gmail.com` address reads as
      phishing — the worst possible first impression for the one email that has
      to be trusted. Google Workspace (~$6/user/mo) is the no-fiddling answer;
      Zoho's free tier works but replaces Email Routing, since MX can only point
      one way.

      Set **SPF, DKIM and DMARC** on whichever is chosen. A licence key in a
      spam folder is a customer who believes nobody replied, and there is no
      signal on our side that it happened.
- [x] **Brand marks wired** (2026-08-05). Nav and footer use the Seal via
      `Brand.astro`; favicons use the Monogram at tab sizes and the Seal above.
      Assets in `public/brand/`, generated by `lexi/scripts/extract-brand-png.py`.
- [x] **Social card added** — `public/og.png`, generated by
      `scripts/make-og-image.py`. `twitter:card=summary_large_image` had been
      declared with **no image**, so every share of this site previewed as a
      blank card. Deliberately language-neutral: both languages are real URLs,
      and an Arabic card on the French page is worse than no words.
- [ ] **Widen the audience copy** — see CLAUDE.md → "Who this is for". Eight
      strings (`title`, `description`, `eyebrow`, `tagline` × both languages)
      read as if judicial commissioners are the only market. Lead with the
      universal archive, name the professions explicitly, keep signification as
      a named module.

## Phase 4 — Before it is announced  `[ ]`

- [ ] **Set `VITE_LICENSE_REQUEST_URL`** in the desktop app's root `.env` to the
      request page, and rebuild. Until this happens the in-app link stays hidden
      and the site cannot be reached from inside the product. **This is the step
      that closes the loop** — easy to forget because the site looks finished.
- [ ] **Look at it on a real phone.** The layout is fluid (`clamp`) with
      standard breakpoints, but the browser harness used during the build would
      not shrink the viewport, so **mobile has not actually been seen** — and
      most of this audience arrives on a phone. Check the nav (links hide below
      860px, leaving brand + language + CTA), the hero headline at 34px, and
      the Arabic form labels.
- [ ] Lighthouse pass on a throttled mobile profile, not on desktop broadband.
- [ ] Both languages proofread by someone who works in the profession.
- [ ] A legal-notice / contact page if Moroccan e-commerce rules require one
      once money is involved. Check before charging, not after.

---

## Backlog / later

- [ ] Pricing page (once pricing exists).
- [ ] Online purchase. Needs a payment processor and changes the compliance
      picture entirely — deliberately out of scope until trials convert.
- [~] **A short demo video.** `VideoSection.astro` is built and wired; set
      `demoVideo` in `src/config.ts` and drop the file into `public/media/`.
      Self-hosted, never a YouTube embed — an embed breaches the no-CDN rule,
      puts a tracker on a page aimed at legal professionals, and would need the
      CSP in `netlify.toml` widened. `preload="none"` + poster means a phone on
      mobile data pays one image until someone presses play. **Renders nothing
      while `demoVideo` is null** — a "video coming soon" box on a sales page
      reads as an unfinished product, and the page already has three waiting
      screenshot frames. Two minutes, one real dossier end to end, is what the
      copy promises.
- [ ] Changelog page fed from `lexi-releases`.

---

## Decisions already made (do not re-litigate)

- **Netlify, not Vercel.** Vercel's Hobby plan forbids commercial use and Lexi is
  a commercial product; Netlify's free plan permits it. Nothing about the tech
  drove this.
- **The apex is the landing page. The console is not published.** The admin
  console stays on `localhost` — publishing it would put a licence dashboard on
  the internet behind nothing but a login form.
- **`api.lexiarchive.com` is the tunnel to the dev machine.** It is not this
  site's backend, and this site does not need it for V1.
