# Telugu Village Kitchen

Showcase website for **Telugu Village Kitchen**, an Andhra village-style restaurant on Old Mumbai Hwy, Gachibowli, Hyderabad.

Vite + React + Tailwind CSS + GSAP (ScrollTrigger, Flip) + Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run check:contrast   # WCAG AA check of the palette
```

Node 18+ required. Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Folder structure

```
index.html                  meta tags, Open Graph, Restaurant JSON-LD, fonts
public/
  logo.svg                  PLACEHOLDER logo (swap for the real one)
  og.jpg                    share image (final video frame + logo + title)
  media/
    hero-video.mp4          16:9 hero film, compressed to ~1.9 MB
    hero-video-mobile.mp4   9:16 centre crop for phones
    poster.webp             4s frame (woman at the fire), also the fallback image
    gallery/  dishes/       frames and dish close-ups pulled from the film
src/
  data/
    site.json               brand, tagline, contact, hours, socials, reviews, story, gallery, hero cues
    menu.json               Veg Meals ₹130 highlight, dishes for signatures/marquee, Build-Your-Bhojanam layout
  styles/
    tokens.css              PALETTE (CSS variables) + type scale; palette notes at the top
    index.css               all component styles
  lib/                      motion setup (GSAP + Lenis), opening-hours logic, content helpers
  components/               one file per section
scripts/
  prepare-media.sh          rebuild video/poster/gallery from a source video (ffmpeg)
  make-og.cjs               re-render public/og.jpg
  check-contrast.mjs        WCAG contrast check for tokens.css
source-media/
  hero-original.mp4         untouched 18 MB original (not served)
```

## What still needs the owner's input

Search the project for `[CHECK]`, `[OPENING HOURS]` and `"placeholder": true`.

| Item | Where | Why |
| --- | --- | --- |
| Official logo | `public/logo.svg` → see below | `logo.png` wasn't supplied; a placeholder emblem is used |
| Palette | `src/styles/tokens.css` | Uses the brief's fallback palette because the logo wasn't available to sample |
| Andhra Chicken Curry | `src/data/menu.json` | It's in the film and in the Signature/Bhojanam sections, but the listing says "Serves vegetarian dishes". Keep it or delete it |
| Spice levels | `src/data/menu.json` → `spice` (0–3) | Best guesses; adjust |
| Opening hours | `src/data/site.json` → `hours` | Placeholder 12–3:30 pm and 7–10:30 pm daily; drives the Open/Closed badge |
| Social links | `src/data/site.json` → `social` | Instagram/Facebook URLs are `#` |
| Domain | `index.html` | `https://example.com/` in canonical, OG and JSON-LD |
| JSON-LD hours / reservations | `index.html` | Placeholders |

Reviews in `site.json` are the three real Google reviews, quoted verbatim. Don't add any that weren't actually written.

## Swap the logo

1. Put the file in `public/` (e.g. `public/logo.png`; square works best, ≥ 400 px).
2. Set `brand.logo` in `src/data/site.json` to `"/logo.png"`. The loader, navbar, hero, footer and OG image all read it from there.
3. Update the `favicon` link in `index.html`, and the `<img>` in `scripts/og.html`, then run `node scripts/make-og.cjs`.
4. Rebuild the palette from the logo: sample its main, second and smallest/brightest colours, put them in `--c-primary`, `--c-secondary` and `--c-accent` in `src/styles/tokens.css` (OKLCH), tint `--c-bg` from the primary, and run `npm run check:contrast`. If a pair fails, change only the **L** (lightness) value.

## Swap the video

```bash
bash scripts/prepare-media.sh path/to/new-video.mp4
node scripts/make-og.cjs
```

Then retime the overlays in `src/data/site.json` → `hero`:

- `intro.from` / `intro.to`: when the Telugu line shows
- `dishes[].at`: when each dish name slides in
- `dishesOut`: when the dish names leave
- `titleAt`: when the logo, title and tagline reveal

The script also paints out a text artifact in the current film (`CLEAN` at the top of the script). Remove that for a new video. To use a hand-made 9:16 phone cut, replace `public/media/hero-video-mobile.mp4`.

The video plays muted (the "Sound on" button turns audio on). With **Data Saver** on, **reduced motion** set, or if the video fails to load, visitors get the poster image instead.

## Edit the Veg Meals highlight and dishes

The site doesn't have a full menu. The **What we serve** section (`#menu`, `src/components/VegMeal.jsx`) highlights one offer: **Veg Meals, ₹130**.

- To change the price or wording, edit the `veg-meals` item in `src/data/menu.json` (`price`, `name`, `telugu`, `description`).
- To change the photo, the review quote or the item it points to, edit `vegMeal` in the same file.

The other items in `menu.json` are dishes only, with no prices. They feed the Signature Dishes scroller (`"signature": true`), the marquee, and Build-Your-Bhojanam (`bhojanam.steps` sets the order and where each dish sits on the leaf, as % of the leaf). A dish only shows a price when its `price` is a number.

## Edit contact details

Everything is in `src/data/site.json` → `contact`: the phone number (display text and `+91…` format), the WhatsApp number (digits only, with country code), the pre-filled WhatsApp message, the address and the map search query. Also update the matching fields in the JSON-LD in `index.html`.

## Motion and accessibility notes

- Intro loader: under 2 seconds, with a "Skip intro" button.
- `prefers-reduced-motion` gets a calm static version: no smooth scroll, no pinning, the poster image instead of the video, and all text visible.
- Pinned scroll sections (Story, Bhojanam, Signatures) only run at ≥ 900 px wide. Phones get stacked reveals, a swipe sequence and native horizontal scroll.
- Custom cursor only for fine pointers. It's never shown on touch screens.
- One `h1`, a skip link, visible focus rings, keyboard-operable lightbox (Esc / ← / →) and carousel buttons.
