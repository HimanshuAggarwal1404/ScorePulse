// ICC men's rankings (teams, batters, bowlers, all-rounders in Test / ODI /
// T20I), read from Cricbuzz's rankings pages and refreshed every 6 hours.
// Teams and players are matched to ScorePulse records so the page can link them.
import db from "../db/index.js";
import { cached, clean, fetchPage, imageUrl, valueAfter } from "../lib/cricbuzz.js";
import { logoFor } from "../lib/teamLogos.js";

const TTL_MS = 6 * 60 * 60 * 1000;
const CATEGORIES = { teams: "teams", batting: "batting", bowling: "bowling", allrounder: "all-rounder" };
const FORMATS = { test: "TEST", odi: "ODI", t20: "T20I" };

const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const num = (v) => (clean(v) === null ? null : Number(v));

const loadRankings = async () => {
  const pages = await Promise.all(
    Object.entries(CATEGORIES).map(async ([key, path]) => {
      const data = valueAfter(await fetchPage(`/cricket-stats/icc-rankings/men/${path}`), "formatTypesData");
      if (!data) throw new Error(`no rankings data for ${path}`);
      return [key, data];
    })
  );
  const out = {};
  for (const [key, data] of pages) {
    out[key] = {};
    for (const [src, format] of Object.entries(FORMATS)) {
      out[key][format] = (data[src]?.rank || []).map((r) => ({
        rank: num(r.rank),
        cricbuzzId: num(r.id),
        name: r.name,
        country: clean(r.country),
        rating: num(r.rating),
        points: num(r.points),
        matches: num(r.matches),
        trend: clean(r.trend), // "Up" / "Down" / "Flat"
        image: key === "teams" ? imageUrl(clean(r.imageId), slug(r.name), "144x108") : imageUrl(clean(r.faceImageId), slug(r.name), "152x152"),
      }));
    }
  }
  return out;
};

export const getRankings = async (req, res) => {
  try {
    const result = await cached("rankings", TTL_MS, loadRankings);
    if (!result) return res.status(503).json({ error: "Rankings are unavailable right now" });

    // link to ScorePulse teams and player profiles
    const [{ rows: teams }, { rows: players }] = await Promise.all([
      db.query("SELECT id, name FROM teams"),
      db.query("SELECT id, cricbuzz_id, image_url FROM players WHERE cricbuzz_id IS NOT NULL"),
    ]);
    const teamByName = new Map(teams.map((t) => [t.name.toLowerCase(), t.id]));
    const playerByCricbuzz = new Map(players.map((p) => [p.cricbuzz_id, p]));

    const rankings = {};
    for (const [key, formats] of Object.entries(result.value)) {
      rankings[key] = {};
      for (const [format, list] of Object.entries(formats)) {
        rankings[key][format] = list.map(({ cricbuzzId, ...r }) => {
          if (key === "teams") {
            return { ...r, teamId: teamByName.get(r.name.toLowerCase()) || null, image: logoFor(r.name) || r.image };
          }
          const p = playerByCricbuzz.get(cricbuzzId);
          return { ...r, playerId: p?.id || null, image: p?.image_url || r.image };
        });
      }
    }
    res.set("Cache-Control", "public, max-age=600");
    res.json({ source: "ICC via Cricbuzz", updatedAt: result.updatedAt, rankings });
  } catch (err) {
    console.error("Rankings error:", err.message);
    res.status(500).json({ error: "Failed to fetch rankings" });
  }
};
