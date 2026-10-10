// Fetching and parsing for the player sync. Three sources:
//   Cricbuzz   - squads, profile, styles, teams, rankings, image, batting & bowling
//                for Test / ODI / T20I / IPL (embedded Next.js data on each page)
//   Statsguru  - ESPNcricinfo's stats engine: fielding records, plus full records
//                for players Cricbuzz doesn't list (domestic sides)
//   Cricsheet  - people registry, to tie imported ball-by-ball matches to players
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { flightData, valueAfter as objectAfter } from "../../src/lib/cricbuzz.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(here, "../../.cache/players");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

export const CRICBUZZ = "https://www.cricbuzz.com";
export const STATSGURU = "https://stats.espncricinfo.com/ci/engine";

/* ------------------------------------------------------------------ */
/* HTTP: cached on disk, a few requests at a time, retried with backoff */
/* ------------------------------------------------------------------ */

let fresh = false;
export const setFresh = (v) => (fresh = v);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const limit = (n) => {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= n || !queue.length) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn()
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
};

const hosts = new Map();
const hostLimit = (url) => {
  const host = new URL(url).host;
  if (!hosts.has(host)) hosts.set(host, limit(3));
  return hosts.get(host);
};

export const stats = { requests: 0, cached: 0 };

export const get = async (url) => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, crypto.createHash("sha1").update(url).digest("hex") + ".html");
  if (!fresh && fs.existsSync(file)) {
    stats.cached++;
    return fs.readFileSync(file, "utf-8");
  }
  return hostLimit(url)(async () => {
    for (let attempt = 1; ; attempt++) {
      try {
        stats.requests++;
        const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" }, redirect: "follow" });
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.text();
        fs.writeFileSync(file, body);
        await sleep(250);
        return body;
      } catch (err) {
        if (attempt >= 4) throw new Error(`${url}: ${err.message}`);
        await sleep(1500 * attempt);
      }
    }
  });
};

/* ------------------------------------------------------------------ */
/* CRICBUZZ                                                            */
/* ------------------------------------------------------------------ */

export const parseTeamPage = (html) => {
  const data = flightData(html);
  const seen = new Map();
  for (const m of data.matchAll(/"href":"\/profiles\/(\d+)\/([a-z0-9-]+)","title":"([^"]+)"/g)) {
    if (!seen.has(m[1])) seen.set(m[1], { cricbuzzId: Number(m[1]), slug: m[2], name: m[3] });
  }
  return [...seen.values()];
};

// Cricbuzz's team index: which team ids are international, league or domestic sides.
export const parseTeamIndex = (html) => [...new Set(html.match(/cricket-team\/[a-z0-9-]+\/\d+/g) || [])].map((s) => Number(s.split("/").pop()));

const num = (v) => {
  if (v === undefined || v === null || v === "" || v === "-" || v === "--") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

const FORMAT_COLUMNS = { Test: "TEST", ODI: "ODI", T20: "T20I", T20I: "T20I", IPL: "IPL" };

// { headers: ["ROWHEADER","Test",...], values: [{ values: ["Matches","123",...] }] } -> { TEST: { Matches: "123" } }
const statGrid = (grid) => {
  if (!grid?.headers) return {};
  const out = {};
  grid.headers.slice(1).forEach((h, col) => {
    const format = FORMAT_COLUMNS[h];
    if (!format) return;
    const row = {};
    for (const r of grid.values || []) row[r.values[0]] = r.values[col + 1];
    out[format] = row;
  });
  return out;
};

const battingRecord = (r) => {
  const matches = num(r.Matches);
  if (!matches) return null;
  return {
    matches,
    innings: num(r.Innings) ?? 0,
    not_outs: num(r["Not Out"]) ?? 0,
    runs: num(r.Runs) ?? 0,
    balls: num(r.Balls),
    highest: num(r.Innings) ? r.Highest || null : null,
    average: num(r.Average),
    strike_rate: num(r.SR),
    hundreds: num(r["100s"]) ?? 0,
    double_hundreds: (num(r["200s"]) ?? 0) + (num(r["300s"]) ?? 0) + (num(r["400s"]) ?? 0),
    fifties: num(r["50s"]) ?? 0,
    fours: num(r.Fours),
    sixes: num(r.Sixes),
    ducks: num(r.Ducks),
  };
};

const bowlingRecord = (r) => {
  const matches = num(r.Matches);
  if (!matches || !num(r.Innings)) return null; // never bowled in this format
  const balls = num(r.Balls) ?? 0;
  const wickets = num(r.Wickets) ?? 0;
  return {
    matches,
    innings: num(r.Innings) ?? 0,
    balls,
    runs: num(r.Runs) ?? 0,
    maidens: num(r.Maidens),
    wickets,
    // Cricbuzz prints 0.0 when there is nothing to divide by
    average: wickets ? num(r.Avg) : null,
    economy: balls ? num(r.Eco) : null,
    strike_rate: wickets ? num(r.SR) : null,
    best_innings: wickets ? r.BBI : null,
    best_match: wickets ? r.BBM : null,
    four_wickets: num(r["4w"]),
    five_wickets: num(r["5w"]) ?? 0,
    ten_wickets: num(r["10w"]) ?? 0,
  };
};

const ROLE = {
  batsman: "batter",
  batter: "batter",
  bowler: "bowler",
  "batting allrounder": "allrounder",
  "bowling allrounder": "allrounder",
  allrounder: "allrounder",
  "wk-batsman": "wk",
  "wk-batter": "wk",
  wicketkeeper: "wk",
};
const ROLE_LABEL = { Batsman: "Batter", "WK-Batsman": "WK-Batter" };

const MONTHS = "January February March April May June July August September October November December".split(" ");
const isoDate = (s) => {
  const m = String(s || "").match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1]) + 1;
  return month ? `${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}` : null;
};

const DEBUT_FORMAT = {
  "Test Debut": "TEST",
  "One Day International Debut": "ODI",
  "T20 International Debut": "T20I",
  "IPL Debut": "IPL",
};

const debutsFrom = (html) => {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let doc;
    try {
      doc = JSON.parse(m[1]);
    } catch {
      continue;
    }
    const events = doc?.performerIn || doc?.mainEntity?.performerIn;
    if (!Array.isArray(events)) continue;
    for (const e of events) {
      const format = DEBUT_FORMAT[e.name];
      if (!format) continue;
      // "vs West Indies,  2011-06-20, Sabina Park"
      const [opp, , ...venue] = String(e.location?.name || "").split(",").map((s) => s.trim());
      out.push({
        format,
        date: e.startDate || null,
        opponent: opp?.replace(/^vs\s+/, "") || e.competitor?.[0]?.name?.trim() || null,
        venue: venue.join(", ") || null,
      });
    }
  }
  return out;
};

// Last few innings: [matchId, score, opposition, format, "03 Oct 26"]
const formRows = (grid) =>
  (grid?.rows || []).map((r) => {
    const [, score, opp, format, date] = r.values;
    return { score, opponent: opp, format, date };
  });

const RANK_FORMATS = { test: "test", odi: "odi", t20: "t20i" };
const rankingsFrom = (r) => {
  if (!r) return null;
  const out = {};
  for (const kind of ["bat", "bowl", "all"]) {
    for (const [src, dst] of Object.entries(RANK_FORMATS)) {
      const rank = num(r[kind]?.[`${src}Rank`]);
      const best = num(r[kind]?.[`${src}BestRank`]);
      if (rank || best) (out[kind] ||= {})[dst] = { rank, best };
    }
  }
  return Object.keys(out).length ? out : null;
};

export const parseProfile = (html, cricbuzzId, slug) => {
  const data = flightData(html);
  const p = objectAfter(data, "playerData");
  if (!p?.name) return null;
  const batting = statGrid(objectAfter(data, "battingStats"));
  const bowling = statGrid(objectAfter(data, "bowlingStats"));
  const roleKey = String(p.role || "").toLowerCase();
  return {
    cricbuzzId,
    name: p.name.trim(),
    fullName: p.fullName?.trim() || null,
    country: p.intlTeam?.trim() || null,
    role: ROLE[roleKey] || null,
    roleLabel: p.role ? ROLE_LABEL[p.role] || p.role : null,
    battingStyle: p.bat?.trim() || null,
    bowlingStyle: p.bowl?.trim() || null,
    dateOfBirth: isoDate(p.DoBFormat || p.DoB),
    birthPlace: p.birthPlace?.trim() || null,
    height: p.height?.trim() || null,
    faceImageId: p.faceImageId || null,
    slug,
    teams: (p.teamNameIds || [])
      .filter((t) => t.teamName?.trim())
      .map((t) => ({ cricbuzzTeamId: Number(t.teamId), name: t.teamName.trim() })),
    rankings: rankingsFrom(p.rankings),
    debuts: debutsFrom(html),
    recentForm: { batting: formRows(p.recentBatting), bowling: formRows(p.recentBowling) },
    batting: Object.fromEntries(Object.entries(batting).map(([f, r]) => [f, battingRecord(r)]).filter(([, r]) => r)),
    bowling: Object.fromEntries(Object.entries(bowling).map(([f, r]) => [f, bowlingRecord(r)]).filter(([, r]) => r)),
  };
};

export const imageUrl = (faceImageId, slug) =>
  faceImageId ? `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${faceImageId}/${slug || "player"}.jpg` : null;

/* ------------------------------------------------------------------ */
/* STATSGURU                                                           */
/* ------------------------------------------------------------------ */

const cellText = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const SG_CLASS = { 1: "TEST", 2: "ODI", 3: "T20I", 6: "T20" };

// Players section of a Statsguru search: [{ cricinfoId, shortName, knownAs, country, counts: { TEST: 123 } }]
export const parseSearch = (html) => {
  if (!html) return [];
  const start = html.indexOf('id="gurusearch_player"');
  if (start < 0) return [];
  const end = html.indexOf('id="gurusearch_team"', start);
  const block = html.slice(start, end > 0 ? end : undefined);
  const out = [];
  for (const row of block.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || []) {
    const cells = row.match(/<td[^>]*>[\s\S]*?<\/td>/g) || [];
    if (cells.length < 3) continue;
    const names = [...cells[0].matchAll(/<span[^>]*>([^<]*)<\/span>/g)].map((m) => cellText(m[1]));
    const counts = {};
    let cricinfoId = null;
    for (const m of cells[2].matchAll(/player\/(\d+)\.html\?class=(\d+);[^"]*"[^>]*>[^<]*<\/a>\s*\(([^)]*?),\s*(\d+) match/g)) {
      cricinfoId = Number(m[1]);
      if (SG_CLASS[m[2]]) counts[SG_CLASS[m[2]]] = Number(m[4]);
    }
    if (!cricinfoId) continue;
    out.push({
      cricinfoId,
      shortName: names[0] || null,
      knownAs: names[1]?.replace(/^\(|\)$/g, "") || names[0] || null,
      country: cellText(cells[1]),
      counts,
    });
  }
  return out;
};

export const searchUrl = (q) => `${STATSGURU}/stats/analysis.html?search=${encodeURIComponent(q).replace(/%20/g, "+")};template=analysis`;

export const playerUrl = (cricinfoId, type, { ipl = false } = {}) =>
  `${STATSGURU}/player/${cricinfoId}.html?class=${ipl ? 6 : 11};template=results;type=${type}${ipl ? ";trophy=117" : ""}`;

const SG_GROUPS = { "Test matches": "TEST", "One-Day Internationals": "ODI", "Twenty20 Internationals": "T20I" };

// "Career averages" table -> { TEST: { Span, Mat, ... }, ... }. For an IPL
// (trophy-filtered) page the "filtered" row is returned as IPL.
const careerTable = (html, { ipl }) => {
  if (!html) return {};
  const at = html.indexOf("Career averages");
  if (at < 0) return {};
  // per-format rows sit in the "Career summary" table that follows
  const summary = html.indexOf("Career summary", at);
  const table = html.slice(at, html.indexOf("</table>", summary > 0 ? summary : at));
  const rows = (table.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || []).map((r) =>
    (r.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/g) || []).map(cellText)
  );
  const header = rows.find((r) => r.includes("Mat"));
  if (!header) return {};
  const out = {};
  for (const r of rows) {
    const label = r[0];
    const format = ipl ? (label === "filtered" ? "IPL" : null) : SG_GROUPS[label];
    if (!format) continue;
    out[format] = Object.fromEntries(header.map((h, i) => [h, r[i]]).filter(([h]) => h));
  }
  return out;
};

// Statsguru repeats "Ct" for keeper/fielder columns; header order is Dis, Ct, St, Ct Wk, Ct Fi, MD, D/I
export const parseFielding = (html, opts = {}) =>
  Object.fromEntries(
    Object.entries(careerTable(html, opts))
      .map(([format, r]) => {
        const matches = num(r.Mat);
        if (!matches) return [format, null];
        return [
          format,
          {
            span: r.Span || null,
            matches,
            innings: num(r.Inns) ?? 0,
            dismissals: num(r.Dis) ?? 0,
            catches: num(r.Ct) ?? 0,
            stumpings: num(r.St) ?? 0,
            catches_keeper: num(r["Ct Wk"]) ?? 0,
            catches_fielder: num(r["Ct Fi"]) ?? 0,
            best_innings: r.MD && r.MD !== "-" ? r.MD : null,
            per_innings: num(r["D/I"]),
          },
        ];
      })
      .filter(([, v]) => v)
  );

const oversToBalls = (o) => {
  const [whole, part = "0"] = String(o || "0").split(".");
  return Number(whole) * 6 + Number(part);
};

export const parseBatting = (html, opts = {}) =>
  Object.fromEntries(
    Object.entries(careerTable(html, opts))
      .map(([format, r]) => {
        const matches = num(r.Mat);
        if (!matches) return [format, null];
        return [
          format,
          {
            matches,
            innings: num(r.Inns) ?? 0,
            not_outs: num(r.NO) ?? 0,
            runs: num(r.Runs) ?? 0,
            balls: num(r.BF),
            highest: r.HS && r.HS !== "-" ? r.HS : null,
            average: num(r.Ave),
            strike_rate: num(r.SR),
            hundreds: num(r["100"]) ?? 0,
            double_hundreds: 0,
            fifties: num(r["50"]) ?? 0,
            fours: num(r["4s"]),
            sixes: num(r["6s"]),
            ducks: num(r["0"]),
          },
        ];
      })
      .filter(([, v]) => v)
  );

export const parseBowling = (html, opts = {}) =>
  Object.fromEntries(
    Object.entries(careerTable(html, opts))
      .map(([format, r]) => {
        const matches = num(r.Mat);
        if (!matches || !num(r.Inns)) return [format, null];
        const wickets = num(r.Wkts) ?? 0;
        return [
          format,
          {
            matches,
            innings: num(r.Inns) ?? 0,
            balls: r.Balls ? num(r.Balls) ?? 0 : oversToBalls(r.Overs),
            runs: num(r.Runs) ?? 0,
            maidens: num(r.Mdns),
            wickets,
            average: num(r.Ave),
            economy: num(r.Econ),
            strike_rate: num(r.SR),
            best_innings: wickets && r.BBI !== "-" ? r.BBI : null,
            best_match: wickets && r.BBM && r.BBM !== "-" ? r.BBM : null,
            four_wickets: num(r["4"]),
            five_wickets: num(r["5"]) ?? 0,
            ten_wickets: num(r["10"]) ?? 0,
          },
        ];
      })
      .filter(([, v]) => v)
  );

/* ------------------------------------------------------------------ */
/* CRICSHEET                                                           */
/* ------------------------------------------------------------------ */

const parseCsv = (text) => {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const cells = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (quoted) {
        if (c === '"' && line[i + 1] === '"') (cur += '"'), i++;
        else if (c === '"') quoted = false;
        else cur += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") cells.push(cur), (cur = "");
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] || ""])));
};

// registry id -> { name, cricinfoIds: [..] }
export const loadRegistry = async () => {
  const text = await get("https://cricsheet.org/register/people.csv");
  const byId = new Map();
  for (const r of parseCsv(text)) {
    byId.set(r.identifier, {
      name: r.unique_name || r.name,
      cricinfoIds: [r.key_cricinfo, r.key_cricinfo_2, r.key_cricinfo_3].filter(Boolean).map(Number),
    });
  }
  return byId;
};
