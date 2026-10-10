// Reading Cricbuzz pages. They are Next.js apps that stream their data as
// self.__next_f.push([1,"..."]) chunks; decoding those gives plain JSON.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

export const CRICBUZZ = "https://www.cricbuzz.com";

export const flightData = (html) => {
  let out = "";
  for (const m of html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)) {
    out += JSON.parse(`"${m[1]}"`);
  }
  return out;
};

// The JSON object or array that follows `"key":` in a blob of text.
export const valueAfter = (text, key, from = 0) => {
  const at = text.indexOf(`"${key}":`, from);
  if (at < 0) return null;
  const start = at + key.length + 3;
  const open = text[start];
  if (open !== "{" && open !== "[") return null;
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === "\\") i++;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) {
      try {
        return JSON.parse(text.slice(start, i + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
};

// Every value for `key` on the page (pages repeat blocks, e.g. a header ticker
// and the main list both carry "typeMatches").
export const valuesAfter = (text, key) => {
  const out = [];
  for (let at = text.indexOf(`"${key}":`); at >= 0; at = text.indexOf(`"${key}":`, at + 1)) {
    const v = valueAfter(text, key, at);
    if (v) out.push(v);
  }
  return out;
};

export const fetchPage = async (path) => {
  const res = await fetch(`${CRICBUZZ}${path}`, {
    headers: { "User-Agent": UA, "Accept-Language": "en" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Cricbuzz ${path} returned ${res.status}`);
  return flightData(await res.text());
};

// Cricbuzz serves "$undefined" for missing values.
export const clean = (v) => (v === undefined || v === null || v === "$undefined" || v === "" ? null : v);

export const imageUrl = (imageId, slug = "image", size = "72x54") =>
  imageId ? `https://static.cricbuzz.com/a/img/v1/${size}/i1/c${imageId}/${slug}.jpg` : null;

// In-memory cache: one refresh at a time, and the last good value is kept
// (and served) if a refresh fails.
const store = new Map();

export const cached = async (key, ttlMs, load) => {
  const entry = store.get(key) || { at: 0, value: null, inFlight: null };
  store.set(key, entry);
  if (Date.now() - entry.at > ttlMs) {
    entry.inFlight ||= load()
      .then((value) => Object.assign(entry, { value, at: Date.now() }))
      .catch((err) => console.error(`${key} refresh failed:`, err.message))
      .finally(() => (entry.inFlight = null));
    await entry.inFlight;
  }
  return entry.value ? { value: entry.value, updatedAt: new Date(entry.at).toISOString() } : null;
};
