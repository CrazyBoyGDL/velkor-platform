from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
BRAND = PUBLIC / "brand"
FAVICONS = PUBLIC / "favicons"

BRAND.mkdir(parents=True, exist_ok=True)
FAVICONS.mkdir(parents=True, exist_ok=True)


COLORS = {
    "dark_bg": "#07101a",
    "dark_panel": "#0b1522",
    "light_bg": "#f4f7fb",
    "light_panel": "#e7edf4",
    "route_dark": "#7f9eb4",
    "route_light": "#284257",
    "muted_dark": "#445f75",
    "muted_light": "#6f8294",
    "core_dark": "#9fc3d4",
    "core_light": "#1d3447",
    "amber": "#b88748",
    "white": "#eef5f9",
    "graphite": "#172433",
}


def symbol_paths(route: str, muted: str, core: str, amber: str, mono: bool = False) -> str:
    accent = core if mono else amber
    return f"""
  <g class="velkor-symbol" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 12H50" stroke="{muted}" stroke-width="2.4" opacity=".62"/>
    <path d="M14 12 23 34 32 52" stroke="{route}" stroke-width="3.3"/>
    <path d="M50 12 41 34 32 52" stroke="{route}" stroke-width="3.3"/>
    <path d="M23 34H41" stroke="{muted}" stroke-width="2.3" opacity=".68"/>
    <path d="M32 20V52" stroke="{muted}" stroke-width="2.2" opacity=".62"/>
    <path d="M32 20 23 34M32 20 41 34" stroke="{route}" stroke-width="2.4" opacity=".82"/>

    <path d="M20.5 27.5 23 34 28.5 31.5" stroke="{accent}" stroke-width="1.55" opacity=".76"/>
    <path d="M43.5 27.5 41 34 35.5 31.5" stroke="{accent}" stroke-width="1.55" opacity=".76"/>
    <path d="M28.8 43.8 32 52 35.2 43.8" stroke="{accent}" stroke-width="1.55" opacity=".72"/>

    <rect x="10.5" y="8.5" width="7" height="7" rx="2" fill="{route}" stroke="none"/>
    <rect x="46.5" y="8.5" width="7" height="7" rx="2" fill="{route}" stroke="none"/>
    <rect x="20" y="31" width="6" height="6" rx="1.6" fill="{route}" stroke="none"/>
    <rect x="38" y="31" width="6" height="6" rx="1.6" fill="{route}" stroke="none"/>
    <rect x="29" y="49" width="6" height="6" rx="1.8" fill="{route}" stroke="none"/>

    <circle cx="32" cy="20" r="7.4" stroke="{core}" stroke-width="2" opacity=".72"/>
    <circle cx="32" cy="20" r="3.1" fill="{core}" stroke="none"/>
    <path d="M25.5 20h-4.8M43.3 20h-4.8" stroke="{accent}" stroke-width="1.5" opacity=".72"/>
    <path d="M18 45h28" stroke="{muted}" stroke-width="1.4" opacity=".34"/>
  </g>"""


def symbol_svg(theme: str, background: bool = False, mono: bool = False) -> str:
    light = theme == "light"
    route = COLORS["route_light"] if light else COLORS["route_dark"]
    muted = COLORS["muted_light"] if light else COLORS["muted_dark"]
    core = COLORS["core_light"] if light else COLORS["core_dark"]
    bg = COLORS["light_bg"] if light else COLORS["dark_bg"]
    panel = COLORS["light_panel"] if light else COLORS["dark_panel"]
    bg_markup = ""
    if background:
        bg_markup = f"""
  <rect width="64" height="64" rx="15" fill="{bg}"/>
  <path d="M10 54h44M10 10h44" stroke="{panel}" stroke-width="1.2" opacity=".75"/>
"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
{bg_markup}{symbol_paths(route, muted, core, COLORS["amber"], mono=mono)}
</svg>
"""


def lockup_svg(theme: str, compact: bool = False, mono: bool = False) -> str:
    light = theme == "light"
    route = COLORS["route_light"] if light else COLORS["route_dark"]
    muted = COLORS["muted_light"] if light else COLORS["muted_dark"]
    core = COLORS["core_light"] if light else COLORS["core_dark"]
    text = COLORS["graphite"] if light else COLORS["white"]
    sub = COLORS["muted_light"] if light else "#6f8497"
    width = 300 if compact else 356
    subtitle = "" if compact else f"""
  <text x="86" y="45" fill="{sub}" font-family="JetBrains Mono, Consolas, monospace" font-size="8.5" font-weight="500" letter-spacing="1.6">INFRASTRUCTURE CONTROL PLANE</text>"""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 64" fill="none">
  <g transform="translate(4 0)">
{symbol_paths(route, muted, core, COLORS["amber"], mono=mono)}
  </g>
  <text x="86" y="30" fill="{text}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22" font-weight="720" letter-spacing=".4">VELKOR SYSTEMS</text>{subtitle}
</svg>
"""


def wordmark_svg(theme: str = "dark", mono: bool = False) -> str:
    light = theme == "light"
    text = COLORS["graphite"] if light else COLORS["white"]
    sub = COLORS["muted_light"] if light else "#6f8497"
    if mono:
        sub = text
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 42" fill="none">
  <text x="0" y="22" fill="{text}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="23" font-weight="740" letter-spacing=".35">VELKOR SYSTEMS</text>
  <text x="2" y="38" fill="{sub}" font-family="JetBrains Mono, Consolas, monospace" font-size="8.5" font-weight="500" letter-spacing="1.5">INFRASTRUCTURE CONTROL PLANE</text>
</svg>
"""


def pinned_tab_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#000" d="M14 9h36v7H14zM14 9l9 25 9 21 9-21 9-25h-7l-7 20-4 10-4-10-7-20z"/>
  <path fill="#000" d="M23 31h18v6H23zM26 20h12v6H26z"/>
</svg>
"""


def write_svg_assets() -> None:
    files = {
        BRAND / "symbol-dark.svg": symbol_svg("dark"),
        BRAND / "symbol-light.svg": symbol_svg("light"),
        BRAND / "symbol-mono.svg": symbol_svg("dark", mono=True),
        BRAND / "logo-dark.svg": lockup_svg("dark"),
        BRAND / "logo-light.svg": lockup_svg("light"),
        BRAND / "logo-compact-dark.svg": lockup_svg("dark", compact=True),
        BRAND / "logo-compact-light.svg": lockup_svg("light", compact=True),
        BRAND / "logo-mono.svg": lockup_svg("dark", mono=True),
        BRAND / "wordmark.svg": wordmark_svg("dark"),
        BRAND / "wordmark-light.svg": wordmark_svg("light"),
        BRAND / "wordmark-mono.svg": wordmark_svg("dark", mono=True),
        FAVICONS / "favicon.svg": symbol_svg("dark", background=True),
        FAVICONS / "pinned-tab.svg": pinned_tab_svg(),
        PUBLIC / "favicon.svg": symbol_svg("dark", background=True),
        PUBLIC / "favicon-white.svg": symbol_svg("light", background=True),
    }
    for path, content in files.items():
        path.write_text(content, encoding="utf-8")


def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def draw_symbol(draw: ImageDraw.ImageDraw, scale: float, offset=(0, 0), dark=True) -> None:
    ox, oy = offset
    route = COLORS["route_dark"] if dark else COLORS["route_light"]
    muted = COLORS["muted_dark"] if dark else COLORS["muted_light"]
    core = COLORS["core_dark"] if dark else COLORS["core_light"]
    amber = COLORS["amber"]

    def p(x, y):
        return (ox + x * scale, oy + y * scale)

    def line(points, color, width, alpha=255):
        rgba = color + f"{alpha:02x}"
        draw.line([p(x, y) for x, y in points], fill=rgba, width=max(1, int(width * scale)), joint="curve")

    line([(14, 12), (50, 12)], muted, 2.4, 170)
    line([(14, 12), (23, 34), (32, 52)], route, 3.5)
    line([(50, 12), (41, 34), (32, 52)], route, 3.5)
    line([(23, 34), (41, 34)], muted, 2.3, 180)
    line([(32, 20), (32, 52)], muted, 2.2, 160)
    line([(32, 20), (23, 34)], route, 2.4, 210)
    line([(32, 20), (41, 34)], route, 2.4, 210)
    line([(20.5, 27.5), (23, 34), (28.5, 31.5)], amber, 1.55, 190)
    line([(43.5, 27.5), (41, 34), (35.5, 31.5)], amber, 1.55, 190)
    line([(28.8, 43.8), (32, 52), (35.2, 43.8)], amber, 1.55, 185)
    line([(18, 45), (46, 45)], muted, 1.4, 90)

    for x, y, w, h in [(10.5, 8.5, 7, 7), (46.5, 8.5, 7, 7), (20, 31, 6, 6), (38, 31, 6, 6), (29, 49, 6, 6)]:
        draw.rounded_rectangle([p(x, y), p(x + w, y + h)], radius=max(2, int(1.8 * scale)), fill=route)

    cx, cy = p(32, 20)
    r = 7.4 * scale
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=core, width=max(1, int(2 * scale)))
    r2 = 3.1 * scale
    draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=core)
    line([(20.7, 20), (25.5, 20)], amber, 1.5, 185)
    line([(38.5, 20), (43.3, 20)], amber, 1.5, 185)


def make_icon(size: int, path: Path, dark=True) -> Image.Image:
    aa = 4
    img = Image.new("RGBA", (size * aa, size * aa), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img, "RGBA")
    bg = COLORS["dark_bg"] if dark else COLORS["light_bg"]
    border = "#152235" if dark else "#d8e0ea"
    r = int(size * aa * 0.22)
    draw.rounded_rectangle([0, 0, size * aa - 1, size * aa - 1], radius=r, fill=bg, outline=border, width=max(1, size * aa // 64))
    draw_symbol(draw, scale=(size * aa) / 64, dark=dark)
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(path)
    return img


def make_png_assets() -> None:
    icon_16 = make_icon(16, FAVICONS / "favicon-16x16.png")
    icon_32 = make_icon(32, FAVICONS / "favicon-32x32.png")
    icon_48 = make_icon(48, FAVICONS / "favicon-48x48.png")
    make_icon(180, FAVICONS / "apple-touch-icon.png")
    make_icon(192, FAVICONS / "android-chrome-192x192.png")
    make_icon(512, FAVICONS / "android-chrome-512x512.png")
    icon_32.save(FAVICONS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon_16, icon_48])

    # Root-level compatibility for older metadata and crawlers.
    make_icon(180, PUBLIC / "apple-touch-icon.png")
    icon_32.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[icon_16, icon_48])


def og_svg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="{COLORS['dark_bg']}"/>
  <path d="M0 520H1200M0 110H1200" stroke="#152235"/>
  <path d="M120 0V630M1080 0V630" stroke="#101b2a"/>
  <path d="M656 154H1008L1076 222V318" stroke="#203448" stroke-width="1.2" opacity=".44"/>
  <path d="M640 492H930L988 434H1092" stroke="#203448" stroke-width="1.2" opacity=".34"/>
  <path d="M706 184H940M706 214H1012M706 244H902" stroke="#17283a" stroke-width="1" opacity=".55"/>
  <g transform="translate(116 122) scale(3.45)">
{symbol_paths(COLORS['route_dark'], COLORS['muted_dark'], COLORS['core_dark'], COLORS['amber'])}
  </g>
  <text x="404" y="246" fill="{COLORS['white']}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="64" font-weight="760" letter-spacing=".6">VELKOR SYSTEMS</text>
  <text x="408" y="300" fill="#8298aa" font-family="JetBrains Mono, Consolas, monospace" font-size="18" font-weight="500" letter-spacing="3">INFRASTRUCTURE CONTROL PLANE</text>
  <text x="408" y="376" fill="#a8b7c4" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" font-weight="520">Gobierno y continuidad para infraestructura critica.</text>
  <path d="M408 424H856" stroke="#23364a" stroke-width="1"/>
  <text x="408" y="468" fill="#b88748" font-family="JetBrains Mono, Consolas, monospace" font-size="17" font-weight="600" letter-spacing="2">VELKOR.COM.MX</text>
</svg>
"""


def make_og_png() -> None:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), COLORS["dark_bg"])
    draw = ImageDraw.Draw(img, "RGBA")
    for x in range(120, w, 120):
        draw.line([(x, 0), (x, h)], fill="#101b2a55", width=1)
    for y in range(70, h, 70):
        draw.line([(0, y), (w, y)], fill="#101b2a55", width=1)
    draw.line([(656, 154), (1008, 154), (1076, 222), (1076, 318)], fill="#20344870", width=2)
    draw.line([(640, 492), (930, 492), (988, 434), (1092, 434)], fill="#20344855", width=2)
    for y, x2 in [(184, 940), (214, 1012), (244, 902)]:
        draw.line([(706, y), (x2, y)], fill="#17283a80", width=1)
    draw_symbol(draw, scale=3.45, offset=(116, 122), dark=True)

    title = load_font("segoeuib.ttf", 64)
    subtitle = load_font("consolab.ttf", 18)
    body = load_font("segoeui.ttf", 28)
    mono = load_font("consolab.ttf", 17)
    draw.text((404, 182), "VELKOR SYSTEMS", font=title, fill=COLORS["white"])
    draw.text((408, 282), "INFRASTRUCTURE CONTROL PLANE", font=subtitle, fill="#8298aa")
    draw.text((408, 352), "Gobierno y continuidad para infraestructura critica.", font=body, fill="#a8b7c4")
    draw.line([(408, 424), (856, 424)], fill="#23364a", width=1)
    draw.text((408, 448), "VELKOR.COM.MX", font=mono, fill=COLORS["amber"])
    img.save(PUBLIC / "og-image.png", optimize=True)


def write_manifest() -> None:
    manifest = """{
  "name": "Velkor Systems",
  "short_name": "Velkor",
  "description": "Infraestructura operacional, gobierno tecnologico y continuidad empresarial.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#07101a",
  "theme_color": "#07101a",
  "icons": [
    {
      "src": "/favicons/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/favicons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
"""
    (PUBLIC / "site.webmanifest").write_text(manifest, encoding="utf-8")


def main() -> None:
    write_svg_assets()
    make_png_assets()
    (BRAND / "og-image-base.svg").write_text(og_svg(), encoding="utf-8")
    make_og_png()
    write_manifest()


if __name__ == "__main__":
    main()
