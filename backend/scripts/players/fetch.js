// Builds db/seed/players.json from the web:
//   1. current squads of every team in teams.js        (Cricbuzz team pages)
//   2. profile + batting/bowling records per player     (Cricbuzz profiles)
//   3. ESPNcricinfo id per player, then fielding        (Statsguru search + records)
//   4. players from imported matches Cricbuzz doesn't list, e.g. domestic
//      sides: matched through the Cricsheet registry, records from Statsguru
//
//   npm run players:fetch            (responses are cached in backend/.cache)
//   npm run players:fetch -- --fresh (ignore the cache)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as src from "./sources.js";
import { TEAMS, STATSGURU_COUNTRY, leagueOf } from "./teams.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const MATCHES_DIR = path.resolve(here, "../../../MatchesData");
export const SNAPSHOT = path.resolve(here, "../../db/seed/players.json");

src.setFresh(process.argv.includes("--fresh"));

const log = (...a) => console.log(...a);
const progress = (label, done, total) => process.stdout.write(`\r${label} ${done}/${total}   `);

const mapAll = async (items, fn, label) => {
  let done = 0;
  const out = await Promise.all(
    items.map(async (it) => {
      try {
        return await fn(it);
      } finally {
        progress(label, ++done, items.length);
      }
    })
  );
  process.stdout.write("\n");
  return out;
};

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z ]/g, "") // also drops the accents NFD split off
    .replace(/\s+/g, " ")
    .trim();
const lastName = (s) => norm(s).split(" ").pop();

/* ---------- 1. squads ---------- */

const teamPage = (t) => `${src.CRICBUZZ}/cricket-team/x/${t.cricbuzzId}/players`;

const squads = {};
await mapAll(
  TEAMS.filter((t) => t.squad),
  async (t) => {
    squads[t.name] = src.parseTeamPage(await src.get(teamPage(t)));
  },
  "Squads"
);
for (const [team, list] of Object.entries(squads)) if (!list.length) log(`  ! empty squad page for ${team}`);

// Cricbuzz's team index tells international, league and domestic sides apart.
const kindOf = new Map();
for (const [kind, tab] of [["international", ""], ["franchise", "/league"], ["domestic", "/domestic"]]) {
  for (const id of src.parseTeamIndex(await src.get(`${src.CRICBUZZ}/cricket-team${tab}`))) {
    if (!kindOf.has(id)) kindOf.set(id, kind);
  }
}

/* ---------- 2. Cricbuzz profiles ---------- */

const listed = new Map();
for (const list of Object.values(squads)) for (const p of list) listed.set(p.cricbuzzId, p);

const profiles = (
  await mapAll(
    [...listed.values()],
    async ({ cricbuzzId, slug }) => {
      const html = await src.get(`${src.CRICBUZZ}/profiles/${cricbuzzId}/${slug}`);
      const p = html && src.parseProfile(html, cricbuzzId, slug);
      if (!p) log(`\n  ! no profile data for ${slug} (${cricbuzzId})`);
      return p;
    },
    "Profiles"
  )
).filter(Boolean);

// A face image id shared by many players is Cricbuzz's silhouette placeholder.
const imageUse = new Map();
for (const p of profiles) if (p.faceImageId) imageUse.set(p.faceImageId, (imageUse.get(p.faceImageId) || 0) + 1);

/* ---------- 3. Cricinfo ids ---------- */

// Statsguru search rows for a Cricbuzz player; the best one must agree on
// name, country and (roughly) the number of matches in each format.
const scoreCandidate = (p, c) => {
  let score = 0;
  const known = norm(c.knownAs);
  if (known === norm(p.name) || (p.fullName && known === norm(p.fullName))) score += 5;
  else if (lastName(c.knownAs) === lastName(p.name)) score += known.split(" ")[0] === norm(p.name).split(" ")[0] ? 4 : 2;
  else score -= 4;

  // dual nationals are listed as "AUS/ENG"
  const code = STATSGURU_COUNTRY[p.country];
  if (code && c.country) score += c.country.toUpperCase().split("/").includes(code) ? 4 : -10;

  for (const f of ["TEST", "ODI", "T20I"]) {
    const ours = p.batting[f]?.matches || p.bowling[f]?.matches || 0;
    const theirs = c.counts[f] || 0;
    if (!ours && !theirs) continue;
    if (!ours || !theirs) score -= 3;
    else score += Math.abs(ours - theirs) <= Math.max(3, ours * 0.05) ? 3 : -2;
  }
  // IPL-only players: at least they must have T20 cricket
  if (p.batting.IPL && !p.batting.T20I) score += c.counts.T20 ? 2 : -3;
  return score;
};

const findCricinfoId = async (p) => {
  // Cricbuzz drops apostrophes: "William ORourke" is "William O'Rourke"
  const apostrophe = p.name.replace(/\b([OD])(?=[A-Z][a-z])/g, "$1'");
  const queries = [...new Set([p.name, apostrophe, p.fullName, lastName(p.name)].filter(Boolean))];
  for (const q of queries) {
    const candidates = src.parseSearch(await src.get(src.searchUrl(q)));
    const ranked = candidates.map((c) => ({ c, s: scoreCandidate(p, c) })).sort((a, b) => b.s - a.s);
    if (ranked.length && ranked[0].s >= 5 && (ranked.length === 1 || ranked[0].s > ranked[1].s)) return ranked[0].c.cricinfoId;
  }
  return null;
};

await mapAll(
  profiles,
  async (p) => {
    p.cricinfoId = await findCricinfoId(p);
  },
  "Cricinfo ids"
);
const unmatched = profiles.filter((p) => !p.cricinfoId);
if (unmatched.length) log(`  ${unmatched.length} players without an ESPNcricinfo match: ${unmatched.map((p) => p.name).join(", ")}`);

/* ---------- 4. players from imported matches ---------- */

const registry = await src.loadRegistry();
const registryByCricinfo = new Map();
for (const [id, r] of registry) for (const ci of r.cricinfoIds) registryByCricinfo.set(ci, id);

const fromMatches = []; // { team, name, registryId }
for (const file of fs.existsSync(MATCHES_DIR) ? fs.readdirSync(MATCHES_DIR).filter((f) => f.endsWith(".json")) : []) {
  const { info } = JSON.parse(fs.readFileSync(path.join(MATCHES_DIR, file), "utf-8"));
  for (const [team, names] of Object.entries(info.players || {})) {
    for (const name of names) fromMatches.push({ team, name, registryId: info.registry?.people?.[name] || null });
  }
}

const teamCountry = Object.fromEntries(TEAMS.map((t) => [t.name, t.country || (t.statsguru ? t.name : null)]));

// A Cricbuzz player the search missed may still turn up in an imported match:
// same surname, same country, and the registry knows their ESPNcricinfo id.
const unmatchedByName = new Map(profiles.filter((p) => !p.cricinfoId).map((p) => [`${lastName(p.name)}|${p.country}`, p]));
for (const m of fromMatches) {
  const ci = registry.get(m.registryId)?.cricinfoIds[0];
  const p = ci && unmatchedByName.get(`${lastName(m.name)}|${teamCountry[m.team]}`);
  if (p && norm(m.name)[0] === norm(p.name)[0]) {
    p.cricinfoId = ci;
    unmatchedByName.delete(`${lastName(m.name)}|${teamCountry[m.team]}`);
  }
}

const knownCricinfo = new Set(profiles.map((p) => p.cricinfoId).filter(Boolean));
const extraIds = new Map(); // cricinfoId -> { registryId, name, team }
for (const m of fromMatches) {
  const ci = registry.get(m.registryId)?.cricinfoIds[0];
  if (ci && !knownCricinfo.has(ci) && !extraIds.has(ci)) extraIds.set(ci, m);
}

const extras = await mapAll(
  [...extraIds.entries()],
  async ([cricinfoId, m]) => {
    // the search row for this id gives the name they are known by
    const hit = src.parseSearch(await src.get(src.searchUrl(registry.get(m.registryId)?.name || m.name))).find(
      (c) => c.cricinfoId === cricinfoId
    );
    const [bat, bowl, field, iplBat, iplBowl, iplField] = await Promise.all([
      src.get(src.playerUrl(cricinfoId, "batting")),
      src.get(src.playerUrl(cricinfoId, "bowling")),
      src.get(src.playerUrl(cricinfoId, "fielding")),
      src.get(src.playerUrl(cricinfoId, "batting", { ipl: true })),
      src.get(src.playerUrl(cricinfoId, "bowling", { ipl: true })),
      src.get(src.playerUrl(cricinfoId, "fielding", { ipl: true })),
    ]);
    const fielding = { ...src.parseFielding(field), ...src.parseFielding(iplField, { ipl: true }) };
    const batting = { ...src.parseBatting(bat), ...src.parseBatting(iplBat, { ipl: true }) };
    const bowling = { ...src.parseBowling(bowl), ...src.parseBowling(iplBowl, { ipl: true }) };
    const intl = Object.entries(STATSGURU_COUNTRY).find(([, code]) => code === hit?.country?.toUpperCase())?.[0];
    const keeps = Object.values(fielding).some((f) => f.stumpings || f.catches_keeper > f.catches_fielder);
    return {
      cricinfoId,
      name: hit?.knownAs || m.name,
      country: intl || teamCountry[m.team] || null,
      role: keeps ? "wk" : null,
      roleLabel: keeps ? "WK-Batter" : null,
      teams: [],
      batting,
      bowling,
      fielding,
      source: "statsguru",
    };
  },
  "Other players"
);

/* ---------- 5. fielding for Cricbuzz players ---------- */

await mapAll(
  profiles.filter((p) => p.cricinfoId),
  async (p) => {
    const intl = await src.get(src.playerUrl(p.cricinfoId, "fielding"));
    const ipl = p.batting.IPL || p.bowling.IPL ? await src.get(src.playerUrl(p.cricinfoId, "fielding", { ipl: true })) : null;
    p.fielding = { ...src.parseFielding(intl), ...src.parseFielding(ipl, { ipl: true }) };
  },
  "Fielding"
);

/* ---------- 6. write the snapshot ---------- */

const keyOf = (p) => (p.cricbuzzId ? `cb:${p.cricbuzzId}` : `ci:${p.cricinfoId}`);

const players = [
  ...profiles.map((p) => ({
    key: keyOf(p),
    source: "cricbuzz",
    cricbuzzId: p.cricbuzzId,
    cricinfoId: p.cricinfoId,
    cricsheetId: registryByCricinfo.get(p.cricinfoId) || null,
    name: p.name,
    fullName: p.fullName !== p.name ? p.fullName : null,
    country: p.country,
    role: p.role,
    roleLabel: p.roleLabel,
    battingStyle: p.battingStyle,
    bowlingStyle: p.bowlingStyle,
    dateOfBirth: p.dateOfBirth,
    birthPlace: p.birthPlace,
    height: p.height,
    image: imageUse.get(p.faceImageId) > 5 ? null : src.imageUrl(p.faceImageId, p.slug),
    rankings: p.rankings,
    debuts: p.debuts,
    recentForm: p.recentForm,
    affiliations: p.teams.map((t) => {
      const kind = kindOf.get(t.cricbuzzTeamId) || "other";
      return { ...t, kind, league: kind === "franchise" ? leagueOf(t.name) : null };
    }),
    batting: p.batting,
    bowling: p.bowling,
    fielding: p.fielding || {},
  })),
  ...extras.map((p) => ({
    key: keyOf(p),
    ...p,
    cricsheetId: registryByCricinfo.get(p.cricinfoId) || null,
    affiliations: [],
  })),
];

const byCricinfo = new Map(players.filter((p) => p.cricinfoId).map((p) => [p.cricinfoId, p.key]));

// Teams without a Cricbuzz squad page: everyone who played for them in an imported match.
const squadTeams = new Set(TEAMS.filter((t) => t.squad).map((t) => t.name));
const matchSquads = {};
for (const m of fromMatches) {
  if (squadTeams.has(m.team)) continue;
  const key = byCricinfo.get(registry.get(m.registryId)?.cricinfoIds[0]);
  if (key) (matchSquads[m.team] ||= new Set()).add(key);
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  sources: {
    profiles: "https://www.cricbuzz.com (squads, profiles, batting & bowling records)",
    fielding: "https://stats.espncricinfo.com (ESPNcricinfo Statsguru)",
    registry: "https://cricsheet.org/register/people.csv",
  },
  squads: Object.fromEntries(Object.entries(squads).map(([team, list]) => [team, list.map((p) => `cb:${p.cricbuzzId}`)])),
  matchSquads: Object.fromEntries(Object.entries(matchSquads).map(([team, keys]) => [team, [...keys]])),
  players,
};

fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
fs.writeFileSync(SNAPSHOT, JSON.stringify(snapshot));
log(
  `Wrote ${players.length} players (${profiles.length} Cricbuzz, ${extras.length} Statsguru) to ${path.relative(process.cwd(), SNAPSHOT)}`
);
log(`HTTP: ${src.stats.requests} requests, ${src.stats.cached} from cache`);
