// Cricket headlines from ESPNcricinfo's public RSS feed. Fetched at most once
// every 10 minutes; if the feed is down the last good copy is served.
const FEED = "https://www.espncricinfo.com/rss/content/story/feeds/0.xml";
const TTL_MS = 10 * 60 * 1000;

let cache = { at: 0, articles: [] };
let inFlight = null;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, name) => ENTITIES[name] ?? m)
    .replace(/<[^>]+>/g, "")
    .trim();

const tag = (item, name) => decode(item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1]);
const https = (url) => (url ? url.replace(/^http:\/\//, "https://") : null);

export const parseFeed = (xml) =>
  (xml.match(/<item>[\s\S]*?<\/item>/g) || [])
    .map((item) => {
      const published = new Date(tag(item, "pubDate"));
      return {
        id: tag(item, "guid") || tag(item, "link"),
        title: tag(item, "title"),
        summary: tag(item, "description") || null,
        // full-size photo for the lead story, the smaller cover for thumbnails
        image: https(item.match(/<media:content[^>]*url="([^"]+)"/)?.[1]) || https(tag(item, "coverImages")) || null,
        thumbnail: https(tag(item, "coverImages")) || https(item.match(/<media:content[^>]*url="([^"]+)"/)?.[1]) || null,
        url: tag(item, "url") || tag(item, "link"),
        publishedAt: Number.isNaN(published.getTime()) ? null : published.toISOString(),
      };
    })
    .filter((a) => a.title && a.url)
    // the feed is roughly, not strictly, newest first
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

const refresh = async () => {
  const res = await fetch(FEED, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ScorePulse/1.0)" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`feed returned ${res.status}`);
  const articles = parseFeed(await res.text());
  if (!articles.length) throw new Error("feed had no stories");
  cache = { at: Date.now(), articles };
};

export const getNews = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  if (Date.now() - cache.at > TTL_MS) {
    // one fetch at a time, however many visitors arrive together
    inFlight ||= refresh()
      .catch((err) => console.error("News feed error:", err.message))
      .finally(() => (inFlight = null));
    await inFlight;
  }
  if (!cache.articles.length) return res.status(503).json({ error: "News is unavailable right now" });
  res.set("Cache-Control", "public, max-age=300");
  res.json({ source: "ESPNcricinfo", updatedAt: new Date(cache.at).toISOString(), articles: cache.articles.slice(0, limit) });
};
