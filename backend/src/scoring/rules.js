// Pure cricket rules shared by the engine, the scorecard builder and the importers.

export const WICKET_KINDS = [
  "bowled",
  "caught",
  "caught and bowled",
  "lbw",
  "stumped",
  "run out",
  "hit wicket",
  "retired hurt",
  "retired not out",
  "retired out",
  "obstructing the field",
  "handled the ball",
  "hit the ball twice",
  "timed out",
];

// Dismissals credited to the bowler.
const BOWLER_KINDS = new Set([
  "bowled",
  "caught",
  "caught and bowled",
  "lbw",
  "stumped",
  "hit wicket",
]);

// Batter leaves but it is not a wicket (can return later).
const NOT_A_WICKET = new Set(["retired hurt", "retired not out"]);

// What a batter can be out to on an illegal delivery.
const ALLOWED_ON_WIDE = new Set([
  "stumped", "run out", "hit wicket", "obstructing the field",
  "retired hurt", "retired not out", "retired out",
]);
const ALLOWED_ON_NOBALL = new Set([
  "run out", "obstructing the field", "handled the ball", "hit the ball twice",
  "retired hurt", "retired not out", "retired out",
]);

export const isBowlerWicket = (kind) => BOWLER_KINDS.has(kind);
export const countsAsWicket = (kind) => !NOT_A_WICKET.has(kind);

export const isLegal = (d) => !d.wides && !d.noballs;

export const runsTotal = (d) =>
  (d.runs_batter || 0) + (d.wides || 0) + (d.noballs || 0) +
  (d.byes || 0) + (d.legbyes || 0) + (d.penalty || 0);

// Byes and leg-byes are not charged to the bowler; penalty runs aren't either.
export const bowlerRuns = (d) =>
  (d.runs_batter || 0) + (d.wides || 0) + (d.noballs || 0);

// A ball counts as faced by the batter unless it is a wide.
export const facedByBatter = (d) => !d.wides;

// Runs the batters physically ran (decides whether they changed ends).
export const runsRan = (d) => {
  const bat = d.is_boundary ? 0 : d.runs_batter || 0;
  const extrasRun =
    (d.byes || 0) + (d.legbyes || 0) + Math.max((d.wides || 0) - 1, 0);
  // 4 / 6 byes or wides off a boundary are even, so no special case is needed.
  return bat + extrasRun;
};

export const validateWicketOnDelivery = (kind, d) => {
  if (!WICKET_KINDS.includes(kind)) return `Unknown dismissal "${kind}"`;
  if (d.wides && !ALLOWED_ON_WIDE.has(kind))
    return `A batter cannot be out ${kind} off a wide`;
  if (d.noballs && !ALLOWED_ON_NOBALL.has(kind))
    return `A batter cannot be out ${kind} off a no-ball`;
  return null;
};

// 0 -> "0", 23 -> "3.5", 24 -> "4"
export const oversText = (legalBalls, bpo = 6) => {
  const o = Math.floor(legalBalls / bpo);
  const b = legalBalls % bpo;
  return b === 0 ? `${o}` : `${o}.${b}`;
};

export const runRate = (runs, legalBalls, bpo = 6) =>
  legalBalls > 0 ? +((runs * bpo) / legalBalls).toFixed(2) : 0;

export const strikeRate = (runs, balls) =>
  balls > 0 ? +((runs * 100) / balls).toFixed(2) : 0;

export const economy = (runs, legalBalls, bpo = 6) =>
  legalBalls > 0 ? +((runs * bpo) / legalBalls).toFixed(2) : 0;

// Short ball label used in "this over" strips and over summaries.
export const ballChip = (d) => {
  const total = runsTotal(d);
  if (d.wickets?.some((w) => countsAsWicket(w.kind))) return "W";
  if (d.wides) return total === 1 ? "wd" : `${total}wd`;
  if (d.noballs) return total === 1 ? "nb" : `${total}nb`;
  if (d.byes) return `${d.byes}b`;
  if (d.legbyes) return `${d.legbyes}lb`;
  return `${d.runs_batter}`;
};

export const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const FORMAT_LABELS = {
  T20: "T20",
  ODI: "ODI",
  TEST: "Test",
  T10: "T10",
  LIST_A: "One-Day",
  FIRST_CLASS: "First-class",
};

export const formatLabel = (format, teamType) =>
  teamType === "international" && format === "T20"
    ? "T20I"
    : FORMAT_LABELS[format] || format;

// Today's date in the server's local timezone, as YYYY-MM-DD.
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// "c Green b Short", "run out (Short/Inglis)", "lbw b Starc" ...
export const dismissalText = (w, name) => {
  if (!w) return "not out";
  const bowler = w.bowlerName;
  const fielders = (w.fielders || []).map((f) =>
    f.isSubstitute ? `sub (${name(f.id)})` : `${f.isKeeper ? "†" : ""}${name(f.id)}`
  );
  switch (w.kind) {
    case "bowled":
      return `b ${bowler}`;
    case "caught":
      return fielders.length ? `c ${fielders[0]} b ${bowler}` : `c ? b ${bowler}`;
    case "caught and bowled":
      return `c & b ${bowler}`;
    case "lbw":
      return `lbw b ${bowler}`;
    case "stumped":
      return `st ${fielders[0] || "?"} b ${bowler}`;
    case "hit wicket":
      return `hit wicket b ${bowler}`;
    case "run out":
      return fielders.length ? `run out (${fielders.join("/")})` : "run out";
    default:
      return w.kind;
  }
};
