# Changelog

## [Unreleased]

### Fixed
- Fixed missing `startDate` critical error and `endDate` warning in Schema.org `Event` structured data on `index.html` for Google Rich Results / Search Console.
- Synchronized static `Event` schema with the current October 16, 2026 meeting (GraphTools by Marco Kleinert, 18:30–21:30 CEST).
- Enhanced `scripts/validate-seo.js` to automatically assert required `startDate` and recommended `endDate` on all `Event` structured data blocks.

## [3.2.0] - 2026-10-15

### Added
- Implemented complete design system consolidation and architecture improvements:
  - Added `--bg-surface`, `--border-color`, and `--card-border` tokens across `:root` and `[data-theme="dark"]`, resolving transparent theme toggle styling.
  - Added `.hero-header-subpage` modifier (38vh) across all subpages (`events.html`, `impressum.html`, and `ressourcen/*.html`).
  - Added alternating section backgrounds (`.section-alt`) on `events.html` for card contrast.
  - Added `white-space: pre-line` to `.topic-description` for clean multi-line event descriptions.
  - Added global inline code styling (`p code, li code, td code`) and overflow protection for `.terminal-content`.
- Standardized `img/psugh_social.webp` (1200×630px) as high-resolution OpenGraph and Twitter social share banner across all 11 HTML pages.
- Added font preloads for Inter 400 and Inter 700 to `impressum.html` and `scripts/_template.html`.

### Changed
- Standardized German ISO 8601 Monday week start for Event-Kalender on `events.html` (`Mo, Di, Mi, Do, Fr, Sa, So`).
- Harmonized card systems: consolidated `.event-card` and `.resource-card`, unified borders with `--card-border`, and removed redundant duplicate selectors.
- Harmonized `.event-link` with the `.btn` design token system and improved dark mode hover contrast.
- Corrected 1%–3% opacity artifacts on mobile navigation, hamburger button, calendar container, and LinkedIn partner links.
- Cleaned focus states: removed legacy mouse-click `:focus` outlines while retaining clean 3px `:focus-visible` accessibility rings.
- Streamlined `css/fonts.css` from 436 lines of redundant subset duplicates to 7 clean `@font-face` definitions.
- Removed 12 orphaned `Roboto-*.ttf` font files (~2.1 MB) from `fonts/`.
- Consolidated 6 scattered `@media (max-width: 768px)` blocks and merged `prefers-reduced-motion` blocks into unified media queries.
- Updated all terminal code examples from legacy `meeting-data.json` to real `current-meeting.json` URL.
- Prefixed icon paths in `site.webmanifest` with leading `/` for reliable resolution across subdirectories.
- Updated logo links in `index.html` and `impressum.html` to relative root (`/`).
- Centered `.about-content` on `index.html` (`margin: 0 auto;`).
- Renamed `scripts/New-ResourceArticel.ps1` to `scripts/New-ResourceArticle.ps1`, fixed project root path traversal, and cleaned indentation cascading in `scripts/Update-ArticleNavigation.ps1`.

- Scheduled Marco Kleinert's GraphTools session ("GraphTools: Zero-Dependency Microsoft Graph REST Engine") as current meeting for October 16, 2026.
- Archived Andreas Nick's ZeroPortal session ("MSIX-Publishing mit Zero Portal", September 18, 2026) and Christian Ritter's PSScriptAnalyzer session ("Besser Skripten mit dem PSScriptAnalyzer", August 14, 2026) to past events.
- Archived Peter Klaffehn's M365 Security/Maester session (July 17, 2026) to past events.
- Scheduled Christian Ritter's PSScriptAnalyzer session ("Besser Skripten mit dem PSScriptAnalyzer") as current meeting for August 14, 2026.
- Archived the June 19th social event ("Bier, Kicker & PowerShell-Talks") to past events list.
- Rescheduled Peter Klaffehn's Maester session to July 17, 2026.
- Postponed the Azure Automation Runbook Secret Rotation session to a later date.
- Refactored `events.html` JavaScript to consolidate network fetches, loading all three JSON data files in parallel only once at the page level.
- Combined next meeting details with upcoming events on `events.html` to display the next meeting within the "Kommende Treffen" list.
- Improved color contrast of the terminal window (body background, header background, title text, command text, and prompt prefix) to fully comply with WCAG 2.1 AAA accessibility contrast requirements.
- Added default underlines to all links nested inside paragraph text (`p a`) to satisfy WCAG 2.1 link recognition accessibility guidelines.
- Separated the access code and copy button from the 'Online teilnehmen' anchor link in the hero section to fix illegal nesting of interactive content and resolve overlapping touch target issues.
- Increased the size of all copy buttons (`.copy-btn`) to `44x44px` to fulfill WCAG mobile touch target size requirements.
- Fixed structured data warning false-positives for `noindex` pages (such as `impressum.html`) in the SEO validator.
- Refactored `validate-seo.js` to dynamically scan the `ressourcen/` directory for article pages, ensuring `erroractionpreference.html` and any future resources are automatically validated without manual list updates.
- Updated article generator `New-ResourceArticel.ps1` to remove instructions for manual updates to the SEO validator.

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
