# Abdul Mannan Butt — Portfolio

A dark, dashboard-styled personal portfolio built as a static site — no build step, no server, no cost to host.

## What's inside
```
portfolio/
├── index.html          → all page content
├── css/style.css        → design tokens + all styling
├── js/script.js         → nav, typing effect, scroll reveals, network diagram
├── js/three-scene.js    → ambient 3D floating-container background (Three.js)
└── assets/
    ├── headshot.jpeg
    ├── hero-photo.jpeg
    └── Abdul_Mannan_Butt_Resume.pdf
```

## Deploy for free on GitHub Pages (always live, $0/month)

1. Create a new GitHub repo, e.g. `abdulmannanbutt.github.io` (using this exact
   pattern gives you a clean URL) — or any repo name you like.
2. Push these files to the repo root:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from branch → `main` / `root`**.
4. Wait ~1 minute. Your site goes live at:
   - `https://<your-username>.github.io/` (if repo is named `<username>.github.io`), or
   - `https://<your-username>.github.io/<repo-name>/` (any other repo name).

No servers, no S3 bill, no maintenance — GitHub hosts static Pages sites for free indefinitely.

## Before you push — 3 things to update

1. **Project links** — the "View Code" / "Live Demo" buttons in the Projects
   section currently point to `#`. Replace them with your real GitHub repo
   URLs (search `href="#"` in `index.html`).
2. **GitHub icon link** — in the hero social icons, `github.com/` is a
   placeholder. Swap in `https://github.com/<your-username>`.
3. **Resume file** — `assets/Abdul_Mannan_Butt_Resume.pdf` is already wired
   up to the "Download Resume" buttons. Replace the file (keep the same
   filename) whenever you update your resume.

## Local preview
Just open `index.html` in a browser, or run a tiny local server:
```bash
python3 -m http.server 8000
```
then visit `http://localhost:8000`.
test
