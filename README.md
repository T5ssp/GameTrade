# Future Restaurant 2060

English futuristic restaurant concept with a searchable menu and simulated robot/table ordering.

## Local development

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

No build or application dependency installation is required. Open the server root.

This version extends the original design with saved favorites, plant-based and vegetarian filters, price sorting, per-dish customization and extras, separate customized cart lines, meal pairings, refresh-safe demo tracking, downloadable order summaries and recent-order reordering. A mobile navigation menu and bottom order bar support smaller screens.

Orders remain simulations; no payment or real kitchen order is sent. Dietary information, nutrition, times and prices are illustrative. Active orders survive a refresh in the same tab. The last five completed demo orders are stored on the device without customer names or kitchen/dish notes.

## Browser validation

With Python Playwright and Chromium available:

```sh
python3 tests/browser_smoke.py
```

The test starts a temporary local server and exercises customization prices, independent cart lines, favorites, filters, safe text rendering, checkout, tracking recovery, downloads, reorder, mobile layouts and unavailable storage. It does not access GitHub or deploy files.

See [DEPLOY.md](DEPLOY.md) for hosting instructions and the boundaries of this demo. Local changes are not automatically published.
