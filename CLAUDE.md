# Stadtzauber Hildesheim — Website

## Project Overview
Static single-page website for **Stadtzauber Hildesheim**, a breakfast & brunch cafe at Osterstraße 41-44, 31134 Hildesheim (Ostertorpassage). No frameworks, no build tools — open `index.html` directly in a browser.

## File Structure
```
Cafe Le Garcon/
├── index.html      — All HTML markup. Single page, 7 sections.
├── style.css       — All styles. CSS custom properties at :root. ~600 lines.
├── script.js       — Vanilla JS. Single IIFE. No dependencies.
├── CLAUDE.md       — This file.
└── images/
    ├── hero.jpg        — Hero section background (food spread)
    ├── about.jpg       — About section portrait image (interior)
    ├── gallery-1.jpg   — Gallery: cafe atmosphere (professional photo)
    ├── gallery-2.jpg   — Gallery: tiramisu dessert
    ├── gallery-3.jpg   — Gallery: waffles
    ├── gallery-4.jpg   — Gallery: food plate
    ├── gallery-5.jpg   — Gallery: interior seating (professional photo)
    └── gallery-6.jpg   — Gallery: exterior listing shot
```

## Cafe Details (verify before editing)
| Field | Value |
|-------|-------|
| Name | Stadtzauber Hildesheim |
| Tagline | Breakfast · Coffee · Brunch |
| Address | Osterstraße 41–44, 31134 Hildesheim (Ostertorpassage) |
| Phone | +49 5121 6967496 |
| WhatsApp | https://wa.me/0491777289380 |
| Instagram | https://www.instagram.com/stadtzauber_hildesheim/ |
| Facebook | https://www.facebook.com/61567407352078/ |
| Google Rating | 4.7 / 5 (141 reviews) |
| Weekday Hours | Mon–Fri 08:30 – 16:30 |
| Weekend Hours | Sat–Sun 09:00 – 16:00 |

## Design System

### Color Tokens (in style.css `:root`, lines ~1–25)
| Variable | Hex | Use |
|---|---|---|
| `--color-espresso` | `#2C1810` | Headings, footer background |
| `--color-coffee` | `#6B3A2A` | Primary brand, buttons, accents |
| `--color-latte` | `#C4956A` | Secondary accent, label text |
| `--color-cream` | `#F5ECD7` | Alternate section backgrounds |
| `--color-milk` | `#FDF8F0` | Default page background |
| `--color-foam` | `#FEFCF8` | Card backgrounds, navbar (scrolled) |
| `--color-text-dark` | `#1A1008` | Primary body text |
| `--color-text-mid` | `#5C4033` | Secondary text, descriptions |
| `--color-border` | `#E8DDD0` | Dividers, card borders |
| `--color-whatsapp` | `#25D366` | WhatsApp button |

### Fonts
- **Display/Headings:** Playfair Display (Google Fonts — serif, elegant)
- **Body/UI:** Inter (Google Fonts — clean sans-serif)

## Section IDs
| ID | Section |
|----|---------|
| `#hero` | Full-viewport hero with background image |
| `#about` | Two-column: story text + photo |
| `#menu` | Tabbed menu: Kaffee / Frühstück / Desserts |
| `#gallery` | CSS grid photo gallery (8 images) |
| `#hours` | Opening hours with live open/closed indicator |
| `#contact` | Address, phone, WhatsApp + Google Maps embed |
| `#footer` | Logo, nav links, social icons, copyright |

## How to Update

### Change colors
Edit the CSS variables in `style.css` inside the `:root` block at the top of the file.

### Add a menu item
1. Open `index.html` and find the relevant `<div id="tab-coffee/breakfast/desserts">` section.
2. Copy an existing `<article class="menu-card">` block.
3. Update the icon (emoji), title, description, and price.

### Replace a gallery image
Replace the file in `images/` with the same filename, or update the `src=""` attribute on the corresponding `<img>` in the `.gallery-grid`. The `onerror` handler will show a warm gradient if the image fails to load.

### Update opening hours
Two places must be updated together:
1. **index.html** — Find `<section id="hours">` and update the `.hours-card__time` text values.
2. **script.js** — Find `HOURS_WEEKDAY` and `HOURS_WEEKEND` constants at the top of the file and update the `[openHour, openMinute, closeHour, closeMinute]` arrays.

### Update contact details
Edit the relevant `<a>`, `<address>`, or text in `<section id="contact">` in `index.html`.

### Regenerate Google Maps embed
1. Go to https://maps.google.com and search "Stadtzauber Hildesheim"
2. Click Share → Embed a map
3. Copy the `src="..."` value from the `<iframe>` code
4. Replace the `src` attribute on the `<iframe>` in `#contact` section

### WhatsApp number
The number appears in three places in `index.html` (contact section, footer, float button) and the `href="https://wa.me/..."` values must all be updated. Also update `aria-label` text if needed.

## JavaScript Features (script.js)
| Function | What it does |
|---|---|
| `initNavbar()` | Adds `.scrolled` class to navbar when scrollY > 80px (transparent → opaque) |
| `initSmoothScroll()` | Smooth scrolling for all `<a href="#...">` links with navbar offset |
| `initActiveNavLinks()` | Highlights active nav link via IntersectionObserver on sections |
| `initRevealAnimations()` | Fades in `.reveal` elements as they enter the viewport |
| `initMobileMenu()` | Hamburger toggle, overlay close, Escape key close |
| `initMenuTabs()` | Tab switching with ARIA support and arrow key navigation |
| `initWhatsAppButton()` | Delays WhatsApp button appearance by 1.5s, then pulse animation |
| `initHoursIndicator()` | Shows live "Jetzt geöffnet / Geschlossen" badge in hours section |
| `initHeroParallax()` | Subtle parallax on hero background image (desktop only) |

## Known Constraints
- Zero external JavaScript libraries or CSS frameworks
- No build tools — open index.html directly
- All images are stored locally in `images/` — if you add new images, download them locally
- Images use `onerror` fallback: broken images show a warm CSS gradient automatically
- The `images/gallery-1.jpg` and `images/gallery-5.jpg` are professional photos by Frank Menzel / Osterstrasse-Ostertor Quartiersgemeinschaft

## Image Credits
- gallery-1.jpg, gallery-5.jpg: © Frank Menzel / Osterstrasse und Ostertor Quartiersgemeinschaft Hildesheim
- Other images: sourced from restaurantguru.com and restaurantlist.de listings
