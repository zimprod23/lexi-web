# lexi-web — API Contracts

> What this site needs from the outside world. Read `docs/PHASES.md` first.

**The headline: for V1, this site needs no API at all.** Both jobs — offering
the installer and receiving a licence request — can be done without a single
call to the licence server. That is worth preserving, because every public
endpoint added to `lexi-admin` is new attack surface on the machine that mints
and revokes every licence the business sells.

Nothing below is implemented. This is a contract to design against, not a
description of something that exists.

---

## 1. The installer download — GitHub Releases, no API

`zimprod23/lexi-releases` is a **public** repo, deliberately, so the updater can
fetch without a token in the binary. That makes its release assets directly
linkable:

```
https://github.com/zimprod23/lexi-releases/releases/download/v0.1.0/lexi_0.1.0_x64-setup.exe
```

**Link a specific version, never a moving "latest".** A versioned URL is what
makes a support conversation possible — "which build do you have?" has an answer.
It also means the page cannot silently start serving a release nobody tested.

Publish the **SHA-256** next to the link. A commissioner installing a .exe from
a small vendor should be able to check what they got, and it costs nothing:

```bash
# what to publish, generated at release time
sha256sum lexi_0.1.0_x64-setup.exe
```

### If a "latest version" indicator is wanted later

GitHub's own unauthenticated API answers it, with no involvement from
`lexi-admin`:

```
GET https://api.github.com/repos/zimprod23/lexi-releases/releases/latest
→ { "tag_name": "v0.1.0", "assets": [ { "name": "...", "browser_download_url": "..." } ] }
```

Rate-limited to 60 requests/hour per IP unauthenticated. Fine for a landing
page; **cache the result at build time** rather than calling it per visitor, or a
busy day silently starts showing nothing.

---

## 2. Licence requests — two options, pick before building the form

This is the one real decision in this document.

### Option A — Netlify Forms *(recommended for V1)*

Add `data-netlify="true"` to the form. Netlify captures submissions, emails
them, and shows them in its dashboard. Free tier covers 100 submissions/month.

- **No public write endpoint on the licence API.** Nothing new is exposed on the
  machine that runs Keygen.
- No backend code, no CORS, no rate limiting to get right.
- Cost: submissions live in Netlify rather than the client registry, so issuing
  a licence means copying details into the admin console by hand.

At the volume where that copying becomes annoying, you have enough customers to
justify Option B — and enough information to design it properly.

### Option B — a public endpoint on `lexi-admin` *(later)*

Writes straight into the client registry so a request becomes a licence in one
step.

```http
POST https://api.lexiarchive.com/api/public/license-requests
Content-Type: application/json

{
  "name": "Ahmed El Idrissi",
  "office": "Casablanca — Anfa",
  "email": "…",
  "phone": "+212…",
  "kind": "trial",              // trial | purchase
  "turnstile_token": "…"        // Cloudflare Turnstile, verified server-side
}
```

```json
201 { "status": "received", "reference": "REQ-2026-0001" }
```

**What it must have before it ships**, none of it optional:

- **Turnstile verified server-side.** A token the client claims is valid is not
  a check. Free, already in the stack, no cookies.
- **Rate limited per IP and per email**, reusing `core/rate_limit.py` and the
  `CF-Connecting-IP` resolution already in place.
- **CORS allowing exactly `https://lexiarchive.com`.** The existing
  `ScopedCORSMiddleware` denies CORS on `/api/app/*`; a `/api/public/*` scope
  needs its own rule, not a widening of the admin one.
- **Its own table**, not `clients`. A request is not a customer until someone
  approves it, and mixing the two makes "who is actually paying" unanswerable.
- **No licence issued automatically.** A human decides. Automatic issuance on a
  public form is a free-licence faucet with a URL.

**Do not implement Option B just because it is tidier.** It moves a form
submission from Netlify's problem to your licence server's problem.

---

## 3. What this site must never call

| Endpoint | Why not |
|---|---|
| `/api/auth/*` | admin login. Nothing public has business touching it |
| `/api/licenses`, `/api/clients`, `/api/products` | JWT-only admin surface |
| `/api/app/validate`, `/api/app/revalidate` | the **desktop client's** path. CORS is denied there on purpose: a native app sends no `Origin`, and answering a preflight would let a hostile page grind licence keys through visitors' browsers |

If a task here seems to need one of these, the feature belongs in the admin
console, not on a public page.

---

## 4. Config this site consumes

Everything is public by definition — it ships in a static bundle that anyone can
read. Nothing secret may be added.

| Variable | Example | Notes |
|---|---|---|
| `PUBLIC_DOWNLOAD_URL` | `https://github.com/.../lexi_0.1.0_x64-setup.exe` | versioned, never "latest" |
| `PUBLIC_DOWNLOAD_SHA256` | `a1b2c3…` | shown next to the link |
| `PUBLIC_APP_VERSION` | `0.1.0` | keep in step with the download |
| `PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAA…` | the *site* key is public; the secret key is not and never appears here |

---

## 5. The link back into the product

The desktop app has `VITE_LICENSE_REQUEST_URL` (root `.env`, baked in by Vite at
build time). It is where the setup wizard's licence step and the splash screen's
activation card send an office that has no key.

**It is currently empty**, so those links are hidden entirely — `safeExternalUrl`
honours only `http(s)` and renders nothing for an unset value.

Once the request page exists:

```
VITE_LICENSE_REQUEST_URL=https://lexiarchive.com/licence
```

then **rebuild the desktop app** — Vite bakes it in, so a running app will not
pick it up. Easy to forget, because the website looks finished at that point
while the product still cannot reach it.
