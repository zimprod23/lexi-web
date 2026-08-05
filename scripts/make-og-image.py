"""Generate the social preview image (`public/og.png`).

`Base.astro` declares `twitter:card=summary_large_image` and, until now, no
`og:image` — so every share of this site rendered a blank card. That is the one
piece of the page a person sees *before* deciding whether to click.

Deliberately language-neutral: the mark, the name and the domain, and no
sentence. The site is bilingual over two real URLs, and an Arabic card appearing
for the French page (or the reverse) is worse than no words at all.

Run with any Python that has Pillow — e.g. the desktop app's backend venv:

    ../lexi/backend/venv/Scripts/python scripts/make-og-image.py
"""

from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = ROOT / "public" / "brand" / "seal-dark-256.png"
OUT = ROOT / "public" / "og.png"

# The size every platform crops from rather than to.
SIZE = (1200, 630)

NAVY = (11, 20, 34)          # --bg-0
GOLD = (201, 168, 76)        # --gold
TEXT = (240, 237, 230)       # --text-primary
MUTED = (143, 162, 184)      # --text-secondary

# Georgia is the wordmark's declared fallback in Brand.astro — Cormorant is not
# bundled, so matching the fallback is matching what visitors actually see.
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\georgiab.ttf",
    r"C:\Windows\Fonts\georgia.ttf",
    r"C:\Windows\Fonts\times.ttf",
]


def _font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if pathlib.Path(path).exists():
            return ImageFont.truetype(path, size)
    # Never fail the build over a typeface: a default-font card still previews.
    return ImageFont.load_default()


def main() -> None:
    canvas = Image.new("RGB", SIZE, NAVY)
    draw = ImageDraw.Draw(canvas)

    # A gold rule along the top, echoing the sidebar's gradient edge in the app.
    draw.rectangle([0, 0, SIZE[0], 5], fill=GOLD)

    mark = Image.open(MARK).convert("RGBA").resize((188, 188), Image.LANCZOS)
    canvas.paste(mark, (SIZE[0] // 2 - 94, 150), mark)

    name_font, domain_font = _font(84), _font(30)

    def centered(text: str, font: ImageFont.ImageFont, y: int, fill) -> None:
        left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
        draw.text(((SIZE[0] - (right - left)) // 2 - left, y - top), text,
                  font=font, fill=fill)

    centered("Lexi", name_font, 372, TEXT)
    # Underline, matching the splash screen's wipe.
    draw.rectangle([SIZE[0] // 2 - 62, 478, SIZE[0] // 2 + 62, 481], fill=GOLD)
    centered("lexiarchive.com", domain_font, 512, MUTED)

    canvas.save(OUT, optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
