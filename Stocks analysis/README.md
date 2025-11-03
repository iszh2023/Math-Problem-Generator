# Stocks Analysis Dashboard

Lightweight client-side dashboard that pulls quote snapshots from Yahoo Finance’s public quote endpoint.

## Features

- Featured “best stock right now” card highlighting NVDA with daily stats.
- Hero panel with an interactive search + watchlist row that feeds a detailed “AI Stock Analysis” insight card.
- Search box for any ticker symbol or company name. It recognises “magic” exchange patterns such as `FRA:AAPL` or `NASDAQ:TSLA`, attempts a live Google Finance fetch, and falls back to cached data (with AI guidance) when blocked.
- AI-curated #1 best and #1 worst movers plus Top 10 leader/laggard lists with quick Google Finance links.
- In-app Settings menu to flip between light, dark, peach, tan, or an auto seasonal theme.
- Trending watchlist tiles for big tech names with quick links to Google Finance.
- Live quotes are pulled from Google Finance (via a CORS-safe proxy) with cached fallbacks if the network blocks the request; when that happens the UI displays a reminder that data may be outdated and the AI module overlays heuristic guidance.
- Automatic refresh every hour to stay aligned with Yahoo Finance quotes.
- Optional momentum heuristic that highlights an AI outlook (“Bullish”, “Bearish”, etc.) for the top pick and tables.
- Real-time detail card summarising price, change, ranges, synthetic technical indicators, generated key signals, news blurbs, and sentiment bars.

### Ranking Criteria

- Only companies with market caps above **$5B USD** are considered for best/worst lists.
- Rankings are based on the **daily percentage move** from Yahoo Finance quote data.
- Featured pick = top gainer; biggest risk = largest decliner; both derived automatically on load.
- Switch the ranking method to **Momentum forecast** for an AI-weighted score that factors in change %, volume, and market cap.

### AI Outlook Tags

- Enable “Highlight AI outlook tags” in **Settings → Display Options** to show Bullish/Bearish badges on the #1 cards and leaderboards.
- Outlook labels are computed from the chosen ranking method (Daily change or Momentum).
- Customize link behavior and watchlist visibility from the same panel.

## Getting Started

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you have not already.
3. Start the CORS proxy by running `npm install` (first time) and `node server.js` from the repository root — or point `window.STOCK_PROXY_URL` at your deployed Render instance (`https://ai-stock-analysis-6nk5.onrender.com`). Use the bare base URL (no trailing path or query) so the app can append `/google` and `/yahoo` correctly.
4. Right-click `index.html` and choose **Open with Live Server**.
5. The dashboard opens in your browser at `http://127.0.0.1:5500` (port may vary).

> Opening via Live Server avoids CORS errors when requesting Yahoo Finance quotes.

## Using the dashboard

1. **Search or tap a quick ticker** in the hero card. The detail panel on the right updates instantly, while the results section lists the closest matches (click any card to refocus the insights).
2. **Watchlist** mirrors the latest large-cap fetch; select an item to populate the detail panel and highlight the row.
3. **AI Predictions & Sentiment** regenerate on every search, combining live proxy data when available with offline heuristics.
4. Use the **chart range toggle** to mark the intended timeframe (visual placeholder only when running offline without a chart service).

## Render deployment checklist

- **Root directory:** leave as repository root (where `package.json` lives). No additional “build” step is required beyond `npm install`.
- **Build command:** `npm install`
- **Start command:** `node server.js`
- **Node version:** Render’s default (currently 22.x) works; the project is ESM-ready via `"type": "module"`.
- **Public URL:** Copy the service URL without extra query parameters and assign it to `window.STOCK_PROXY_URL` (e.g., `https://ai-stock-analysis-6nk5.onrender.com`).
- Optional: hit `/` on the deployed service to verify the status page renders, then try `/yahoo?symbols=AAPL` or `/google?symbol=NASDAQ:AAPL` from the browser to confirm the proxy returns JSON.

## Customizing

- Use the **Settings** button (top-right) to tweak:
  - Theme (light, dark, peach, tan, or seasonal auto-palette).
  - Refresh frequency (15/30/60 minutes).
  - Ranking method (Daily change vs Momentum forecast).
  - Watchlist visibility and AI-outlook badges.
  - Google Finance link behavior (open in same tab or new tab).
- Edit `TRENDING_TICKERS` in `app.js` to track your own symbols.
- Adjust `FALLBACK_QUOTES` to tune the offline baseline data for each ticker.
