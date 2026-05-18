from pathlib import Path
import textwrap
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public"
BRAND = PUBLIC / "brand"
FAVICONS = PUBLIC / "favicons"
OG = PUBLIC / "og"

BRAND.mkdir(parents=True, exist_ok=True)
FAVICONS.mkdir(parents=True, exist_ok=True)
OG.mkdir(parents=True, exist_ok=True)


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
    <path d="M12 16H52" stroke="{muted}" stroke-width="2.35" opacity=".58"/>
    <path d="M12 16 23 35 32 52" stroke="{route}" stroke-width="3.55"/>
    <path d="M52 16 41 35 32 52" stroke="{route}" stroke-width="3.55"/>
    <path d="M23 35H41" stroke="{muted}" stroke-width="2.35" opacity=".72"/>
    <path d="M32 24V52" stroke="{muted}" stroke-width="2.15" opacity=".62"/>
    <path d="M23 35 32 24 41 35" stroke="{route}" stroke-width="2.35" opacity=".84"/>
    <path d="M18 45C23.8 49 40.2 49 46 45" stroke="{muted}" stroke-width="1.55" opacity=".42"/>

    <path d="M19.6 28.8 23 35 29.2 32.3" stroke="{accent}" stroke-width="1.55" opacity=".78"/>
    <path d="M44.4 28.8 41 35 34.8 32.3" stroke="{accent}" stroke-width="1.55" opacity=".78"/>
    <path d="M28.7 44.2 32 52 35.3 44.2" stroke="{accent}" stroke-width="1.55" opacity=".72"/>
    <path d="M26.2 24H19.8M44.2 24H37.8" stroke="{accent}" stroke-width="1.35" opacity=".62"/>

    <rect x="8.8" y="12.8" width="7.2" height="7.2" rx="2.1" fill="{route}" stroke="none"/>
    <rect x="48" y="12.8" width="7.2" height="7.2" rx="2.1" fill="{route}" stroke="none"/>
    <rect x="19.8" y="31.8" width="6.4" height="6.4" rx="1.7" fill="{route}" stroke="none"/>
    <rect x="37.8" y="31.8" width="6.4" height="6.4" rx="1.7" fill="{route}" stroke="none"/>
    <rect x="28.8" y="48.8" width="6.4" height="6.4" rx="1.9" fill="{route}" stroke="none"/>

    <circle cx="32" cy="24" r="8.1" stroke="{core}" stroke-width="2.05" opacity=".74"/>
    <circle cx="32" cy="24" r="3.25" fill="{core}" stroke="none"/>
    <path d="M27.8 17.6C29.2 16.4 30.6 15.8 32 15.8C33.4 15.8 34.8 16.4 36.2 17.6" stroke="{core}" stroke-width="1.25" opacity=".55"/>
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


def wrap_for_svg(text: str, width: int = 34) -> list[str]:
    return textwrap.wrap(text, width=width)[:2] or [text]


def draw_wrapped_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, fill: str, max_width: int, line_height: int) -> int:
    x, y = xy
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    for line in lines[:2]:
        draw.text((x, y), line, font=font, fill=fill)
        y += line_height
    return y


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

    line([(12, 16), (52, 16)], muted, 2.35, 150)
    line([(12, 16), (23, 35), (32, 52)], route, 3.55)
    line([(52, 16), (41, 35), (32, 52)], route, 3.55)
    line([(23, 35), (41, 35)], muted, 2.35, 185)
    line([(32, 24), (32, 52)], muted, 2.15, 160)
    line([(23, 35), (32, 24), (41, 35)], route, 2.35, 215)
    line([(18, 45), (25, 49), (39, 49), (46, 45)], muted, 1.55, 105)

    line([(19.6, 28.8), (23, 35), (29.2, 32.3)], amber, 1.55, 200)
    line([(44.4, 28.8), (41, 35), (34.8, 32.3)], amber, 1.55, 200)
    line([(28.7, 44.2), (32, 52), (35.3, 44.2)], amber, 1.55, 185)
    line([(19.8, 24), (26.2, 24)], amber, 1.35, 160)
    line([(37.8, 24), (44.2, 24)], amber, 1.35, 160)

    for x, y, w, h in [(8.8, 12.8, 7.2, 7.2), (48, 12.8, 7.2, 7.2), (19.8, 31.8, 6.4, 6.4), (37.8, 31.8, 6.4, 6.4), (28.8, 48.8, 6.4, 6.4)]:
        draw.rounded_rectangle([p(x, y), p(x + w, y + h)], radius=max(2, int(1.8 * scale)), fill=route)

    cx, cy = p(32, 24)
    r = 8.1 * scale
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=core, width=max(1, int(2 * scale)))
    r2 = 3.25 * scale
    draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=core)
    line([(27.8, 17.6), (30, 15.8), (32, 15.8), (34, 15.8), (36.2, 17.6)], core, 1.25, 140)


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


def og_svg(title="VELKOR SYSTEMS", kicker="INFRASTRUCTURE CONTROL PLANE", body="Gobierno y continuidad para infraestructura critica.", accent=None) -> str:
    accent = accent or COLORS["route_dark"]
    body_lines = wrap_for_svg(body)
    body_markup = "\n".join(
        f'  <tspan x="408" y="{358 + index * 34}">{line}</tspan>'
        for index, line in enumerate(body_lines)
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="{COLORS['dark_bg']}"/>
  <path d="M0 520H1200M0 110H1200" stroke="#152235"/>
  <path d="M120 0V630M1080 0V630M360 0V630M840 0V630" stroke="#101b2a"/>
  <path d="M650 126H1002L1072 196V330" stroke="{accent}" stroke-width="1.2" opacity=".34"/>
  <path d="M650 474H930L994 420H1100" stroke="{accent}" stroke-width="1.2" opacity=".24"/>
  <path d="M702 184H946M702 218H1020M702 252H904" stroke="#17283a" stroke-width="1" opacity=".65"/>
  <rect x="684" y="326" width="384" height="96" rx="12" fill="#0b1522" stroke="#213246" opacity=".8"/>
  <path d="M716 356H838M716 382H930M716 408H884" stroke="{accent}" stroke-width="1.2" opacity=".30"/>
  <g transform="translate(116 122) scale(3.45)">
{symbol_paths(COLORS['route_dark'], COLORS['muted_dark'], COLORS['core_dark'], COLORS['amber'])}
  </g>
  <text x="404" y="238" fill="{COLORS['white']}" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="60" font-weight="760" letter-spacing=".4">{title}</text>
  <text x="408" y="294" fill="#8298aa" font-family="JetBrains Mono, Consolas, monospace" font-size="17" font-weight="500" letter-spacing="2.6">{kicker}</text>
  <text fill="#a8b7c4" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="25" font-weight="520">
{body_markup}
  </text>
  <path d="M408 438H856" stroke="#23364a" stroke-width="1"/>
  <text x="408" y="482" fill="#b88748" font-family="JetBrains Mono, Consolas, monospace" font-size="17" font-weight="600" letter-spacing="2">VELKOR.COM.MX</text>
</svg>
"""


OG_PROFILES = [
    ("home", "VELKOR SYSTEMS", "INFRASTRUCTURE CONTROL PLANE", "Gobierno y continuidad para infraestructura critica.", COLORS["route_dark"]),
    ("servicios", "CAPACIDADES OPERACIONALES", "NETWORK / IDENTITY / VIDEO", "Arquitectura, despliegue y evidencia para entornos en produccion.", "#587694"),
    ("articles", "INTELIGENCIA OPERACIONAL", "FIELD NOTES / GOVERNANCE", "Briefs tecnicos sobre decisiones reales de infraestructura.", "#3f775c"),
    ("evidence", "EVIDENCIA OPERACIONAL", "SANITIZED DEPLOYMENT RECORDS", "Politicas, diffs, rutas y notas de gobierno listas para revision.", "#b88748"),
    ("assessments", "ASSESSMENT OPERACIONAL", "RISK SIGNALS / NEXT ACTIONS", "Lectura ejecutiva de madurez, exposicion y ruta tecnica inicial.", "#638fa9"),
]


def draw_topology_overlay(draw: ImageDraw.ImageDraw, accent: str) -> None:
    for x in range(120, 1200, 120):
        draw.line([(x, 0), (x, 630)], fill="#101b2a55", width=1)
    for y in range(70, 630, 70):
        draw.line([(0, y), (1200, y)], fill="#101b2a55", width=1)

    route_lines = [
        [(650, 126), (1002, 126), (1072, 196), (1072, 330)],
        [(650, 474), (930, 474), (994, 420), (1100, 420)],
        [(690, 190), (760, 190), (828, 248), (950, 248)],
        [(716, 382), (872, 382), (936, 344), (1054, 344)],
    ]
    for points in route_lines:
        draw.line(points, fill=accent + "55", width=2, joint="curve")
        for x, y in points[1:-1]:
            draw.rounded_rectangle([x - 5, y - 5, x + 5, y + 5], radius=3, fill=accent + "88")

    draw.rounded_rectangle([684, 326, 1068, 422], radius=12, fill="#0b1522d6", outline="#213246aa", width=1)
    for y, x2 in [(356, 838), (382, 930), (408, 884)]:
        draw.line([(716, y), (x2, y)], fill=accent + "4d", width=2)
        draw.text((946, y - 9), "policy", font=load_font("consola.ttf", 13), fill="#8298aa88")

    for x, y, label in [(690, 190, "CORE"), (828, 248, "ACL"), (950, 248, "APP"), (936, 344, "ID"), (1072, 330, "OPS")]:
        draw.rounded_rectangle([x - 28, y - 13, x + 28, y + 13], radius=6, fill="#07101aea", outline=accent + "66", width=1)
        draw.text((x - 16, y - 7), label, font=load_font("consolab.ttf", 12), fill="#d7e4eecc")


def make_one_og_png(key: str, title_text: str, kicker: str, body_text: str, accent: str) -> Image.Image:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), COLORS["dark_bg"])
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rectangle([0, 0, w, h], fill=COLORS["dark_bg"])
    draw_topology_overlay(draw, accent)
    draw_symbol(draw, scale=3.45, offset=(116, 122), dark=True)

    title = load_font("segoeuib.ttf", 58)
    subtitle = load_font("consolab.ttf", 18)
    body = load_font("segoeui.ttf", 26)
    mono = load_font("consolab.ttf", 17)
    draw.text((404, 174), title_text, font=title, fill=COLORS["white"])
    draw.text((408, 278), kicker, font=subtitle, fill="#8298aa")
    body_end = draw_wrapped_text(draw, (408, 350), body_text, body, "#a8b7c4", 460, 34)
    rule_y = max(438, body_end + 14)
    draw.line([(408, rule_y), (856, rule_y)], fill="#23364a", width=1)
    draw.text((408, rule_y + 24), "VELKOR.COM.MX", font=mono, fill=COLORS["amber"])
    draw.text((1012, 560), key.upper(), font=mono, fill=accent + "aa")
    return img


def make_og_png() -> None:
    for key, title_text, kicker, body_text, accent in OG_PROFILES:
        img = make_one_og_png(key, title_text, kicker, body_text, accent)
        img.save(OG / f"og-{key}.png", optimize=True)
        (BRAND / f"og-{key}.svg").write_text(og_svg(title_text, kicker, body_text, accent), encoding="utf-8")
        if key == "home":
            img.save(PUBLIC / "og-image.png", optimize=True)


def write_manifest() -> None:
    manifest = """{
  "name": "Velkor Systems",
  "short_name": "Velkor",
  "description": "Infraestructura operacional, gobierno tecnologico y continuidad empresarial.",
  "id": "/",
  "lang": "es-MX",
  "dir": "ltr",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "display_override": ["standalone", "browser"],
  "background_color": "#07101a",
  "theme_color": "#07101a",
  "categories": ["business", "productivity", "security"],
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
