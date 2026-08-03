/**
 * Everything about the site that changes without the design changing.
 *
 * The release block is the important one. CLAUDE.md rule 5: the installer link
 * must be versioned and verifiable -- a specific GitHub Release asset and its
 * SHA-256, never a floating "latest.exe" that silently changes underneath a
 * support conversation.
 *
 * `release` is null until a release actually exists in `lexi-releases`. That is
 * a real state, not a placeholder: the download section renders a "not yet
 * published" panel instead of a button that 404s. A dead download button on the
 * page a customer was sent to is worse than no button at all.
 */

export interface Release {
  /** Tag in zimprod23/lexi-releases, e.g. "v0.1.0". The updater needs it too. */
  version: string;
  /** Exact asset filename, so the page and the release cannot disagree. */
  asset: string;
  /** Lowercase hex SHA-256 of that asset. Printed next to the download. */
  sha256: string;
  /** Human-readable size, shown so nobody starts it blind on mobile data. */
  size: string;
  /** ISO date, rendered per-locale. */
  published: string;
}

/**
 * Set this when the first release is published. Until then the download
 * section explains that the trial is by request, which is the actual V1 route
 * to a working installation anyway -- the installer alone is useless without a
 * licence key.
 */
export const release: Release | null = null;

export interface DemoVideo {
  /** Self-hosted file under public/media/. Never a YouTube embed. */
  src: string;
  /** Poster frame. Shown until play; the video itself downloads nothing. */
  poster: string;
  /** Rendered next to the play button, e.g. "2:10". */
  duration: string;
  /** Optional captions track (VTT) under public/media/. */
  captions?: string;
}

/**
 * The demo video, when one exists.
 *
 * Null renders **nothing** -- not a "coming soon" panel. The page already
 * carries three empty screenshot frames; a fourth empty box promising a video
 * would read as an unfinished site to someone deciding whether to trust the
 * software. One config line turns the section on once the file is in
 * public/media/.
 *
 * Self-hosted deliberately. A YouTube embed would breach the no-CDN rule, load
 * a tracker onto a page aimed at legal professionals, need the CSP in
 * netlify.toml widened, and cost a phone on mobile data far more than the file
 * itself. `preload="none"` means the bytes move only when someone presses play.
 */
export const demoVideo: DemoVideo | null = null;

export const site = {
  domain: 'lexiarchive.com',
  url: 'https://lexiarchive.com',
  /** Where a request lands. Kept here so the form and the copy cannot drift. */
  contactEmail: 'contact@lexiarchive.com',
  releasesRepo: 'https://github.com/zimprod23/lexi-releases',
  /** Netlify form name. Must match the hidden `form-name` input exactly. */
  formName: 'licence-request',
} as const;

/**
 * Cloudflare Turnstile, when it is turned on. Left empty deliberately: a site
 * key has to be minted in the Cloudflare dashboard, and shipping a widget with
 * no key renders a permanently-failing challenge in front of the one form the
 * business depends on. Netlify's honeypot + built-in spam filtering carry V1.
 * The key is public by design (it is in the markup), so it is not a secret.
 */
export const turnstileSiteKey = '';
