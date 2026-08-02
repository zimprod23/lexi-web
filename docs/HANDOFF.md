# lexi-web — Handoff

> Everything needed to start work here without reading the other two repos.
> Written 2026-08-02, when the repo contained documentation and nothing else.

---

## What Lexi is, in four sentences

A local-first, offline, desktop legal archive for judicial commissioners
(مفوضين قضائيين) in Morocco and North Africa. It stores case files on the
commissioner's own machine, reads Arabic and French documents with a local AI
model, generates the actes they issue from editable templates, and plans their
signification rounds. It is licensed per machine and activates once, online,
then runs fully offline. It is a paid product sold to a small, identifiable
profession — not a consumer app.

**This repo is its shop window.** Nothing more.

---

## The state of the world around this repo

Everything else is built and running. As of 2026-08-02:

- **The desktop app** is feature-complete for V1 and packaged — a 48 MB NSIS
  installer, with the AI components downloaded after install rather than bundled.
- **The licence server is live**: `https://api.lexiarchive.com`, self-hosted on
  the developer's machine behind a Cloudflare Tunnel, verified end to end.
- **The admin console** runs on `localhost:5173` and is deliberately never
  published.
- **The domain** `lexiarchive.com` is registered at Cloudflare Registrar,
  auto-renewing, with `api.` already pointed at the tunnel.

So this site is not waiting on anything technical. It is the last piece.

---

## Why it is urgent, despite looking like the least technical part

The go-to-market plan is **wide distribution of free trial licences**. That plan
has a hole in it right now: the desktop app's `VITE_LICENSE_REQUEST_URL` is
empty, so the wizard's licence step and the splash screen's activation card
**hide the "request a licence" link entirely**. An office that installs Lexi
without a key has nowhere to go and no instruction on screen.

Until this site exists, handing someone an installer is handing them a dead end.

---

## Decisions already made — do NOT re-ask

| Decision | Why |
|---|---|
| **Netlify, not Vercel** | Vercel's Hobby plan forbids commercial use; Lexi is commercial. Netlify's free plan permits it. Not a technical preference |
| **The console is never published** | It has one user at the machine it runs on. Publishing it puts a licence dashboard on the internet behind only a login form |
| **`api.lexiarchive.com` is the tunnel** | Not this site's backend. Do not repoint that DNS record — it takes the licence server off the air |
| **Installer comes from `lexi-releases`** | Public repo, so a direct asset link works with no token. This is also why the updater can fetch without shipping a credential |
| **Arabic and French, both complete** | The audience reads both. Arabic is the working language even where the legal vocabulary is French |
| **No secrets in this repo** | It is a static bundle. Anything in it is readable by anyone |

---

## The one open decision

**How licence requests arrive.** `docs/API.md` §2 lays out both options. The
short version: Netlify Forms needs no public write endpoint on the licence
server; a custom endpoint means new public attack surface on the machine that
mints licences, plus Turnstile, rate limiting and CORS to get right.

Recommendation is Netlify Forms for V1. Decide before building the form.

---

## Conventions carried over from the other repos

They are worth keeping, because the three codebases are maintained by the same
person and switching between them should not mean switching habits.

- **Comments explain WHY, not WHAT.** The code says what it does.
- **Docs are updated as part of finishing work**, not afterwards and never when
  asked. `PHASES.md` is the tracker; this file is the context.
- **A test that cannot fail is documentation with a green tick.** Less relevant
  on a static site, but if logic appears here (language detection, download URL
  construction), pull it into a plain module and test the rule.
- **CSS logical properties** — `margin-inline-start`, not `margin-left`. This is
  what makes RTL work rather than merely not crash.
- **No CDN imports.** Assets are local. Faster on mobile data anyway.

---

## What "done" looks like for V1

A commissioner who has heard of Lexi from a colleague can, on a phone, on mobile
data, in Arabic:

1. understand what it does and that it works without internet,
2. see that it runs on the machine they own,
3. download the installer and check its hash,
4. ask for a trial licence in under a minute,
5. and get a reply that tells them what happens next.

That is the whole product for this repo. Resist adding to it.

---

## First session

```
Read CLAUDE.md and docs/PHASES.md. Tell me what phase we're in and what's next.
```

Phase 0 is a set of decisions, not code. Make them, write the reasons into
`PHASES.md`, and only then scaffold — the stack choice is downstream of "works
on a bad phone connection", not of what the other repos happen to use.
