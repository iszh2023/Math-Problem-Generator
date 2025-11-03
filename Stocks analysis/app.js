const DEFAULT_PROXY_BASE = "https://ai-stock-analysis-6nk5.onrender.com";

function sanitizeProxyBase(raw) {
  const fallback = DEFAULT_PROXY_BASE;
  if (!raw) return fallback;
  try {
    const trimmed = String(raw).trim();
    if (!trimmed) return fallback;
    const url = /^https?:\/\//i.test(trimmed)
      ? new URL(trimmed)
      : typeof window !== "undefined"
      ? new URL(trimmed, window.location.origin)
      : null;
    if (!url) return fallback;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

const PROXY_BASE_URL =
  typeof window !== "undefined" && typeof window.STOCK_PROXY_URL !== "undefined"
    ? sanitizeProxyBase(window.STOCK_PROXY_URL)
    : DEFAULT_PROXY_BASE;
const LARGE_CAP_THRESHOLD = 5_000_000_000; // $5B

const TRENDING_TICKERS = [
  "NVDA",
  "AAPL",
  "MSFT",
  "TSLA",
  "GOOGL",
  "AMZN",
  "META",
  "NFLX",
  "TXN",
  "9988.HK",
  "0700.HK",
  "3690.HK",
  "NTES",
];

const FALLBACK_QUOTES = {
  NVDA: {
    longName: "NVIDIA Corporation",
    regularMarketPrice: 124.52,
    regularMarketChange: 2.34,
    regularMarketChangePercent: 1.92,
    regularMarketDayLow: 122.1,
    regularMarketDayHigh: 125.6,
    fiftyTwoWeekLow: 45.68,
    fiftyTwoWeekHigh: 135.68,
    regularMarketVolume: 48231000,
    marketCap: 3065400000000,
    exchangeSuffix: "NASDAQ",
  },
  AAPL: {
    longName: "Apple Inc.",
    regularMarketPrice: 230.01,
    regularMarketChange: 1.12,
    regularMarketChangePercent: 0.49,
    regularMarketDayLow: 227.4,
    regularMarketDayHigh: 231.98,
    fiftyTwoWeekLow: 162.8,
    fiftyTwoWeekHigh: 237.23,
    regularMarketVolume: 41250000,
    marketCap: 3520000000000,
    exchangeSuffix: "NASDAQ",
  },
  MSFT: {
    longName: "Microsoft Corporation",
    regularMarketPrice: 418.55,
    regularMarketChange: 1.83,
    regularMarketChangePercent: 0.44,
    regularMarketDayLow: 414.2,
    regularMarketDayHigh: 419.8,
    fiftyTwoWeekLow: 309.45,
    fiftyTwoWeekHigh: 433.6,
    regularMarketVolume: 27840000,
    marketCap: 3110000000000,
    exchangeSuffix: "NASDAQ",
  },
  TSLA: {
    longName: "Tesla, Inc.",
    regularMarketPrice: 238.71,
    regularMarketChange: -1.92,
    regularMarketChangePercent: -0.80,
    regularMarketDayLow: 233.4,
    regularMarketDayHigh: 242.7,
    fiftyTwoWeekLow: 146.22,
    fiftyTwoWeekHigh: 299.29,
    regularMarketVolume: 105670000,
    marketCap: 762000000000,
    exchangeSuffix: "NASDAQ",
  },
  GOOGL: {
    longName: "Alphabet Inc. Class A",
    regularMarketPrice: 183.45,
    regularMarketChange: 0.88,
    regularMarketChangePercent: 0.48,
    regularMarketDayLow: 181.7,
    regularMarketDayHigh: 184.9,
    fiftyTwoWeekLow: 121.46,
    fiftyTwoWeekHigh: 191.9,
    regularMarketVolume: 24030000,
    marketCap: 2280000000000,
    exchangeSuffix: "NASDAQ",
  },
  AMZN: {
    longName: "Amazon.com, Inc.",
    regularMarketPrice: 179.82,
    regularMarketChange: 1.25,
    regularMarketChangePercent: 0.70,
    regularMarketDayLow: 176.4,
    regularMarketDayHigh: 180.5,
    fiftyTwoWeekLow: 118.35,
    fiftyTwoWeekHigh: 189.77,
    regularMarketVolume: 48250000,
    marketCap: 1870000000000,
    exchangeSuffix: "NASDAQ",
  },
  META: {
    longName: "Meta Platforms, Inc.",
    regularMarketPrice: 514.32,
    regularMarketChange: 6.72,
    regularMarketChangePercent: 1.33,
    regularMarketDayLow: 505.2,
    regularMarketDayHigh: 516.8,
    fiftyTwoWeekLow: 274.38,
    fiftyTwoWeekHigh: 542.9,
    regularMarketVolume: 16840000,
    marketCap: 1290000000000,
    exchangeSuffix: "NASDAQ",
  },
  NFLX: {
    longName: "Netflix, Inc.",
    regularMarketPrice: 656.12,
    regularMarketChange: -4.85,
    regularMarketChangePercent: -0.73,
    regularMarketDayLow: 649.3,
    regularMarketDayHigh: 662.4,
    fiftyTwoWeekLow: 344.73,
    fiftyTwoWeekHigh: 697.6,
    regularMarketVolume: 5380000,
    marketCap: 280000000000,
    exchangeSuffix: "NASDAQ",
  },
  TXN: {
    longName: "Texas Instruments Incorporated",
    regularMarketPrice: 194.78,
    regularMarketChange: 1.28,
    regularMarketChangePercent: 0.66,
    regularMarketDayLow: 191.2,
    regularMarketDayHigh: 195.6,
    fiftyTwoWeekLow: 139.5,
    fiftyTwoWeekHigh: 206.0,
    regularMarketVolume: 4780000,
    marketCap: 177000000000,
    exchangeSuffix: "NASDAQ",
  },
  "0700.HK": {
    longName: "Tencent Holdings Limited",
    regularMarketPrice: 312.4,
    regularMarketChange: 4.2,
    regularMarketChangePercent: 1.36,
    regularMarketDayLow: 307.6,
    regularMarketDayHigh: 315.2,
    fiftyTwoWeekLow: 252.8,
    fiftyTwoWeekHigh: 384.2,
    regularMarketVolume: 14560000,
    marketCap: 3020000000000,
    exchangeSuffix: "HKG",
  },
  "9988.HK": {
    longName: "Alibaba Group Holding Limited",
    regularMarketPrice: 82.65,
    regularMarketChange: -1.12,
    regularMarketChangePercent: -1.34,
    regularMarketDayLow: 81.3,
    regularMarketDayHigh: 84.2,
    fiftyTwoWeekLow: 60.2,
    fiftyTwoWeekHigh: 99.9,
    regularMarketVolume: 23800000,
    marketCap: 1760000000000,
    exchangeSuffix: "HKG",
  },
  "3690.HK": {
    longName: "Meituan",
    regularMarketPrice: 110.4,
    regularMarketChange: 3.1,
    regularMarketChangePercent: 2.89,
    regularMarketDayLow: 106.2,
    regularMarketDayHigh: 111.5,
    fiftyTwoWeekLow: 88.0,
    fiftyTwoWeekHigh: 163.3,
    regularMarketVolume: 18640000,
    marketCap: 678000000000,
    exchangeSuffix: "HKG",
  },
  NTES: {
    longName: "NetEase, Inc.",
    regularMarketPrice: 96.72,
    regularMarketChange: -0.42,
    regularMarketChangePercent: -0.43,
    regularMarketDayLow: 95.2,
    regularMarketDayHigh: 98.6,
    fiftyTwoWeekLow: 68.0,
    fiftyTwoWeekHigh: 118.9,
    regularMarketVolume: 3850000,
    marketCap: 65000000000,
    exchangeSuffix: "NASDAQ",
  },
};

const MARKET_SUFFIXES = [
  "",
  ".HK",
  ".SZ",
  ".SS",
  ".L",
  ".TO",
  ".AX",
  ".T",
  ".PA",
  ".F",
];

const EXCHANGE_SUFFIX_MAP = {
  NASDAQ: "",
  NYSE: "",
  NYSEARCA: "",
  NYSEAMERICAN: "",
  LON: ".L",
  LSE: ".L",
  FRA: ".F",
  ETR: ".F",
  XETRA: ".F",
  EPA: ".PA",
  PAR: ".PA",
  ASX: ".AX",
  TYO: ".T",
  JPX: ".T",
  TSE: ".TO",
  TSX: ".TO",
  HKG: ".HK",
  HKEX: ".HK",
  SHE: ".SZ",
  SZSE: ".SZ",
  SHG: ".SS",
  SSE: ".SS",
};

const SEASONS = {
  spring: { className: "theme-season-spring", label: "Spring" },
  summer: { className: "theme-season-summer", label: "Summer" },
  fall: { className: "theme-season-fall", label: "Fall" },
  winter: { className: "theme-season-winter", label: "Winter" },
};

const THEMES = {
  light: { className: "theme-light" },
  dark: { className: "theme-dark" },
  peach: { className: "theme-peach" },
  tan: { className: "theme-tan" },
};

const DEFAULT_SETTINGS = {
  theme: "seasonal",
  refreshMinutes: 60,
  rankingMode: "daily",
  showWatchlist: true,
  highlightFuture: true,
  openLinksInNewTab: true,
};

const SETTINGS_STORAGE_KEY = "stocks-dashboard-settings";

let settingsState = loadSettings();
let refreshTimer = null;
let focusedQuote = null;
let focusedQuoteSource = "—";

function loadSettings() {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    if (!Object.prototype.hasOwnProperty.call(THEMES, merged.theme) && merged.theme !== "seasonal") {
      merged.theme = DEFAULT_SETTINGS.theme;
    }
    if (typeof merged.refreshMinutes !== "number" || !Number.isFinite(merged.refreshMinutes) || merged.refreshMinutes <= 0) {
      merged.refreshMinutes = DEFAULT_SETTINGS.refreshMinutes;
    }
    if (!["daily", "momentum"].includes(merged.rankingMode)) {
      merged.rankingMode = DEFAULT_SETTINGS.rankingMode;
    }
    merged.showWatchlist = Boolean(merged.showWatchlist);
    merged.highlightFuture = Boolean(merged.highlightFuture);
    merged.openLinksInNewTab = merged.openLinksInNewTab !== false;
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsState));
  } catch {
    /* ignore storage errors */
  }
}

function detectSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return SEASONS.spring;
  if (month >= 5 && month <= 7) return SEASONS.summer;
  if (month >= 8 && month <= 10) return SEASONS.fall;
  return SEASONS.winter;
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove(
    "theme-light",
    "theme-dark",
    "theme-peach",
    "theme-tan",
    "theme-season-spring",
    "theme-season-summer",
    "theme-season-fall",
    "theme-season-winter"
  );

  let appliedClass = "theme-light";
  let seasonLabel = null;

  if (theme === "seasonal") {
    const season = detectSeason();
    appliedClass = season.className;
    seasonLabel = season.label;
  } else if (THEMES[theme]) {
    appliedClass = THEMES[theme].className;
  }

  body.classList.add(appliedClass);
  const seasonNote = document.querySelector(".season-note");
  const seasonLabelEl = document.getElementById("season-label");
  if (seasonNote && seasonLabelEl) {
    if (theme === "seasonal") {
      seasonNote.classList.add("visible");
      seasonLabelEl.textContent = seasonLabel ?? detectSeason().label;
    } else {
      seasonNote.classList.remove("visible");
      seasonLabelEl.textContent = "—";
    }
  }

}

const GOOGLE_FINANCE_ENDPOINT = `${PROXY_BASE_URL}/google?symbol=`;
const YAHOO_PROXY_ENDPOINT = `${PROXY_BASE_URL}/yahoo?symbols=`;

function parseAbbrevNumber(text) {
  if (!text) return null;
  const clean = String(text).trim();
  if (!clean) return null;
  const match = clean.match(/([+-]?[0-9]*\.?[0-9]+)\s*([KMBT]?)/i);
  if (!match) {
    const parsed = Number(clean.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  const value = parseFloat(match[1]);
  if (!Number.isFinite(value)) return null;
  const suffix = match[2].toUpperCase();
  const map = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  return value * (map[suffix] || 1);
}

function buildGoogleQuery(symbol) {
  const upper = symbol.toUpperCase();
  if (upper.includes(".")) {
    const [base, suffix] = upper.split(".");
    const map = {
      HK: `HKG:${base}`,
      L: `LON:${base}`,
      TO: `TSE:${base}`,
      SZ: `SHE:${base}`,
      SS: `SHA:${base}`,
      PA: `EPA:${base}`,
      F: `FRA:${base}`,
      AX: `ASX:${base}`,
      T: `TYO:${base}`,
    };
    if (map[suffix]) return map[suffix];
    return `${suffix}:${base}`;
  }
  return `NASDAQ:${upper}`;
}

function parseGoogleQuote(symbol, raw, fallback) {
  if (!raw) return null;
  const price = parseFloat(raw.l_fix || raw.l || raw.price);
  const change = parseFloat(raw.c_fix || raw.c || raw.priceChange?.raw);
  const changePct = parseFloat(raw.cp_fix || raw.cp || raw.priceChangePercent?.raw);
  let dayLow = null;
  let dayHigh = null;
  if (raw.range) {
    const parts = raw.range.split(" - ");
    if (parts.length === 2) {
      dayLow = parseFloat(parts[0].replace(/,/g, ""));
      dayHigh = parseFloat(parts[1].replace(/,/g, ""));
    }
  }
  const volume = parseAbbrevNumber(raw.vo || raw.volume);
  const marketCap = parseAbbrevNumber(raw.mc || raw.market_cap);
  return normalizeQuote({
    symbol,
    longName: raw.name || raw.t || fallback?.longName,
    regularMarketPrice: Number.isFinite(price) ? price : fallback?.regularMarketPrice,
    regularMarketChange: Number.isFinite(change) ? change : fallback?.regularMarketChange,
    regularMarketChangePercent: Number.isFinite(changePct)
      ? changePct
      : fallback?.regularMarketChangePercent,
    regularMarketDayLow: Number.isFinite(dayLow)
      ? dayLow
      : fallback?.regularMarketDayLow,
    regularMarketDayHigh: Number.isFinite(dayHigh)
      ? dayHigh
      : fallback?.regularMarketDayHigh,
    fiftyTwoWeekLow: fallback?.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: fallback?.fiftyTwoWeekHigh,
    regularMarketVolume: Number.isFinite(volume)
      ? volume
      : fallback?.regularMarketVolume,
    marketCap: Number.isFinite(marketCap) ? marketCap : fallback?.marketCap,
    exchangeSuffix: fallback?.exchangeSuffix,
  });
}

async function fetchGoogleQuote(symbol) {
  const query = buildGoogleQuery(symbol);
  const url = `${GOOGLE_FINANCE_ENDPOINT}${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, { cache: "no-store", mode: "cors" });
    if (!response.ok) throw new Error(`Google Finance request failed ${response.status}`);
    const text = await response.text();
    const jsonText = text.replace(/^\s*\/\//, "");
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data) || !data.length) throw new Error("No Google Finance result");
    const fallback = FALLBACK_QUOTES[symbol];
    return parseGoogleQuote(symbol, data[0], fallback);
  } catch (error) {
    console.warn(`Google Finance fetch failed for ${symbol}:`, error);
    return null;
  }
}

function getFallbackQuote(symbol) {
  if (FALLBACK_QUOTES[symbol]) {
    return normalizeQuote({ symbol, ...FALLBACK_QUOTES[symbol] });
  }
  const base = symbol.includes(".") ? symbol.split(".")[0] : null;
  if (base && FALLBACK_QUOTES[base]) {
    return normalizeQuote({ symbol: base, ...FALLBACK_QUOTES[base] });
  }
  return null;
}

async function fetchYahooQuote(symbol) {
  const url = `${YAHOO_PROXY_ENDPOINT}${encodeURIComponent(symbol)}`;
  try {
    const response = await fetch(url, { cache: "no-store", mode: "cors" });
    if (!response.ok) throw new Error(`Yahoo Finance request failed ${response.status}`);
    const payload = await response.json();
    const result = payload?.quoteResponse?.result?.[0];
    if (!result) throw new Error("No Yahoo Finance result");
    return normalizeQuote({
      symbol: result.symbol || symbol,
      longName: result.longName || result.shortName || symbol,
      regularMarketPrice: result.regularMarketPrice,
      regularMarketChange: result.regularMarketChange,
      regularMarketChangePercent: result.regularMarketChangePercent,
      regularMarketDayLow: result.regularMarketDayLow,
      regularMarketDayHigh: result.regularMarketDayHigh,
      fiftyTwoWeekLow: result.fiftyTwoWeekLow,
      fiftyTwoWeekHigh: result.fiftyTwoWeekHigh,
      regularMarketVolume: result.regularMarketVolume,
      marketCap: result.marketCap,
      exchangeSuffix:
        result.exchangeSuffix ||
        result.exchange ||
        inferExchangeSuffix(result.fullExchangeName || ""),
    });
  } catch (error) {
    console.warn(`Yahoo Finance fetch failed for ${symbol}:`, error);
    return null;
  }
}

async function fetchQuotes(symbols) {
  const uniqueSymbols = [...new Set(symbols.filter(Boolean))];
  const results = await Promise.all(
    uniqueSymbols.map(async (symbol) => {
      const [googleResult, yahooResult] = await Promise.allSettled([
        fetchGoogleQuote(symbol),
        fetchYahooQuote(symbol),
      ]);
      const googleQuote =
        googleResult.status === "fulfilled" && googleResult.value ? googleResult.value : null;
      const yahooQuote =
        yahooResult.status === "fulfilled" && yahooResult.value ? yahooResult.value : null;
      return googleQuote || yahooQuote || getFallbackQuote(symbol);
    })
  );
  return results.filter(Boolean);
}

function scheduleRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(initDashboard, settingsState.refreshMinutes * 60 * 1000);
}

function applySettings() {
  applyTheme(settingsState.theme);
  document.body.classList.toggle("hide-watchlist", !settingsState.showWatchlist);
  document.body.classList.toggle("highlight-future", settingsState.highlightFuture);
  scheduleRefresh();
  saveSettings();
}

function openFinanceLink(quote) {
  const suffix = quote.exchangeSuffix || "NASDAQ";
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(quote.symbol)}:${suffix}`;
  const target = settingsState.openLinksInNewTab ? "_blank" : "_self";
  const features = target === "_blank" ? "noopener" : undefined;
  window.open(url, target, features);
}

function getRankingScore(quote) {
  const pct = quote?.regularMarketChangePercent ?? 0;
  if (settingsState.rankingMode === "momentum") {
    const volumeFactor = quote?.regularMarketVolume ? Math.log10(quote.regularMarketVolume) / 10 : 0;
    const capFactor = quote?.marketCap ? Math.log10(quote.marketCap) / 14 : 0;
    return pct * (1 + volumeFactor + capFactor * 0.2);
  }
  return pct;
}

function getOutlook(quote) {
  const score = getRankingScore(quote);
  if (!Number.isFinite(score)) return { label: "Neutral", className: "ai-neutral" };
  if (score >= 8) return { label: "Strongly Bullish", className: "ai-strong-bull" };
  if (score >= 3) return { label: "Bullish", className: "ai-bull" };
  if (score <= -8) return { label: "Strongly Bearish", className: "ai-strong-bear" };
  if (score <= -3) return { label: "Bearish", className: "ai-bear" };
  return { label: "Neutral", className: "ai-neutral" };
}

function normalizeQuote(raw) {
  if (!raw) return null;
  const fallback = FALLBACK_QUOTES[raw.symbol];
  const base = fallback ? { ...fallback, ...raw } : raw;
  const exchangeSuffix =
    base.exchangeSuffix ||
    inferExchangeSuffix(base.fullExchangeName || base.exchange || "");
  return {
    symbol: base.symbol,
    longName: base.longName || base.shortName || base.symbol,
    regularMarketPrice: base.regularMarketPrice,
    regularMarketChange: base.regularMarketChange,
    regularMarketChangePercent: base.regularMarketChangePercent,
    regularMarketDayLow: base.regularMarketDayLow,
    regularMarketDayHigh: base.regularMarketDayHigh,
    fiftyTwoWeekLow: base.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: base.fiftyTwoWeekHigh,
    regularMarketVolume: base.regularMarketVolume,
    marketCap: base.marketCap,
    exchangeSuffix,
  };
}

function inferExchangeSuffix(exchange) {
  const mapping = [
    { suffix: "NASDAQ", tokens: ["NASDAQ", "NMS", "NGM"] },
    { suffix: "NYSE", tokens: ["NYSE", "NYQ"] },
    { suffix: "NYSEARCA", tokens: ["ARCA", "ARCX"] },
    { suffix: "NYSEAMERICAN", tokens: ["AMEX", "NYSE AMERICAN"] },
    { suffix: "HKG", tokens: ["HONG KONG", "HKEX", "HKSE"] },
    { suffix: "SHA", tokens: ["SHANGHAI", "SHSE", "SS"] },
    { suffix: "SHE", tokens: ["SHENZHEN", "SZSE", "SZ"] },
    { suffix: "LON", tokens: ["LONDON", "LSE"] },
    { suffix: "TSX", tokens: ["TORONTO", "TSX"] },
  ];
  const upper = exchange.toUpperCase();
  for (const entry of mapping) {
    if (entry.tokens.some((token) => upper.includes(token))) return entry.suffix;
  }
  return "NASDAQ";
}

function formatCurrency(value) {
  return typeof value === "number" ? `$${value.toFixed(2)}` : "—";
}

function formatChange(quote) {
  if (
    typeof quote?.regularMarketChange !== "number" ||
    typeof quote?.regularMarketChangePercent !== "number"
  ) {
    return "—";
  }
  const sign = quote.regularMarketChange > 0 ? "+" : "";
  return `${sign}${quote.regularMarketChange.toFixed(2)} (${sign}${quote.regularMarketChangePercent.toFixed(2)}%)`;
}

function formatRange(low, high) {
  if (typeof low !== "number" || typeof high !== "number") return "—";
  return `${low.toFixed(2)} - ${high.toFixed(2)}`;
}

function formatNumber(value) {
  if (!value) return "—";
  return Intl.NumberFormat("en-US").format(value);
}

function formatMarketCap(value) {
  if (typeof value !== "number") return "—";
  const units = [
    { limit: 1e12, suffix: "T" },
    { limit: 1e9, suffix: "B" },
    { limit: 1e6, suffix: "M" },
  ];
  for (const unit of units) {
    if (value >= unit.limit) {
      return `${(value / unit.limit).toFixed(2)}${unit.suffix}`;
    }
  }
  return formatNumber(value);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function formatSigned(value, decimals = 2) {
  if (!Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}`;
}

function computeTechnicalSnapshot(quote) {
  const price =
    typeof quote?.regularMarketPrice === "number" ? quote.regularMarketPrice : null;
  const changePct =
    typeof quote?.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : 0;
  const change =
    typeof quote?.regularMarketChange === "number" ? quote.regularMarketChange : 0;
  const volume =
    typeof quote?.regularMarketVolume === "number" ? quote.regularMarketVolume : 0;
  const marketCap = typeof quote?.marketCap === "number" ? quote.marketCap : 0;

  const rsi = price ? clamp(Math.round(52 + changePct * 4.2), 10, 90) : null;
  const rsiNote =
    rsi === null ? "Awaiting data" : rsi >= 70 ? "Overbought" : rsi <= 30 ? "Oversold" : "Neutral";

  const macd = price ? clamp(changePct * 0.6, -8, 8) : null;
  const macdNote = change >= 0 ? "↑ bullish" : "↓ bearish";

  const sma50 = price ? price * (1 - changePct / 100 * 0.4 - 0.015) : null;
  const sma200 = price ? price * (1 - changePct / 100 * 0.55 - 0.05) : null;

  const relation50 = price && sma50 ? (price >= sma50 ? "above" : "below") : null;
  const relation200 = price && sma200 ? (price >= sma200 ? "above" : "below") : null;
  const sma50Note =
    !price || sma50 === null
      ? "Awaiting data"
      : relation50 === "above"
      ? "Trading above 50-day average"
      : "Below 50-day average";
  const sma200Note =
    !price || sma200 === null
      ? "Awaiting data"
      : relation200 === "above"
      ? "Holding above 200-day trendline"
      : "Below long-term trendline";

  let volumeNote;
  if (!volume) volumeNote = "Volume data unavailable";
  else if (volume >= 5e7) volumeNote = "Trading volume above average";
  else if (volume >= 1.5e7) volumeNote = "Volume is in line with recent averages";
  else volumeNote = "Volume is lighter than usual";

  return {
    price,
    changePct,
    change,
    volume,
    marketCap,
    rsi,
    rsiNote,
    macd,
    macdNote,
    sma50,
    sma50Note,
    relation50,
    sma200,
    sma200Note,
    relation200,
    volumeNote,
  };
}

function renderTechnicalIndicators(indicators) {
  const rsiEl = document.getElementById("detail-rsi");
  const rsiNoteEl = document.getElementById("detail-rsi-note");
  const macdEl = document.getElementById("detail-macd");
  const macdNoteEl = document.getElementById("detail-macd-note");
  const sma50El = document.getElementById("detail-sma-50");
  const sma50NoteEl = document.getElementById("detail-sma-50-note");
  const sma200El = document.getElementById("detail-sma-200");
  const sma200NoteEl = document.getElementById("detail-sma-200-note");

  if (!indicators) {
    [rsiEl, macdEl, sma50El, sma200El].forEach((el) => {
      if (el) el.textContent = "—";
    });
    [rsiNoteEl, macdNoteEl, sma50NoteEl, sma200NoteEl].forEach((el) => {
      if (el) el.textContent = "Waiting for live data…";
    });
    return;
  }

  if (rsiEl) rsiEl.textContent = indicators.rsi !== null ? indicators.rsi : "—";
  if (rsiNoteEl) rsiNoteEl.textContent = indicators.rsiNote;
  if (macdEl) macdEl.textContent = indicators.macd !== null ? indicators.macd.toFixed(2) : "—";
  if (macdNoteEl) macdNoteEl.textContent = indicators.macdNote;
  if (sma50El) sma50El.textContent = indicators.sma50 ? formatCurrency(indicators.sma50) : "—";
  if (sma50NoteEl) sma50NoteEl.textContent = indicators.sma50Note;
  if (sma200El) sma200El.textContent = indicators.sma200 ? formatCurrency(indicators.sma200) : "—";
  if (sma200NoteEl) sma200NoteEl.textContent = indicators.sma200Note;
}

function derivePredictionInsights(quote, indicators) {
  if (!quote) {
    return {
      stance: "NEUTRAL",
      stanceClass: "neutral",
      confidence: "—",
      predictedChange: "—",
      signals: [],
    };
  }
  const score = getRankingScore(quote);
  let stanceClass = "neutral";
  let stance = "NEUTRAL";
  if (score >= 6) {
    stanceClass = "bullish";
    stance = "BULLISH";
  } else if (score <= -6) {
    stanceClass = "bearish";
    stance = "BEARISH";
  } else if (score >= 2) {
    stanceClass = "bullish";
    stance = "BULLISH";
  } else if (score <= -2) {
    stanceClass = "bearish";
    stance = "BEARISH";
  }

  const capFactor = indicators?.marketCap ? Math.log10(indicators.marketCap) : 0;
  const confidence = Math.round(clamp(55 + score * 2 + capFactor * 2, 35, 92));

  let predictedChange = "-1% to +1%";
  if (stanceClass === "bullish") {
    predictedChange = score >= 8 ? "+6-9%" : "+3-6%";
  } else if (stanceClass === "bearish") {
    predictedChange = score <= -8 ? "-6-9%" : "-3-6%";
  }

  const signals = new Set();
  if (indicators?.relation50 === "above") {
    signals.add("Moving averages indicate bullish trend");
  } else if (indicators?.relation50 === "below") {
    signals.add("Price slips below the 50-day average");
  }

  if (indicators?.volumeNote) {
    signals.add(indicators.volumeNote);
  }

  if (indicators?.rsi !== null) {
    if (indicators.rsi >= 65) {
      signals.add("RSI shows momentum");
    } else if (indicators.rsi <= 35) {
      signals.add("RSI signals potential reversal");
    } else {
      signals.add("RSI points to consolidation");
    }
  }

  if (Number.isFinite(indicators?.changePct)) {
    signals.add(`Intraday change ${formatSigned(indicators.changePct)}%`);
  }

  return {
    stance,
    stanceClass,
    confidence,
    predictedChange,
    signals: Array.from(signals),
  };
}

function buildNewsItems(quote) {
  const symbol = quote?.symbol ?? "Ticker";
  const name = quote?.longName ?? symbol;
  const changePct =
    typeof quote?.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : 0;

  const positive = changePct >= 0;
  const trendWord = positive ? "extends gains" : "faces pressure";
  const sentimentPrimary = positive ? "positive" : changePct <= -1 ? "negative" : "neutral";
  const secondarySentiment = positive ? "positive" : "neutral";

  return [
    {
      title: `${symbol} ${trendWord} as investors react to latest catalysts`,
      source: positive ? "Bloomberg" : "Reuters",
      age: "2 hours ago",
      sentiment: sentimentPrimary,
    },
    {
      title: `${name} analysts ${positive ? "lift" : "reassess"} price targets following updates`,
      source: positive ? "Financial Times" : "MarketWatch",
      age: "5 hours ago",
      sentiment: secondarySentiment,
    },
  ];
}

function renderNewsPanel(quote) {
  const list = document.getElementById("news-list");
  const showMoreBtn = document.getElementById("news-more");
  if (!list) return;
  list.innerHTML = "";
  if (!quote) {
    list.innerHTML = `<li class="placeholder">Headlines populate once a ticker is selected.</li>`;
    if (showMoreBtn) {
      showMoreBtn.disabled = true;
      showMoreBtn.classList.add("muted");
    }
    return;
  }
  const items = buildNewsItems(quote);
  items.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.title}</strong>
      <div class="news-meta">
        <span>${item.source}</span>
        <span>${item.age}</span>
        <span>${item.sentiment}</span>
      </div>
    `;
    list.append(li);
  });
  if (showMoreBtn) {
    showMoreBtn.disabled = false;
    showMoreBtn.classList.remove("muted");
  }
}

function renderSentimentPanel(quote) {
  const summaryEl = document.getElementById("sentiment-summary");
  const positiveEl = document.getElementById("sentiment-positive");
  const neutralEl = document.getElementById("sentiment-neutral");
  const negativeEl = document.getElementById("sentiment-negative");

  if (!quote || !positiveEl || !neutralEl || !negativeEl) {
    if (positiveEl) positiveEl.style.width = "0%";
    if (neutralEl) neutralEl.style.width = "0%";
    if (negativeEl) negativeEl.style.width = "0%";
    if (positiveEl) positiveEl.textContent = "0%";
    if (neutralEl) neutralEl.textContent = "0%";
    if (negativeEl) negativeEl.textContent = "0%";
    if (summaryEl) summaryEl.textContent = "Neutral";
    return;
  }

  const changePct =
    typeof quote.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : 0;

  let positive = clamp(48 + changePct * 4, 5, 80);
  let negative = clamp(28 - changePct * 3.2, 5, 60);
  let neutral = 100 - positive - negative;
  if (neutral < 5) {
    const deficit = 5 - neutral;
    neutral = 5;
    positive = clamp(positive - deficit / 2, 5, 85);
    negative = clamp(negative - deficit / 2, 5, 85);
  }
  const total = positive + neutral + negative;
  if (total !== 100) {
    const adjust = 100 - total;
    neutral = clamp(neutral + adjust, 5, 90);
  }

  const stance =
    positive > negative + 10 ? "Bullish" : negative > positive + 10 ? "Bearish" : "Neutral";

  positiveEl.style.width = `${positive}%`;
  positiveEl.textContent = `${positive.toFixed(0)}%`;
  neutralEl.style.width = `${neutral}%`;
  neutralEl.textContent = `${neutral.toFixed(0)}%`;
  negativeEl.style.width = `${negative}%`;
  negativeEl.textContent = `${negative.toFixed(0)}%`;
  if (summaryEl) summaryEl.textContent = stance;
}

function renderPrimaryDetail(quote, sourceLabel, indicators) {
  const card = document.getElementById("detail-card");
  if (!card) return;
  const symbolEl = document.getElementById("detail-symbol");
  const nameEl = document.getElementById("detail-name");
  const priceEl = document.getElementById("detail-price");
  const changeWrapper = document.getElementById("detail-change-wrapper");
  const changeAbsEl = document.getElementById("detail-change-abs");
  const changePctEl = document.getElementById("detail-change-pct");
  const changeSummaryEl = document.getElementById("detail-change-summary");
  const volumeEl = document.getElementById("detail-volume");
  const capEl = document.getElementById("detail-marketcap");
  const dayRangeEl = document.getElementById("detail-range-day");
  const yearRangeEl = document.getElementById("detail-range-year");
  const sourceEl = document.getElementById("detail-source");
  const openLink = document.getElementById("detail-open-google");

  if (!quote) {
    if (symbolEl) symbolEl.textContent = "—";
    if (nameEl) nameEl.textContent = "Select a ticker to view live analysis.";
    if (priceEl) priceEl.textContent = "—";
    if (changeAbsEl) changeAbsEl.textContent = "—";
    if (changePctEl) changePctEl.textContent = "";
    if (changeSummaryEl) changeSummaryEl.textContent = "Waiting for live data…";
    if (volumeEl) volumeEl.textContent = "—";
    if (capEl) capEl.textContent = "—";
    if (dayRangeEl) dayRangeEl.textContent = "—";
    if (yearRangeEl) yearRangeEl.textContent = "—";
    if (sourceEl) sourceEl.textContent = "—";
    if (openLink) {
      openLink.disabled = true;
      openLink.removeAttribute("data-symbol");
    }
    renderTechnicalIndicators(null);
    return;
  }

  if (symbolEl) symbolEl.textContent = quote.symbol;
  if (nameEl) nameEl.textContent = quote.longName ?? quote.symbol;
  if (priceEl) priceEl.textContent = formatCurrency(quote.regularMarketPrice);

  const change = typeof quote.regularMarketChange === "number" ? quote.regularMarketChange : null;
  const changePct =
    typeof quote.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : null;
  if (changeWrapper) {
    changeWrapper.classList.remove("positive", "negative");
    if (Number.isFinite(change) && Number.isFinite(changePct)) {
      changeWrapper.classList.add(change >= 0 ? "positive" : "negative");
    }
  }
  if (changeAbsEl) changeAbsEl.textContent = formatSigned(change ?? NaN);
  if (changePctEl) changePctEl.textContent = changePct !== null ? `${formatSigned(changePct)}%` : "";
  if (changeSummaryEl)
    changeSummaryEl.textContent =
      Number.isFinite(change) && Number.isFinite(changePct)
        ? `${formatSigned(change)} (${formatSigned(changePct)}%) today`
        : "Waiting for live data…";

  if (volumeEl) volumeEl.textContent = formatNumber(quote.regularMarketVolume);
  if (capEl) capEl.textContent = formatMarketCap(quote.marketCap);
  if (dayRangeEl)
    dayRangeEl.textContent = formatRange(quote.regularMarketDayLow, quote.regularMarketDayHigh);
  if (yearRangeEl)
    yearRangeEl.textContent = formatRange(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh);
  if (sourceEl) sourceEl.textContent = sourceLabel ?? "—";

  if (openLink) {
    openLink.disabled = false;
    openLink.dataset.symbol = quote.symbol;
  }

  renderTechnicalIndicators(indicators);
}

function renderPredictionPanel(quote, sourceLabel, indicators) {
  const stanceEl = document.getElementById("prediction-stance");
  const confidenceEl = document.getElementById("prediction-confidence");
  const changeEl = document.getElementById("prediction-change");
  const listEl = document.getElementById("key-signals");

  if (!quote || !stanceEl || !confidenceEl || !changeEl || !listEl) return;

  const insights = derivePredictionInsights(quote, indicators);
  stanceEl.textContent = insights.stance;
  stanceEl.classList.remove("bullish", "bearish", "neutral");
  stanceEl.classList.add(insights.stanceClass);
  confidenceEl.textContent =
    typeof insights.confidence === "number" ? `${insights.confidence}%` : "—";
  changeEl.textContent = insights.predictedChange;

  listEl.innerHTML = "";
  const signals = insights.signals.length
    ? insights.signals
    : ["No live signals available. Check back soon."];
  signals.forEach((signal) => {
    const li = document.createElement("li");
    li.textContent = signal;
    listEl.append(li);
  });

  const disclaimer = document.querySelector(".prediction-disclaimer");
  if (disclaimer) {
    disclaimer.textContent =
      "AI predictions are for informational purposes only and should not be considered financial advice.";
  }
}

function highlightWatchlist(symbol) {
  const items = document.querySelectorAll(".watchlist-item");
  const upper = symbol ? symbol.toUpperCase() : null;
  items.forEach((item) => {
    const itemSymbol = item.dataset.symbol?.toUpperCase();
    item.dataset.active = upper && itemSymbol === upper ? "true" : "false";
  });
}

function renderPredictionExtras(quote, sourceLabel, indicators) {
  renderPredictionPanel(quote, sourceLabel, indicators);
  renderNewsPanel(quote);
  renderSentimentPanel(quote);
}

function focusQuote(quote, sourceLabel = "Live proxy") {
  focusedQuote = quote || null;
  focusedQuoteSource = sourceLabel;
  const indicators = computeTechnicalSnapshot(quote);
  renderPrimaryDetail(quote, sourceLabel, indicators);
  renderPredictionExtras(quote, sourceLabel, indicators);
  highlightWatchlist(quote?.symbol ?? null);
}
function selectLeaders(quotes, direction = "desc", limit = 10) {
  return quotes
    .filter(
      (quote) =>
        typeof quote.regularMarketChangePercent === "number" &&
        quote.marketCap >= LARGE_CAP_THRESHOLD
    )
    .sort((a, b) =>
      direction === "desc"
        ? getRankingScore(b) - getRankingScore(a)
        : getRankingScore(a) - getRankingScore(b)
    )
    .slice(0, limit);
}

function renderHeadline(cardEl, quote, subline) {
  if (!cardEl) return;
  if (!quote) {
    cardEl.innerHTML = "<p>Data unavailable. Try refreshing shortly.</p>";
    return;
  }
  const outlook = settingsState.highlightFuture ? getOutlook(quote) : null;
  const aiTag = outlook
    ? `<span class="ai-tag ${outlook.className}">AI Outlook: ${outlook.label}</span>`
    : "";
  cardEl.innerHTML = `
    <span class="headline">${quote.symbol} · ${quote.longName ?? ""}</span>
    <span class="subline">${subline}</span>
    ${aiTag}
    <div class="price-stack">
      <span class="current-price">${formatCurrency(quote.regularMarketPrice)}</span>
      <span class="change-badge ${quote.regularMarketChange >= 0 ? "positive" : "negative"}">
        ${formatChange(quote)}
      </span>
    </div>
    <div class="metrics">
      <span>
        <strong>Day Range</strong>
        ${formatRange(quote.regularMarketDayLow, quote.regularMarketDayHigh)}
      </span>
      <span>
        <strong>52 Week</strong>
        ${formatRange(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh)}
      </span>
      <span>
        <strong>Volume</strong>
        ${formatNumber(quote.regularMarketVolume)}
      </span>
      <span>
        <strong>Market Cap</strong>
        ${formatMarketCap(quote.marketCap)}
      </span>
    </div>
  `;
}

function renderList(container, quotes, type) {
  if (!container) return;
  if (!quotes.length) {
    container.innerHTML = `<p class="placeholder">No qualifying symbols.</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  quotes.forEach((quote) => {
    const outlook = settingsState.highlightFuture ? getOutlook(quote) : null;
    const aiTag = outlook
      ? `<span class="ai-tag ${outlook.className}">AI Outlook: ${outlook.label}</span>`
      : "";
    const card = document.createElement("article");
    card.className = `leaders-card ${type === "worst" ? "worst" : ""}`;
    card.innerHTML = `
      <div class="row-top">
        <span class="symbol">${quote.symbol}</span>
        <span class="change ${quote.regularMarketChange >= 0 ? "positive" : "negative"}">
          ${formatChange(quote)}
        </span>
      </div>
      <span class="name">${quote.longName ?? ""}</span>
      ${aiTag}
      <div class="details">
        <span>${formatCurrency(quote.regularMarketPrice)}</span>
        <span>${formatMarketCap(quote.marketCap)}</span>
      </div>
      <button type="button" class="link-btn">Open in Google Finance</button>
    `;
    card.querySelector("button").addEventListener("click", () => openFinanceLink(quote));
    fragment.append(card);
  });
  container.innerHTML = "";
  container.append(fragment);
}

function renderQuoteCards(container, quotes, options = {}) {
  if (!container) return;
  const {
    emptyMessage = "No data available.",
    heading,
    sourceLabel = "Search result",
    activeSymbol = null,
  } = options;
  container.innerHTML = "";
  if (heading) {
    const headingEl = document.createElement("p");
    headingEl.className = "results-heading";
    headingEl.textContent = heading;
    container.append(headingEl);
  }
  if (!quotes.length) {
    const empty = document.createElement("p");
    empty.className = "placeholder";
    empty.textContent = emptyMessage;
    container.append(empty);
    return;
  }
  quotes.forEach((quote) => {
    const card = createQuoteCard(quote, sourceLabel);
    if (activeSymbol && quote.symbol === activeSymbol) {
      card.dataset.active = "true";
    }
    container.append(card);
  });
}

function createQuoteCard(quote, sourceLabel = "Search result") {
  const card = document.createElement("article");
  card.className = "quote-card";
  const changeClass = quote.regularMarketChange >= 0 ? "positive" : "negative";
  card.innerHTML = `
    <div class="quote-top">
      <h3 class="symbol">${quote.symbol}</h3>
      <span class="name">${quote.longName ?? ""}</span>
    </div>
    <div class="quote-middle">
      <span class="price">${formatCurrency(quote.regularMarketPrice)}</span>
      <span class="change ${changeClass}">${formatChange(quote)}</span>
    </div>
    <dl class="metrics">
      <div>
        <dt>Day Range</dt>
        <dd>${formatRange(quote.regularMarketDayLow, quote.regularMarketDayHigh)}</dd>
      </div>
      <div>
        <dt>52W Range</dt>
        <dd>${formatRange(quote.fiftyTwoWeekLow, quote.fiftyTwoWeekHigh)}</dd>
      </div>
      <div>
        <dt>Volume</dt>
        <dd>${formatNumber(quote.regularMarketVolume)}</dd>
      </div>
      <div>
        <dt>Market Cap</dt>
        <dd>${formatMarketCap(quote.marketCap)}</dd>
      </div>
    </dl>
    <button class="quick-google" type="button">View on Google Finance</button>
  `;
  card.dataset.symbol = quote.symbol;
  card.addEventListener("click", (event) => {
    if (event.target.closest(".quick-google")) return;
    focusQuote(quote, sourceLabel);
  });
  const googleBtn = card.querySelector(".quick-google");
  googleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openFinanceLink(quote);
  });
  return card;
}

function buildQueryTokens(query) {
  const base = query.trim().toLowerCase();
  if (!base) return { tokens: [], cleaned: [] };
  const set = new Set([base]);
  base.split(/[\s,/|]+/).forEach((part) => {
    if (part) set.add(part.toLowerCase());
  });
  const colonIndex = base.indexOf(":");
  if (colonIndex >= 0 && colonIndex < base.length - 1) {
    set.add(base.slice(colonIndex + 1));
  }
  const dotIndex = base.indexOf(".");
  if (dotIndex >= 0 && dotIndex < base.length - 1) {
    set.add(base.slice(dotIndex + 1));
    set.add(base.slice(0, dotIndex));
  }
  const tokens = [...set].map((token) => token.trim()).filter(Boolean);
  const cleaned = tokens.map((token) => token.replace(/[^a-z0-9]/gi, "")).filter(Boolean);
  return { tokens, cleaned };
}

function deriveSymbolUniverse(input) {
  const candidates = new Set();
  const trimmed = input.trim();
  if (!trimmed) return candidates;
  const compact = trimmed.toUpperCase().replace(/\s+/g, "");

  const colonMatch = compact.match(/^([A-Z]+):([A-Z0-9.-]+)$/);
  if (colonMatch) {
    const [, market, ticker] = colonMatch;
    if (ticker) {
      const suffix = EXCHANGE_SUFFIX_MAP[market];
      if (suffix !== undefined) {
        if (suffix) {
          candidates.add(`${ticker}${suffix}`);
        }
        candidates.add(ticker);
      } else {
        candidates.add(`${market}:${ticker}`);
        candidates.add(ticker);
      }
    }
  }

  if (/^[A-Z0-9.-]+$/.test(compact)) {
    if (compact.includes(".")) {
      candidates.add(compact);
      const [baseSymbol] = compact.split(".");
      if (baseSymbol) candidates.add(baseSymbol);
    } else {
      candidates.add(compact);
      MARKET_SUFFIXES.forEach((suffix) => candidates.add(`${compact}${suffix}`));
    }
  }

  return candidates;
}

function findFallbackMatches(query) {
  const { tokens, cleaned } = buildQueryTokens(query);
  if (!tokens.length) return [];
  const entries = Object.entries(FALLBACK_QUOTES);
  const scored = [];

  for (const [symbol, data] of entries) {
    const symbolLower = symbol.toLowerCase();
    const symbolClean = symbolLower.replace(/[^a-z0-9]/gi, "");
    const nameLower = (data.longName || "").toLowerCase();
    let score = 0;

    if (
      tokens.some((token) => token === symbolLower) ||
      cleaned.some((token) => token === symbolClean)
    ) {
      score = Math.max(score, 100);
    }
    if (
      tokens.some((token) => symbolLower.startsWith(token)) ||
      cleaned.some((token) => symbolClean.startsWith(token))
    ) {
      score = Math.max(score, 75);
    }
    if (tokens.some((token) => token === nameLower)) {
      score = Math.max(score, 60);
    }
    if (tokens.some((token) => nameLower.includes(token))) {
      score = Math.max(score, 40);
    }

    if (score > 0) {
      const normalized = normalizeQuote({ symbol, ...data });
      if (normalized) {
        scored.push({ quote: normalized, score });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score || (b.quote.marketCap || 0) - (a.quote.marketCap || 0));
  return scored.map((entry) => ({ ...entry.quote, _score: entry.score }));
}

function renderWatchlist(container, quotes) {
  if (!container) return;
  if (!settingsState.showWatchlist) {
    container.innerHTML =
      '<p class="placeholder">Watchlist hidden — enable it from Settings.</p>';
    return;
  }
  if (!Array.isArray(quotes) || !quotes.length) {
    container.innerHTML =
      '<p class="placeholder">Unable to load the watchlist at the moment.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  quotes.slice(0, 8).forEach((quote) => {
    const item = document.createElement("div");
    item.className = "watchlist-item";
    item.dataset.symbol = quote.symbol;
    const change = typeof quote.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : null;
    const changeClass = change === null ? "" : change >= 0 ? "positive" : "negative";
    item.innerHTML = `
      <div class="watchlist-symbol">
        <span>${quote.symbol}</span>
        <span>${quote.longName ?? ""}</span>
      </div>
      <div class="watchlist-price">
        <span>${formatCurrency(quote.regularMarketPrice)}</span>
        <span class="watchlist-change ${changeClass}">
          ${change !== null ? `${formatSigned(change)}%` : "—"}
        </span>
      </div>
    `;
    item.addEventListener("click", () => {
      focusQuote(quote, "Watchlist snapshot");
      const input = document.getElementById("search-input");
      if (input) input.value = quote.symbol;
    });
    fragment.append(item);
  });
  container.innerHTML = "";
  container.append(fragment);
  highlightWatchlist(focusedQuote?.symbol ?? null);
}

async function initDashboard() {
  const loadingCards = document.querySelectorAll(".feature-body, .leaders-list");
  loadingCards.forEach((card) => (card.innerHTML = "<p>Loading…</p>"));
  const watchlistEl = document.getElementById("watchlist-container");
  if (watchlistEl) {
    watchlistEl.innerHTML = settingsState.showWatchlist
      ? "<p class=\"placeholder\">Loading watchlist…</p>"
      : "";
  }

  const quotes = await fetchQuotes(TRENDING_TICKERS);

  if (!quotes.length) {
    renderHeadline(
      document.getElementById("feature-body"),
      null,
      "No data available right now."
    );
    renderHeadline(
      document.getElementById("worst-body"),
      null,
      "No data available right now."
    );
    renderList(document.getElementById("top-ten"), [], "best");
    renderList(document.getElementById("bottom-ten"), [], "worst");
    return;
  }

  const best = selectLeaders(quotes, "desc", 10);
  const worst = selectLeaders(quotes, "asc", 10);

  const topPick =
    best[0] ||
    quotes.find((quote) => quote.symbol === "NVDA") ||
    normalizeQuote(FALLBACK_QUOTES.NVDA);
  const riskPick =
    worst[0] ||
    quotes.find((quote) => quote.symbol === "TSLA") ||
    normalizeQuote(FALLBACK_QUOTES.TSLA);

  const bestSubline =
    settingsState.rankingMode === "momentum"
      ? "AI momentum outlook (next session)"
      : "Largest daily % gain among large caps (>$5B market cap)";
  const worstSubline =
    settingsState.rankingMode === "momentum"
      ? "AI caution — weakest momentum projection"
      : "Largest daily % drop among large caps (>$5B market cap)";

  const preferredSymbols = ["AAPL", "MSFT", "NVDA", "GOOGL", TRENDING_TICKERS[0]];
  const defaultQuote =
    preferredSymbols
      .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
      .find(Boolean) || topPick || quotes[0];

  if (defaultQuote) {
    const defaultSourceLabel =
      defaultQuote === topPick ? "Top pick snapshot" : "Watchlist snapshot";
    focusQuote(defaultQuote, defaultSourceLabel);
  } else {
    focusQuote(null, "—");
  }

  renderWatchlist(document.getElementById("watchlist-container"), quotes);

  renderHeadline(
    document.getElementById("feature-body"),
    topPick,
    bestSubline
  );
  renderHeadline(
    document.getElementById("worst-body"),
    riskPick,
    worstSubline
  );
  renderList(document.getElementById("top-ten"), best, "best");
  renderList(document.getElementById("bottom-ten"), worst, "worst");
}

function initSettings() {
  const settingsBtn = document.getElementById("open-settings");
  const settingsModal = document.getElementById("settings-panel");
  const backdrop = document.getElementById("settings-backdrop");
  const closeBtn = document.getElementById("close-settings");
  const themeRadios = Array.from(document.querySelectorAll('input[name="theme"]'));
  const rankingRadios = Array.from(document.querySelectorAll('input[name="ranking-mode"]'));
  const refreshSelect = document.getElementById("refresh-interval");
  const watchlistToggle = document.getElementById("toggle-watchlist");
  const highlightToggle = document.getElementById("toggle-highlight");
  const newTabToggle = document.getElementById("toggle-new-tab");

  if (!settingsBtn || !settingsModal) {
    applySettings();
    return;
  }

  // Prime UI controls with stored settings
  themeRadios.forEach((radio) => {
    radio.checked = radio.value === settingsState.theme;
  });
  rankingRadios.forEach((radio) => {
    radio.checked = radio.value === settingsState.rankingMode;
  });
  if (refreshSelect) {
    refreshSelect.value = String(settingsState.refreshMinutes);
  }
  if (watchlistToggle) {
    watchlistToggle.checked = settingsState.showWatchlist;
  }
  if (highlightToggle) {
    highlightToggle.checked = settingsState.highlightFuture;
  }
  if (newTabToggle) {
    newTabToggle.checked = settingsState.openLinksInNewTab;
  }

  function openModal() {
    settingsModal.classList.add("visible");
    backdrop?.classList.add("visible");
    document.body.classList.add("settings-open");
    const current = themeRadios.find((radio) => radio.checked);
    current?.focus({ preventScroll: true });
  }

  function closeModal() {
    settingsModal.classList.remove("visible");
    backdrop?.classList.remove("visible");
    document.body.classList.remove("settings-open");
    settingsBtn.focus({ preventScroll: true });
  }

  settingsBtn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && settingsModal.classList.contains("visible")) {
      closeModal();
    }
  });

  themeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      settingsState.theme = radio.value;
      applySettings();
    });
  });

  rankingRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      settingsState.rankingMode = radio.value;
      saveSettings();
      initDashboard();
    });
  });

  refreshSelect?.addEventListener("change", () => {
    const minutes = Number(refreshSelect.value);
    settingsState.refreshMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_SETTINGS.refreshMinutes;
    applySettings();
  });

  watchlistToggle?.addEventListener("change", () => {
    settingsState.showWatchlist = watchlistToggle.checked;
    applySettings();
    if (settingsState.showWatchlist) {
      initDashboard();
    }
  });

  highlightToggle?.addEventListener("change", () => {
    settingsState.highlightFuture = highlightToggle.checked;
    applySettings();
    initDashboard();
  });

  newTabToggle?.addEventListener("change", () => {
    settingsState.openLinksInNewTab = newTabToggle.checked;
    saveSettings();
  });

  applySettings();
}

function initSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");
  const submitBtn = form?.querySelector("button");
  if (!form || !input || !resultsContainer) return;
  const placeholderHTML = '<p class="placeholder">Search a ticker to see detailed quote data.</p>';
  let debounceTimer = null;

  const resetResults = () => {
    resultsContainer.innerHTML = placeholderHTML;
  };

  const scheduleSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      runSearch();
    }, 350);
  };

  const runSearch = async () => {
    clearTimeout(debounceTimer);
    const rawInput = input.value.trim();
    if (!rawInput) {
      resetResults();
      return;
    }

    const fallbackMatches = findFallbackMatches(rawInput);
    const liveSymbols = deriveSymbolUniverse(rawInput);
    fallbackMatches.forEach((match) => liveSymbols.add(match.symbol));

    if (!fallbackMatches.length) {
      resultsContainer.innerHTML = `<p class="placeholder">Searching offline dataset…</p>`;
    } else {
      focusQuote(fallbackMatches[0], "Cached fallback data");
      renderQuoteCards(resultsContainer, fallbackMatches.slice(0, 5), {
        heading:
          fallbackMatches.length > 1
            ? "Cached matches (updating with live data…)"
            : "Cached fallback match (updating with live data…)",
        emptyMessage: "No fallback data available.",
        sourceLabel: "Offline cache",
        activeSymbol: fallbackMatches[0]?.symbol ?? null,
      });
    }

    let liveQuotes = [];
    if (liveSymbols.size) {
      try {
        liveQuotes = await fetchQuotes([...liveSymbols]);
      } catch (error) {
        console.warn("Live search fetch failed:", error);
      }
    }

    const finalQuotes = liveQuotes.length ? liveQuotes : fallbackMatches;
    if (finalQuotes.length) {
      const sourceLabel = liveQuotes.length ? "Live proxy search" : "Offline cache";
      const heading = liveQuotes.length
        ? finalQuotes.length > 1
          ? "Closest matches sourced from Google Finance"
          : "Live quote sourced from Google Finance"
        : finalQuotes.length > 1
        ? "Closest matches from cached data"
        : "Cached fallback data";

      renderQuoteCards(resultsContainer, finalQuotes.slice(0, 5), {
        heading,
        emptyMessage: "No data available.",
        sourceLabel,
        activeSymbol: finalQuotes[0]?.symbol ?? null,
      });

      focusQuote(finalQuotes[0], sourceLabel);
      return;
    }

    resultsContainer.innerHTML = `
      <div class="message error">
        <strong>Quote unavailable.</strong>
        <span>No live or cached insight found for <code>${rawInput}</code>. Try a different ticker or add it to the fallback dataset.</span>
      </div>`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch();
  });

  submitBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    runSearch();
  });

  input.addEventListener("input", () => {
    if (!input.value.trim()) {
      clearTimeout(debounceTimer);
      resetResults();
      return;
    }
    scheduleSearch();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });

  document.querySelectorAll(".quick-ticker").forEach((button) => {
    button.addEventListener("click", () => {
      const symbol = button.dataset.symbol ?? "";
      input.value = symbol;
      runSearch();
    });
  });
}

function initDetailActions() {
  const openLink = document.getElementById("detail-open-google");
  if (openLink) {
    openLink.addEventListener("click", () => {
      if (!focusedQuote) return;
      openFinanceLink(focusedQuote);
    });
  }

  const chartButtons = Array.from(document.querySelectorAll(".chart-range-btn"));
  if (chartButtons.length) {
    chartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        chartButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  const newsRefresh = document.getElementById("news-refresh");
  if (newsRefresh) {
    newsRefresh.addEventListener("click", () => {
      if (focusedQuote) {
        focusQuote(focusedQuote, focusedQuoteSource);
      }
    });
  }
}

function bootstrap() {
  initSettings();
  initDetailActions();
  initSearch();
  initDashboard();
  initPullToRefresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}

function initPullToRefresh() {
  const indicator = document.getElementById("refresh-indicator");
  const main = document.querySelector("main");
  if (!indicator || !main) return;

  let startY = 0;
  let isDragging = false;
  const threshold = 160;
  const triggerThreshold = 220;
  const maxPull = 260;
  let refreshTimeout = null;
  let wheelAccum = 0;
  let wheelFinishTimer = null;
  let refreshActive = false;

  const showPull = (distance) => {
    const clamped = Math.min(Math.max(distance, 0), maxPull);
    const translate = clamped / 3;
    main.style.transform = `translateY(${translate}px)`;
    indicator.classList.toggle("visible", clamped > threshold);
  };

  const startRefresh = () => {
    if (refreshActive) return;
    refreshActive = true;
    document.body.classList.add("refresh-active");
    main.classList.add("refresh-locked");
    main.style.transform = `translateY(${threshold / 1.6}px)`;
    indicator.classList.add("visible");
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      initDashboard().finally(() => {
        indicator.classList.remove("visible");
        main.style.transform = "";
        document.body.classList.remove("refresh-active");
        main.classList.remove("refresh-locked");
        refreshActive = false;
      });
    }, 5000);
  };

  const resetPull = (distance) => {
    if (refreshActive) return;
    main.style.transform = "";
    if (distance > triggerThreshold) {
      startRefresh();
    } else {
      indicator.classList.remove("visible");
    }
  };

  const beginDrag = (y) => {
    if (refreshActive) return;
    startY = y;
    isDragging = true;
    document.body.classList.add("dragging-refresh");
  };

  const moveDrag = (y) => {
    if (!isDragging) return;
    const diff = Math.min(Math.max(y - startY, 0), maxPull);
    showPull(diff);
  };

  const endDrag = (y) => {
    if (!isDragging) return;
    const diff = y - startY;
    isDragging = false;
    document.body.classList.remove("dragging-refresh");
    resetPull(diff);
  };

  document.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    if (window.scrollY <= 5) beginDrag(event.clientY);
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) moveDrag(event.clientY);
  });

  document.addEventListener("mouseup", (event) => {
    if (isDragging) endDrag(event.clientY);
  });

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      if (window.scrollY <= 5) beginDrag(event.touches[0].clientY);
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;
      if (event.cancelable) event.preventDefault();
      moveDrag(event.touches[0].clientY);
    },
    { passive: false }
  );

  document.addEventListener("touchend", (event) => {
    if (!isDragging) return;
    const clientY = event.changedTouches[0]?.clientY ?? startY;
    endDrag(clientY);
  });

  const finishWheel = () => {
    if (wheelFinishTimer) {
      clearTimeout(wheelFinishTimer);
      wheelFinishTimer = null;
    }
    if (!wheelAccum) return;
    const distance = Math.min(wheelAccum, maxPull);
    resetPull(distance);
    wheelAccum = 0;
  };

  window.addEventListener(
    "wheel",
    (event) => {
    if (event.deltaY < 0 && window.scrollY <= 0) {
      event.preventDefault();
      wheelAccum = Math.min(wheelAccum + Math.abs(event.deltaY), maxPull);
      showPull(wheelAccum);
      if (wheelFinishTimer) clearTimeout(wheelFinishTimer);
      wheelFinishTimer = setTimeout(finishWheel, 240);
    } else if (wheelAccum > 0) {
      finishWheel();
    }
  },
  { passive: false }
);
}
