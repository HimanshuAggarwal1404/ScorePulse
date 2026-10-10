// Player numbers and labels shared by the players pages, team pages and the scorer.

/* ------------------------------------------------------------------ */
/* TEAMS                                                               */
/* ------------------------------------------------------------------ */

// Kit colours, tuned to stay readable on both themes. Keyed by teams.short_code.
const TEAM_COLORS = {
  IND: "#2f7de1",
  AUS: "#f2b705",
  ENG: "#4a78d9",
  PAK: "#15a150",
  SAF: "#1f9d55",
  NZL: "#9aa7b4",
  SLK: "#2f62c4",
  WI: "#a3253f",
  BAN: "#0f9a5c",
  AFG: "#2a7ad6",
  IRE: "#22b35a",
  UAE: "#d0213c",
  CSK: "#f5c400",
  MI: "#1666c5",
  RCB: "#d8232a",
  KKR: "#7a4cc2",
  DC: "#2f6fd6",
  RR: "#e6278c",
  SRH: "#f47a20",
  PBKS: "#e02a36",
  LSG: "#20a5dd",
  GT: "#6f8fd8",
  QLD: "#a6294e",
  VIC: "#4a74c9",
  CANT: "#d0213c",
  ND: "#8c96a3",
};

export const teamColor = (code) => TEAM_COLORS[code] || "var(--accent)";

/* ------------------------------------------------------------------ */
/* ROLES, FORMATS, NUMBERS                                             */
/* ------------------------------------------------------------------ */

export const ROLES = [
  { key: "batter", label: "Batters", one: "Batter" },
  { key: "wk", label: "Wicketkeepers", one: "Wicketkeeper" },
  { key: "allrounder", label: "All-rounders", one: "All-rounder" },
  { key: "bowler", label: "Bowlers", one: "Bowler" },
];

export const roleLabel = (p) => p.role_label || ROLES.find((r) => r.key === p.role)?.one || "Player";

export const FORMATS = [
  { key: "TEST", label: "Test" },
  { key: "ODI", label: "ODI" },
  { key: "T20I", label: "T20I" },
  { key: "IPL", label: "IPL" },
];
export const INTL = ["TEST", "ODI", "T20I"];

const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Totals over the compact list shape ({ bat: { TEST: { m, r } }, bowl: ... }).
export const total = (group, key, formats = INTL) => formats.reduce((s, f) => s + n(group?.[f]?.[key]), 0);

// International appearances: a player can bat without bowling and vice versa.
export const caps = (p, formats = INTL) => formats.reduce((s, f) => s + Math.max(n(p.bat?.[f]?.m), n(p.bowl?.[f]?.m)), 0);

export const fmtNum = (v) => (v === null || v === undefined || v === "" ? "—" : Number.isFinite(Number(v)) ? Number(v).toLocaleString() : v);

export const fmtDec = (v, digits = 2) => (v === null || v === undefined || v === "" || !Number(v) ? "—" : Number(v).toFixed(digits));

export const age = (dob) => {
  if (!dob) return null;
  const d = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) years--;
  return years;
};

// Best current ICC ranking across disciplines and formats, e.g. { rank: 1, label: "ODI batting" }.
const RANK_KIND = { bat: "batting", bowl: "bowling", all: "all-rounder" };
const RANK_FORMAT = { test: "Test", odi: "ODI", t20i: "T20I" };
export const topRanking = (rankings) => {
  let best = null;
  for (const [kind, formats] of Object.entries(rankings || {})) {
    for (const [format, r] of Object.entries(formats)) {
      if (r.rank && (!best || r.rank < best.rank)) best = { rank: r.rank, label: `${RANK_FORMAT[format]} ${RANK_KIND[kind]}` };
    }
  }
  return best;
};
export const rankingList = (rankings) =>
  Object.entries(rankings || {}).flatMap(([kind, formats]) =>
    Object.entries(formats).map(([format, r]) => ({ ...r, kind: RANK_KIND[kind], format: RANK_FORMAT[format] }))
  );

// Three numbers that sum a player up, chosen by what they do. International
// figures unless `ipl` is asked for (franchise views) or they are uncapped.
export const headlineStats = (p, { ipl = false } = {}) => {
  const useIpl = ipl ? caps(p, ["IPL"]) > 0 : !caps(p);
  const scope = useIpl ? ["IPL"] : INTL;
  const r = total(p.bat, "r", scope);
  const w = total(p.bowl, "w", scope);
  const m = caps(p, scope);
  const dis = total(p.field, "ct", scope) + total(p.field, "st", scope);
  const label = useIpl ? "IPL" : "Intl";
  const bowlingFirst = p.role === "bowler" || (p.role === "allrounder" && w * 20 > r);
  const stats = [{ label: `${label} matches`, value: m }];
  if (p.role === "wk") stats.push({ label: "Runs", value: r }, { label: "Dismissals", value: dis });
  else if (p.role === "allrounder") stats.push({ label: "Runs", value: r }, { label: "Wickets", value: w });
  else if (bowlingFirst) stats.push({ label: "Wickets", value: w }, { label: "Best", value: bestBowling(p, scope) });
  else stats.push({ label: "Runs", value: r }, { label: "Hundreds", value: total(p.bat, "h", scope) });
  return stats;
};

const bestBowling = (p, scope) => {
  // best figures string in any of the formats ("6/19"), for the bowler cards
  let best = null;
  for (const f of scope) {
    const b = p.bowl?.[f]?.bbi;
    if (!b) continue;
    const [w, r] = b.split("/").map(Number);
    if (!best || w > best.w || (w === best.w && r < best.r)) best = { w, r, s: b };
  }
  return best?.s || "—";
};

// "6 December 1993": calendar dates without the weekday
export const longDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
};
