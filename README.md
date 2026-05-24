# Studio OS — Brand Dashboard

Your internal brand operating system. Built with React + Vite.

---

## Quick Start

**Prerequisites:** Node.js 18+ installed. Download from https://nodejs.org if needed.

```bash
# 1. Open this folder in VS Code terminal (Ctrl + ` )

# 2. Install dependencies (one time only)
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Project Structure

```
studio-os/
├── index.html                   # Entry HTML
├── vite.config.js               # Vite config
├── package.json                 # Dependencies
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Root: nav + section routing
    ├── index.css                # Global reset + base styles
    ├── lib/
    │   ├── theme.js             # ← Edit colors, fonts, nav here
    │   ├── storage.js           # localStorage helpers + default data
    │   └── pdf.js               # PDF export (opens print tab)
    └── components/
        ├── UI.jsx               # Shared: Card, Btn, Modal, Toast, etc.
        ├── Sidebar.jsx          # Left navigation
        ├── CommandCenter.jsx    # Home / overview
        ├── RDSection.jsx        # R&D — Prototype Lab
        ├── AuditSection.jsx     # Audit & Strategy
        ├── PipelineSection.jsx  # Production Pipeline
        └── AcademySection.jsx   # Academy & Education
```

---

## Customisation Guide

### Change your name or brand in the sidebar
Open `src/components/Sidebar.jsx` — find "Studio Principal" and "Studio OS", change to your studio name.

### Change colors
Open `src/lib/theme.js` — the `C` object holds every color token. The comments explain each role.

### Change fonts
Open `index.html` — update the Google Fonts `<link>` to load different fonts.
Then open `src/lib/theme.js` — update the `FONTS` object.

### Add a new nav section
1. Add an entry to `NAV` in `src/lib/theme.js`
2. Create `src/components/YourSection.jsx`
3. Import it in `src/App.jsx` and add it to the `sections` object

### Change default seed data
Open `src/lib/storage.js` — the `DEFAULTS` object holds all the starting data for each section.
Once you've used the app, your real data is in localStorage and defaults are ignored.

---

## Data & Backup

All data is stored in your browser's **localStorage** — it persists across page refreshes and browser restarts.

**To back up your data:** Go to Command Centre → click **Export Backup**. Save the `.json` file somewhere safe (Dropbox, iCloud, etc).

**To restore data:** Go to Command Centre → click **Import Backup** → select your `.json` file.

**To reset everything:** Open browser DevTools (F12) → Application → Local Storage → clear all `studio-os` keys. The app will reload with default seed data.

---

## Build for Production

```bash
npm run build
```

This outputs a `dist/` folder. You can host it on Netlify, Vercel, or any static host by dropping the folder — completely free.

---

## Tech Stack

- **React 18** — UI
- **Vite 5** — dev server and build tool
- **No other dependencies** — zero UI library, zero state management library
- **Google Fonts** — Playfair Display, Inter, JetBrains Mono
