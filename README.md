# Arabelah May Ancheta — Personal Portfolio

A personal portfolio site built from my CV/resume, designed to reflect the
kind of work I actually do: structured data, automation flows, and database
records inside an ERP system (Likha ERP, built on Directus).

**Live site:** https://<your-github-username>.github.io/arabelah-portfolio/

## Design concept

Instead of using a generic "resume website" template, the page is laid out
like the systems I build day to day:

- The **hero section** is rendered as a database record card (`TABLE: users`,
  `record_id · 0001`) with typed fields, similar to how a record looks inside
  Directus' data studio.
- The **Experience** section is rendered as a flow log, with timestamped
  entries and step keys (`step.qa`, `step.erp`, `step.data`, `step.auto`),
  mirroring how automation flows are logged in LikhaERP.
- The **Skills** section is rendered as schema cards (`array[string]`-style
  type annotations) rather than plain bullet lists.
- The **Projects** section uses a "deployment" framing (`BUILD` tags) to tie
  back to the same systems vocabulary.

**Palette:** deep navy (from the original CV), an amber "status: active"
accent, and a teal label color — borrowed from the kind of status indicators
you'd see in an ERP admin panel.

**Type:** Space Grotesk for display headings, JetBrains Mono for
data/labels/timestamps, Inter for body copy.

## Tech stack

Plain **HTML, CSS, and vanilla JavaScript** — no build step, no framework,
so the source is easy to read and the site loads instantly.

- `index.html` — page structure and content
- `style.css` — all styling, organized by component with comments
- `script.js` — active-section nav highlighting (`IntersectionObserver`) and
  a small themed console log
- `assets/profile.png` — profile photo, cropped and masked from the original
  CV image

## Running locally

No build tools required. Either:

```bash
# Option 1: just open it
open index.html

# Option 2: serve it (recommended, avoids any local file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project history / how it was built

This site was built with the help of an AI coding assistant (Claude) based
on my existing CV. The process:

1. Extracted the profile photo from my CV image and processed it (crop +
   circular mask) with Python/Pillow.
2. Planned a visual identity intentionally tied to my actual work (ERP /
   database systems) rather than a generic resume layout.
3. Built the page in plain HTML/CSS/JS.
4. Tested rendering with a headless browser (Playwright) at desktop and
   mobile viewport sizes, then fixed mobile nav spacing.
5. Committed the work with git and published it via GitHub Pages.

See the commit history for the step-by-step progression.

## Contact

- Email: anchetaarabelah@gmail.com
- Phone: +63 956 698 5886
- Location: Santa Fe, Agoo, La Union, Philippines

## License

See [LICENSE](LICENSE).
