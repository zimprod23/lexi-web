# lexi-web — Build Phases

> Update this file as tasks are completed. Claude Code reads it every session.
> Current phase is the first one with incomplete items.

---

## Status Key
- `[ ]` not started
- `[x]` done
- `[~]` in progress

---

## CURRENT STATUS (2026-08-02)

**Nothing is built.** The repo holds documentation only. `docs/DESIGN.md` is
being written separately by the user and is the input Phase 1 waits on.

**Why this exists now:** `VITE_LICENSE_REQUEST_URL` in the desktop app is empty,
so the wizard's licence step and the splash screen's activation card hide the
"request a licence" link entirely (`utils/externalLink.safeExternalUrl` only
honours `http(s)`, and an unset value renders nothing). An office that installs
Lexi without a key currently has **nowhere to go**. Until this site exists, no
trial licence can sensibly be distributed — and wide trial distribution is the
whole go-to-market plan.

---

## Phase 0 — Decide the shape  `[~]`

- [x] Repo created, docs seeded.
- [ ] **`docs/DESIGN.md`** — user-authored. Blocks Phase 2, not Phase 1.
- [ ] **Pick the stack.** Astro or plain Vite + TS. Decide against the criteria
      in CLAUDE.md (bad mobile connection, RTL, no framework unless it earns
      itself), and write the reason down here. Do not default to React because
      the other repos use it — this site has a download button and a form.
- [ ] **Decide how licence requests are received.** Two options, and the cheap
      one is probably right for V1 — see `docs/API.md` §2. Netlify Forms needs no
      public write endpoint on the licence API at all; a custom endpoint means
      new public attack surface on the server that mints licences. Decide before
      building the form, because it changes what the form posts to.
- [ ] **Decide the language default.** Arabic-first with a French toggle, or
      detect and offer. The audience reads both; the legal vocabulary is French
      but the working language is often Arabic.

## Phase 1 — Scaffold  `[ ]`

- [ ] Project scaffolded with the chosen stack; static build verified.
- [ ] Netlify site connected to the repo, apex + `www` pointed at it from
      Cloudflare DNS. **Leave `api.lexiarchive.com` alone** — that record is the
      tunnel, and repointing it takes the licence server off the air.
- [ ] `dir`/`lang` switching working end to end, with one real RTL page to prove
      the layout flips rather than just the text.
- [ ] Design tokens lifted from the desktop app's `globals.css` so the site and
      the product do not look like different companies.

## Phase 2 — The page  `[ ]`

Waits on `docs/DESIGN.md`.

- [ ] Hero: what Lexi is, in one sentence a commissioner recognises as their own
      problem. Not "AI-powered legal archive" — something closer to "your
      dossiers, searchable, on your own machine, without internet".
- [ ] The three or four things that actually sell it: works fully offline,
      Arabic + French, the tournée sheet, the actes generated from editable
      templates. Written as outcomes, not features.
- [ ] Screenshots. Real ones, from the seeded demo archive — never mocked, and
      never containing a real party's name.
- [ ] Requirements section, honest about the machine needed. The AI features
      want a GPU; the archive does not. Say so, because a commissioner who
      installs it on an old laptop and finds classification slow will blame the
      product.
- [ ] Arabic and French complete. Not machine-translated — the legal vocabulary
      has to be right or it reads as amateur to exactly the audience that
      matters.

## Phase 3 — Download + licence request  `[ ]`

- [ ] **Download button → a specific GitHub Release asset** in `lexi-releases`
      (public, so no token). Never a floating "latest" link: a versioned URL is
      what makes a support conversation possible ("which build do you have?").
- [ ] **SHA-256 published next to the download.** A legal professional installing
      an unsigned-looking .exe from a small vendor should be able to verify it.
- [ ] **Licence request form** — name, office/city, email, phone. Nothing more.
      No CIN, no address: this site is not where identity is established.
- [ ] **Spam protection: Cloudflare Turnstile.** Free, already in the stack, and
      privacy-preserving (no cookie, no tracking). A public form on a page that
      leads to free licences will be found by bots.
- [ ] Confirmation copy that sets an expectation — "we will reply within X" —
      because a form that says only "thanks" produces a second submission and a
      phone call.

## Phase 4 — Before it is announced  `[ ]`

- [ ] **Set `VITE_LICENSE_REQUEST_URL`** in the desktop app's root `.env` to the
      request page, and rebuild. Until this happens the in-app link stays hidden
      and the site cannot be reached from inside the product. **This is the step
      that closes the loop** — easy to forget because the site looks finished.
- [ ] Lighthouse pass on a throttled mobile profile, not on desktop broadband.
- [ ] Both languages proofread by someone who works in the profession.
- [ ] A legal-notice / contact page if Moroccan e-commerce rules require one
      once money is involved. Check before charging, not after.

---

## Backlog / later

- [ ] Pricing page (once pricing exists).
- [ ] Online purchase. Needs a payment processor and changes the compliance
      picture entirely — deliberately out of scope until trials convert.
- [ ] A short demo video, hosted locally rather than embedded from YouTube.
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
