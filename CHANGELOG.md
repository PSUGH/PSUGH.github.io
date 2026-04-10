# Changelog

## 2026-04-10

- Generated missing `img/hintergrund.webp` from `img/hintergrund.jpg` to fix 404 error.
- Converted all remaining PNG assets (`psugh-logo.png`, `kontakt-sprite.png`, `sqr.png`) to WebP for better performance.
- Optimized and converted `psugh-lego.jpg` to WebP.
- Updated all references to `psugh-logo.png` in HTML and template files to `psugh-logo.webp`.
- Removed obsolete `.png` and `.jpg` (except `hintergrund.jpg` for fallback) files to keep the repository clean.

## 2026-03-27

- Removed the unused `normalize.css` stylesheet from the site pages and shared template.
- Switched the current meeting artwork to the optimized WebP asset `img/1773826590806.webp`.
- Loaded `fonts.css` with a non-blocking preload pattern on all pages.
- Preloaded `current-meeting.json`, started the homepage meeting fetch immediately, and marked the first meeting image as high-priority.
- Started the events page data loading immediately instead of waiting for `DOMContentLoaded`.
- Updated CSS build pipeline: `npm run build` now runs stylelint on source and outputs `css/styles.min.css`; made `stylelint` ignore minified file and relaxed a few strict rules to avoid false positives from Canonical CSS syntax.
- Fixed `scripts/Convert-ToWebP.ps1` to use `img\hintergrund.jpg` as default when `$Source` is empty and to produce friendly error when input file is missing.

## 2026-03-23

- Removed repeated title text from upcoming event cards when the event title, description, and topic title are identical.
