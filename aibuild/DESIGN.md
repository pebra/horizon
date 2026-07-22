# BeaverKeys — Design System (Landing Page 1b + Product Page 2a)

Source prototype: `BeaverKeys Landing.dc.html` (sections `1b`, `2a`). This doc is the implementation reference for porting these two screens to the live Shopify store.

## Brand palette (CD colors — do not deviate)
- Beige (page background): `#f5eedd`
- Black (primary text): `#0e2524`
- Light green (accent — prices, links, active states): `#399999`
- Dark green (gradient ends, dark section backgrounds, CTA gradient): `#1E5F5C`
- Logo teal (wordmark "keys", badges/highlights on dark backgrounds): `#86cbc8`
- Slight shade variation is allowed for gradients only (see Hero below); never introduce new hues.

Neutral/support tones (unchanged from prototype, used for muted text/borders/panels):
- Muted text: `#9a8c7c`, `#6b6055`, `#4a3d33`, `#3a2a12`
- Panel/card backgrounds: `#eee4c8` (warm beige panel, slightly deeper than page bg)
- Borders: `#ece7de`, `#e3ddd2`
- Sale/clearance link only: `#c0392b` (red, reserved for "Sale" nav item)

**Important constraint:** page background must stay close to `#f5eedd`/white — product photography is pre-shot on this background and will look cut out/mismatched on any materially different background color.

## Typography
- Headings / brand: `Sora`, weights 700–800, tight letter-spacing (`-0.02em` to `-0.03em`)
- Body / UI: `IBM Plex Sans`, weights 400–600
- Load via Google Fonts: `Sora:wght@400;600;700;800` + `IBM Plex Sans:wght@400;500;600`

## Logo / wordmark
- Logo mark: `beaverkeys-logo-with-outer-stroke.png` (or equivalent SVG), ~34–40px square, placed left of wordmark
- Wordmark: "beaver" in `#0e2524`, "keys" in `#86cbc8` (logo teal), `Sora` 800, 24px

## Layout structure (top to bottom)

### Header / Nav (shared across 1b and 2a)
- Sticky-feeling top bar (not scroll-locked in prototype), horizontal padding 56px, vertical 22px
- Left: logo + wordmark
- Center: hover-triggered mega-menu nav, structure mirrors the live store:
  - **Mechanical Keyboards & Parts** (dropdown, 3 columns: Switches / Keyboards / Shop)
  - **Gaming** (dropdown, 1 column)
  - **Sale** (plain link, red `#c0392b`)
  - **More** (dropdown: Contact / About / Updates)
- Mega-menu: white panel, `border-radius:16px`, drop shadow, opens on `mouseenter` of the parent item, closes on `mouseleave`
- Right: search icon, account icon, "Cart (0)" pill button (bg `#0e2524`, white text, `border-radius:24px`)

### Hero (1b only) — cycling offer banner
- Rounded (`24px`) full-width block, `margin: 0 40px`, gradient background, auto-advances every 4.5s, pauses on hover
- 3 slides, each: badge pill, H1 (two lines), subcopy, CTA button, image (product photo, `object-fit: contain` — never crop)
- Slide data shape: `{badge, h1, h2, sub, cta, gradient, image}`
- Gradients (light→dark, teal family, shade varies per slide):
  1. New drop: `linear-gradient(135deg, #86cbc8, #1E5F5C)`
  2. Sale: `linear-gradient(135deg, #a9d9d6, #2d7a77)`
  3. Free shipping: `linear-gradient(135deg, #c5e6e4, #1E5F5C)`
- Controls: prev/next circular arrow buttons (overlaid, semi-transparent white), dot indicators (active dot widens to 22px, `#0e2524`; inactive 8px, `rgba(14,37,36,.3)`)
- CTA button: bg `#0e2524`, text `#86cbc8`

### New Arrivals (1b)
- Section heading + "View all" link, horizontal scroll-snap product rail (`.bk-scroll`)
- Card: square product image (rounded `16px`, drop-shadow product photography, `object-fit: contain`), name (`Sora` 700, 14px, `#0e2524`), price (`#399999`)
- Hover: card lifts `translateY(-4px)`

### Reviews (1b) — dark section
- Full-bleed dark block, bg `#1E5F5C`
- Heading `#86cbc8`, subcopy translucent teal (`rgba(134,203,200,.6)`)
- 3-column grid of review cards: translucent white panel (`rgba(255,255,255,.06)`, `border-radius:16px`), star rating in `#86cbc8`, quote in near-white, name in `#86cbc8`

### Footer (1b)
- Simple row: copyright left, legal links right, muted text `#9a8c7c`

## Product page (2a)
Replaces the old two-column scroll with a **sticky buy panel + tabbed content** pattern.

### Layout: `grid-template-columns: 1fr 420px`
- **Left (gallery):** vertical thumbnail rail (88px squares, active thumbnail gets `#399999` border) + large main image panel (bg `#eee4c8`, `border-radius:20px`, image `object-fit:contain`, ~560px tall)
- **Right (buy panel):** `position: sticky; top: 24px`
  - Vendor label (`#399999`, small caps-style tracking)
  - Title (`Sora` 800, 30px, `#0e2524`)
  - Star rating + review-count link (anchors to `#pdp-reviews`)
  - Price (`Sora` 800, 28px)
  - Color swatches: circular, selected state gets `#399999` ring
  - Switch/variant chips: pill buttons, selected state bg `#0e2524` text `#86cbc8`
  - Quantity stepper (pill, − / qty / +) + "Add to Cart" (gradient `#86cbc8`→`#1E5F5C`, text `#f5eedd`, bold, full width)
  - Secondary "Buy it now" (outline button, border/text `#0e2524`)
  - Trust row (3 icons: shipping / returns / support), muted text below

### Tabs (functional, click to switch — state-driven, not accordion)
Tab labels: **Overview / Specs / Reviews**. Active tab: text `#0e2524`, underline `#399999`. Inactive: `#9a8c7c`, transparent underline.
- **Overview:** short product description + 3×2 grid of feature cards (icon, title, one-line description) on panel bg `#eee4c8`
- **Specs:** key/value table, zebra-striped rows (`#eee4c8` / white)
- **Reviews:** review card(s), anchor target `#pdp-reviews` for the header rating link

### Complete the Build
Same horizontal product rail component as the homepage's New Arrivals, reused as a cross-sell below the tabs.

## Interaction inventory to reproduce
1. Hero: auto-advance timer (4.5s), hover-to-pause, dot nav, prev/next arrows
2. Nav: hover-open mega-menus (one open at a time), closes on mouse leave
3. PDP gallery: click thumbnail → swaps main image, active thumbnail highlighted
4. PDP variant selectors: click color swatch / switch chip → updates selection state, visually highlights choice
5. PDP quantity stepper: +/− buttons, floor of 1
6. PDP tabs: click → swap visible panel, no page reload/accordion — single panel visible at a time
7. Product cards (both homepage rail and PDP cross-sell): hover lift

## Implementation notes for the agent
- All styling in the prototype is inline (Design Component authoring constraint) — a production implementation should extract these into the theme's actual CSS/SCSS system, preserving the exact values above.
- Product imagery must keep its native drop shadow; always use `object-fit: contain` (never `cover`) for hero and gallery images so photos aren't cropped.
- Treat `#f5eedd` as the one true page background across every template section — do not introduce white cards/sections that clash with the product photography's matched background unless clearly a raised panel (use `#eee4c8` for that, never pure white for full-bleed sections).

