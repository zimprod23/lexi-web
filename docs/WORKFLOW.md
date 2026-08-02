# lexi-web — Claude Code Workflow Guide

> How to run a session in this repo. Shorter than the equivalents in `lexi` and
> `lexi-admin`, because this repo is smaller and should stay that way.

---

## Start every session with

```
Read CLAUDE.md and docs/PHASES.md. Tell me what phase we're in and what's next.
```

That is enough context. Do not paste the other repos' docs in — `docs/HANDOFF.md`
already carries what is needed from them.

---

## The trap specific to this repo

**A landing page invites scope creep more than any other kind of project.** There
is always one more section, one more animation, one more page. Every one of them
costs load time on a mobile connection in Morocco, which is the single thing the
audience will actually notice.

Before adding anything, ask which of the two jobs it serves — explain the
product, or get the installer onto their machine with a key. If neither, it goes
in the backlog.

---

## Task prompt templates

### Building a section

```
Build the <name> section per docs/DESIGN.md.
Both languages. RTL must flip the layout, not just the text.
No new dependency without saying why it earns its weight.
Show me the rendered result before styling details.
```

### The download button

```
Implement the download button per docs/API.md §1.
Versioned GitHub Release asset, never "latest". Publish the SHA-256 beside it.
Pull the URL and hash from config, not hardcoded in the markup.
```

### The licence request form

```
Implement the request form per docs/API.md §2, option <A|B>.
Fields: name, office/city, email, phone. Nothing more.
Cloudflare Turnstile before anything is accepted.
Confirmation copy must say what happens next and when.
```

---

## What NOT to ask in one prompt

- "Build the whole landing page" — the sections have different content problems
  and the Arabic copy needs care that a bulk pass will not give it.
- "Make it look good" — that is what `docs/DESIGN.md` is for. Without it, the
  result is a generic SaaS page aimed at nobody.
- "Add analytics" — decide the privacy question first (CLAUDE.md rule 2), then
  implement. Not the other way round.

---

## After each task

1. Build and check the **static output**, not just the dev server. Netlify serves
   the build; the dev server hides broken asset paths.
2. Check it in **both languages**, and check that Arabic flipped the layout.
3. Throttle to a slow mobile profile in devtools and look at it again. This is
   the only check that reflects the real audience.
4. Update `docs/PHASES.md` in the same commit as the work.

---

## Debugging

**The page looks right in dev and broken on Netlify**
Almost always an asset path assuming a server root, or a case-sensitivity
difference — Windows does not care about `Logo.svg` vs `logo.svg`, Netlify's
Linux build does.

**Arabic renders but the layout does not flip**
`dir="rtl"` is set on an element instead of the document, or the CSS uses
`margin-left` where it needs `margin-inline-start`.

**The form submits but nothing arrives**
With Netlify Forms, the form must exist in the **built HTML** at deploy time for
Netlify's build step to detect it. A form rendered only at runtime by JavaScript
is invisible to that scan and silently accepts submissions into nowhere.

**The download 404s**
The release asset name changed, or the tag does not exist yet in
`lexi-releases`. The URL is versioned on purpose — it breaks loudly instead of
serving the wrong build.

---

## Before announcing the site

Run through `docs/PHASES.md` Phase 4. The item most easily missed is the last
one that closes the loop: setting `VITE_LICENSE_REQUEST_URL` in the **desktop
app** and rebuilding it. The website being live changes nothing inside the
product until that happens.
