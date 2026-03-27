# Changelog

## 2026-03-27

- Removed the unused `normalize.css` stylesheet from the site pages and shared template.
- Switched the current meeting artwork to the optimized WebP asset `img/1773826590806.webp`.
- Loaded `fonts.css` with a non-blocking preload pattern on all pages.
- Preloaded `current-meeting.json`, started the homepage meeting fetch immediately, and marked the first meeting image as high-priority.
- Started the events page data loading immediately instead of waiting for `DOMContentLoaded`.

## 2026-03-23

- Removed repeated title text from upcoming event cards when the event title, description, and topic title are identical.
