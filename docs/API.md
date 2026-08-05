# lexi-web — API Contracts

> What this site needs from the outside world. Read `docs/PHASES.md` first.

**This site calls exactly one endpoint: `POST /api/public/license-requests`.**
That is §2's Option B, built on 2026-08-04. Everything else here — the
installer download, the version indicator — still needs no API at all, and that
is worth keeping: every public endpoint on `lexi-admin` is new attack surface on
the machine that mints and revokes every licence the business sells.

**Netlify Forms did not go away; it became the fallback.** The form is still a
real Netlify form and the JavaScript only intercepts it, so an unreachable API
means a submission captured in the Netlify inbox rather than a lost customer.
That matters here more than it would elsewhere: the API is a Cloudflare Tunnel
to a workstation that is legitimately asleep sometimes. See §2.

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

## 2. Licence requests — the API, with Netlify as the fallback

Built 2026-08-04. This section used to offer two options; the answer is now
**both, in order**, and the order is the interesting part.

### The request

```http
POST https://api.lexiarchive.com/api/public/license-requests
Content-Type: application/json

{
  "name": "Ahmed El Idrissi",
  "office": "Casablanca — Anfa",
  "email": "ahmed@example.ma",
  "phone": "+212…",             // optional
  "message": "…",               // optional
  "lang": "ar",                 // ar | fr — which half of the site
  "bot-field": "",              // the honeypot, posted as the markup names it
  "turnstile_token": "…"        // only when a secret is configured server-side
}
```

```json
201 { "status": "received", "reference": "REQ-2026-0001" }
```

The answer carries **two fields and no more**. A public endpoint that echoed
stored data back would be a way to read the customer registry.

### What the browser does with each outcome

| Outcome | What happens | Why |
|---|---|---|
| `201` | Redirect to the thank-you page | Stored in the registry; it appears in the console's Requests queue |
| `400` | Localised error, form stays filled, **no fallback** | A definite refusal — a bot, or an address that is not an address. Retrying it through Netlify would just move spam into the inbox |
| `429`, `5xx`, offline, DNS, CORS | **Native submit → Netlify Forms** | Us failing, not the visitor. Their request must survive it |
| JavaScript off | Native submit → Netlify Forms | Same path, same reason |

**The fallback is the design, not a hedge.** `api.lexiarchive.com` is a
Cloudflare Tunnel to a workstation; `make off` is a normal thing to run. A
licence request is the single most valuable event on this site, so the one
failure it must not have is "the machine was asleep".

> **The endpoint is live** (`lexi-api` rebuilt 2026-08-04): the public host
> answers `405` to a GET and grants CORS to `https://lexiarchive.com` on the
> preflight. **The way to tell which path a submission took is the reference
> number** — one that reached the API is answered `REQ-YYYY-NNNN` and appears in
> the console's queue; one that fell back exists only in the Netlify inbox. Both
> are worth checking while the tunnel is not up permanently.

### What the endpoint has, all of it load-bearing

- **Its own table** (`license_requests`), not `clients`. A request is an
  unverified stranger who filled in a public form; a client is an office a human
  has looked at. Mixing them makes "who is actually paying" unanswerable.
- **No licence is issued automatically.** A human approves, in the console.
  Automatic issuance on a public form is a free-licence faucet with a URL.
- **Its own CORS scope.** `ScopedCORSMiddleware` grants `PUBLIC_SITE_ORIGINS` on
  `/api/public/*` and the console's `CORS_ORIGINS` everywhere else. The error to
  design against runs one way: adding this site to `CORS_ORIGINS` so the form
  works would also let a script here read the registry out of an admin's browser.
- **A honeypot, an IP rate limit, and a duplicate window.** A resubmission from
  one address inside ten minutes returns the *first* reference instead of writing
  a second row, so a double-click is idempotent.
- **Turnstile, optional and verified server-side.** Unconfigured, the challenge
  is simply not enforced. Configured, an *unreachable* Cloudflare is treated as
  "could not tell" and the submission is accepted — an outage at a third party
  must not cost a customer their request.

### Config this site needs

`PUBLIC_LICENSE_API_URL` overrides the API base (`src/config.ts`), which is only
wanted in local development. It defaults to production, so a deploy that sets
nothing still works.

**`connect-src` in `netlify.toml` names that host.** Without it the browser
blocks the fetch, every submission silently takes the Netlify path, and nothing
anywhere says the API is never being reached.

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
| `PUBLIC_LICENSE_API_URL` | `http://127.0.0.1:8001` | **defaults to `https://api.lexiarchive.com`**; set only for local development. Changing it also means changing `connect-src` in `netlify.toml` |
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
