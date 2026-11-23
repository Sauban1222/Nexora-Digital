# Nexora Digital

Nexora Digital is a five-page static digital agency website built with semantic HTML, CSS, and vanilla JavaScript. The project includes responsive page layouts, consistent navigation and footer markup, interactive project filters, FAQs, and a contact form prepared for Netlify Forms.

The portfolio showcases illustrative demonstration concepts. They are not verified client projects.

## Features

- Five pages: Home, About, Services, Portfolio, and Contact.
- Shared responsive navigation with page-aware active states.
- Reusable CSS design system and responsive layouts.
- Portfolio category filters for demonstration concepts.
- FAQ accordions and scroll-reveal animations with reduced-motion support.
- Contact form with client-side validation and a honeypot field.
- Netlify Forms attributes on the contact form; actual delivery requires deployment and verification.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

No frameworks, package manager, or build step are required.

## Project structure

```text
Nexora-Digital/
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── main.js
│   ├── form.js
│   └── animations.js
├── README.md
└── assets/
    ├── images/
    │   ├── E Commerce.png
    │   ├── Expense Tracker.png
    │   ├── Landing page.png
    │   ├── Logo.jpg
    │   ├── Portfolio.png
    │   ├── User Management System.png
    │   └── Buissness.png
    ├── icons/
    │   └── Icon.jpg
    └── fonts/    (currently empty)
```

The Business image currently has a visible stock watermark and is not used in the Portfolio gallery. Review screenshot contents for personal or sample account data before publishing. Git does not retain the empty `icons/` and `fonts/` directories until actual files are added.

## Installation

There are no dependencies to install. Clone or download the repository, then use the local preview instructions below.

## Local preview

From the project root, start Python's built-in static server:

```powershell
py -m http.server 8000
```

If the `py` launcher is unavailable, use `python -m http.server 8000`. Python 3 must be installed for either command. Then open <http://localhost:8000/>. Stop the server with `Ctrl+C`.

The contact form does not deliver messages from a local preview. Avoid opening the pages with a `file://` URL when testing the site.

## GitHub

Create an empty repository on GitHub, then run these commands from the project root, replacing `OWNER` and `REPOSITORY` with the account and repository you created:

```powershell
git init
git add .
git commit -m "Initial Nexora Digital website"
git branch -M main
git remote add origin "https://github.com/OWNER/REPOSITORY.git"
git push -u origin main
```

These are instructions only; this project has not been initialized, committed, or pushed by this setup.

## Netlify deployment

1. Import the GitHub repository into Netlify.
2. Leave the build command empty and set the publish directory to the project root (`.`).
3. Before production, replace every `https://nexora-digital.example` canonical and Open Graph URL in the five HTML files with the verified production origin.
4. Enable Netlify form detection for the site and redeploy so Netlify can detect the form.
5. In the Netlify site dashboard, open **Forms** (or **Site configuration → Forms**) and add an **Email notification** for the `nexora-contact` form to `developersauban12@outlook.com`.
6. Submit a test inquiry on the deployed site and confirm it appears in Netlify Forms and the notification reaches the configured inbox.

The Contact form uses `name="nexora-contact"`, `method="POST"`, `data-netlify="true"`, a matching hidden `form-name` input, and the `bot-field` honeypot. It also submits a client-generated UTC timestamp; Netlify records its own submission timestamp as well. Notification recipients are configured in the Netlify dashboard, not in this repository. The form is prepared for Netlify, but message capture and notification delivery have not been verified on a deployed site.

No `netlify.toml` is required for this static site with no build step or custom routing. No credentials or form-provider keys are stored in the project.

## SEO and production notes

- Each page has a distinct title and description, a canonical URL, and Open Graph title, description, type, URL, site name, and locale metadata.
- The `.example` hostname is reserved for documentation and is only a placeholder. Replace it on every page before deployment; do not publish it as the canonical production domain.
- No Open Graph image is configured because the project does not include a dedicated, approved share image.
- Home and About use remote Unsplash images. They loaded during local browser checks, but require a network connection.
- The CSS font stack names Inter with system fallbacks. No Inter font file is currently included or loaded.
