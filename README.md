# Santos.Nexus — Interactive MVP Website

A high-fidelity interactive MVP for `santos.nexus` — the umbrella site for the Santos King family of five brands.

## What's inside

A complete, multi-page, 3D-animated website MVP showcasing:

- **Three.js 3D hero** — a central particle orb with 5 brand-colored satellite nodes, mouse-interactive
- **7 fully-built pages** with shared design system
- **Brand-color theming** per page (navy / coral / teal / gold / mint)
- **Animated counters, scroll reveals, mobile nav, working contact form**
- **Zero build step** — pure HTML + CSS + vanilla JS + Three.js (CDN)

## Pages

| Page | File | Description |
|---|---|---|
| Homepage | `index.html` | 3D hero, 6 brand cards, 6 stat tiles, 6 cross-vertical plays, 5-pillar dark section, testimonials, CTA |
| Our Story | `our-story.html` | Vision quote, 5-pillar grid, 9-item timeline (2009-2026), 3 values, 3 signature phrases |
| Santos Travel | `travel.html` | Travel brand with 4 stats, 6 services, 3 featured trips, cross-vertical play |
| TDK Sports | `sports.html` | Sports brand with 4 stats, 6 events (Swimathon, Duskathon, Tour de Kerala, etc.), sponsor CTA |
| Santos Care | `care.html` | Medical tourism with 4 stats, 8 specialties, "why India" stats, recovery-in-Kerala play |
| Santos Nexus | `nexus.html` | Technology with 6 services, 3 differentiators, project CTA |
| DARC Foundation | `darc.html` | Conservation with 6 programmes, 3 ways to support, travel-add-on play |
| Contact | `contact.html` | Form + direct contact + 5 brand-specific contact cards |

## How to preview

### Option 1: Open directly in browser

```bash
# macOS
open index.html
# Linux
xdg-open index.html
# Windows
start index.html
```

### Option 2: Local server (recommended for full experience)

```bash
# Python 3
python3 -m http.server 8000

# Node (if you have npx)
npx serve .

# PHP
php -S localhost:8000
```

Then open <http://localhost:8000> in your browser.

## File structure

```
santos.nexus/
├── index.html              # Homepage
├── our-story.html          # About
├── travel.html             # Santos Travel
├── sports.html             # TDK Sports
├── care.html               # Santos Care
├── nexus.html              # Santos Nexus
├── darc.html               # DARC Foundation
├── contact.html            # Contact
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Design tokens (colors, type, spacing)
│   │   ├── reset.css       # CSS reset + base
│   │   ├── components.css  # Buttons, cards, nav, footer
│   │   └── pages.css       # Hero, brand pages, contact, etc.
│   ├── js/
│   │   ├── main.js         # Common behaviors (nav, reveals, counters, form)
│   │   └── hero-3d.js      # Three.js 3D hero (module)
│   └── img/                # Placeholder for future image assets
└── README.md
```

## Design system

### Brand colors

| Color | Hex | Used for |
|---|---|---|
| Navy | `#0A1F44` | Santos Travel, primary text, nav |
| Coral | `#FF6B35` | TDK Sports |
| Teal | `#00B4D8` | Santos Care |
| Gold | `#F4B400` | Santos Nexus, primary CTAs |
| Mint | `#2A9D8F` | DARC Foundation |

### Typography

- **Inter** — body, headings (Google Fonts)
- **Fraunces** — accent serif for vision quotes (Google Fonts)

### Spacing

4pt base, scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

## 3D Hero details

`assets/js/hero-3d.js` builds a Three.js scene with:

- 1,800-particle cloud on a sphere shell, weighted to brand colors
- 5 satellite nodes (icosahedron spheres) in brand colors, with glow rings
- Connecting lines from center to each satellite
- Inner translucent icosahedron + wireframe overlay
- 600-point background starfield
- Mouse-following rotation, scroll-based tilt, gentle time-based motion
- Falls back to a static gradient if WebGL is unavailable or `prefers-reduced-motion` is set

To swap the hero, replace `assets/js/hero-3d.js` or modify the `BRAND_COLORS` array at the top.

## Performance notes

- 3D hero uses `<canvas>` with `powerPreference: 'high-performance'`
- Pixel ratio capped at 2 to avoid 4K rendering
- Particle count tuned for 60fps on mid-range laptops
- All animations respect `prefers-reduced-motion`

## What is NOT in this MVP (intentionally)

- **No real images** — feature card visuals use brand-colored gradients with a letter mark. Drop real photography into `assets/img/` and update the `.feature-card__visual` to `<img>` tags.
- **No real logos** — the `nav__logo-mark` is a CSS-generated mark. Replace with the real Santos King logo (SVG) when available.
- **No real form submission** — the contact form simulates success client-side. Wire to Formspree, HubSpot, or your CRM of choice.
- **No CMS** — all content is hardcoded in HTML. Migrate to Sanity, Strapi, or a headless CMS when ready.

## Next steps (suggested)

1. **Drop in real photography** for each brand page
2. **Replace the logo mark** with the final Santos King logo
3. **Wire the contact form** to a real backend (Formspree is the fastest)
4. **Add a blog/news section** (currently linked but empty)
5. **Add multilingual content** (EN, HI, ML, AR) using a tool like Weglot
6. **Set up Plausible analytics** (privacy-first, no cookie banner needed)
7. **Deploy** to Vercel, Netlify, or Cloudflare Pages

---

© 2026 Santos King Tours & Travels Pvt. Ltd.
