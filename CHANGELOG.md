# Changelog

## [Unreleased]

### Added
- Added square modern PWA and apple-touch-icon (`img/psugh-icon.webp`) in WebP format to resolve PWA verification warnings and fix icon squashing on iOS.
- Added preloading for hero background image `img/hintergrund.webp` and minified styles on `index.html`, `events.html`, and `impressum.html` to improve Largest Contentful Paint (LCP) performance.
- Added preloading for JSON data files on `events.html` to load event data as early as possible.

### Changed
- Refactored `events.html` JavaScript to consolidate network fetches, loading all three JSON data files in parallel only once at the page level.
- Combined next meeting details with upcoming events on `events.html` to display the next meeting within the "Kommende Treffen" list.
- Improved color contrast of the terminal window (body background, header background, title text, command text, and prompt prefix) to fully comply with WCAG 2.1 AAA accessibility contrast requirements.
- Added default underlines to all links nested inside paragraph text (`p a`) to satisfy WCAG 2.1 link recognition accessibility guidelines.

## [3.1.0] - 2026-06-16
### Added
- Added June 19th social event ("Bier, Kicker & PowerShell-Talks") with a custom WebP Lego foosball graphic (`img/psugh_social.webp`).
- Kept a copy of the classic Lego foosball graphic as `img/psugh_social_classic.webp`.
- Added new resource page for `$ErrorActionPreference` to improve SEO ranking.
- Added new resource page for Try/Catch basics.
- Added new resource page for `throw`, `Write-Error`, and `Get-Error`.
- Added new resource page for Terminating vs. Non-Terminating Errors.
- Added `scripts/Update-ArticleNavigation.ps1` to dynamically generate "Previous/Next" navigation links across all resource articles based on `index.html`.

### Changed
- Rescheduled the Azure Automation Runbook Secret Rotation session to July 17, 2026.
- Archived Gabriel Köhl's Real-Time Terminal Dashboards session (April 2026) to the past events list.
- Postponed Christian Ritter's PSScriptAnalyzer session to Autumn 2026 in the upcoming events queue.

## 2026-04-10

- Generated missing `img/hintergrund.webp` from `img/hintergrund.jpg` to fix 404 error.
- Converted all remaining PNG assets (`psugh-logo.png`, `kontakt-sprite.png`, `sqr.png`) to WebP for better performance.
- Optimized and converted `psugh-lego.jpg` to WebP.
- Updated all references to `psugh-logo.png` in HTML and template files to `psugh-logo.webp`.
- Removed obsolete `.png` and `.jpg` (except `hintergrund.jpg` for fallback) files to keep the repository clean.
- Added a `validate-images` build script to ensure all images in `/img` are optimized (WebP/SVG/ICO) and integrated it into the `npm run validate` command.
- Fixed `current-meeting.json` preload error by adding `crossorigin="anonymous"` to the link tag in all HTML files.
- Fixed `site.webmanifest` icon issues by explicitly setting `favicon.ico` sizes and updating obsolete `.png` references to `.webp`.
- Renamed the `resources/` directory to `ressourcen/` to fix 404 navigation errors and aligned all internal references (links, canonical tags, and templates).
- Updated `stylelint` to the latest version to resolve deprecated `rimraf` dependencies and modernized `.sr-only` CSS rules.

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
