# Future Restaurant 2060

A responsive English restaurant concept that follows the supplied visual reference: navy header, futuristic dining-room hero, five menu categories, 13 dishes, robot service panel, live menu QR and wave footer.

## Run locally

```sh
cd /workspace/GameTrade
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the root page. No build step or dependency installation is required. Use the existing checkout; do not create a separate worktree unless explicitly requested.

## Publish

Upload `index.html`, `style.css`, `app.js` and the complete `assets/` directory to a static host such as GitHub Pages, Netlify or Cloudflare Pages. Keep the directory structure. No build command is needed; the site root is this directory. The menu QR generates automatically from the current website URL, so publish at a public HTTPS address before sharing it. A QR opened on localhost points to localhost and cannot be used from another device.

For this repository, open https://github.com/T5ssp/GameTrade/settings/pages and select Source: Deploy from a branch, Branch: main, folder: / (root), then Save. The `.nojekyll` marker allows direct static hosting without a build. Use the website address GitHub displays after the Pages deployment succeeds. Uploading files alone does not prove Pages is enabled.

## Included interactions

- Search and category filters; dish detail dialogs with ingredients and illustrative dietary/allergen information.
- Local browser cart, quantities, OMR prices and calculated totals.
- Dine-in/table selection or takeaway, required customer name, optional kitchen notes.
- Demo confirmation, order number and simulated kitchen/robot/collection tracking.
- About, contact and robot service information dialogs.
- Responsive layouts and keyboard focus handling for the order drawer.

## Scope

This is a complete front-end ordering demonstration. It does not send real orders, process payments, connect to kitchen hardware, or control robots. Actual operations require a backend, verified restaurant details, payment integration and an order management system. Contact details and social accounts are intentionally not invented. Menu prices are provisional.

Images are locally bundled AI-generated recreations inspired by the supplied reference; they are not the original pixels from that screenshot. The hero is `assets/hero.png`; `assets/menu-photos.png` is a 4×4 photo sheet displayed through CSS without external image requests. The original screenshot was not available as a local downloadable file for extracting its individual photos.

Google Fonts is optional; system sans-serif and Georgia fallbacks are provided. The QR encoder is vendored locally in `assets/vendor/qrcode.js` (qrcode-generator 1.4.4, MIT, Kazuhiko Arase; copyright/license header retained in that file).

The restaurant site runs from `index.html` and does not require the earlier standalone artifact.
