// Colour tokens for the match centre, match cards and scorer console.
// They point at the CSS variables in index.scss, so the light / dark switch
// happens in CSS. (The argument is kept so existing calls keep working.)
// eslint-disable-next-line no-unused-vars
export const palette = (_dark) => ({
  bg: "var(--bg)",
  card: "var(--glass)",
  cardAlt: "var(--solid-2)",
  border: "var(--border)",
  text: "var(--text)",
  sub: "var(--text-2)",
  muted: "var(--muted)",
  accent: "var(--accent)",
  accentInk: "var(--accent-ink)",
  accentSoft: "var(--accent-soft)",
  live: "var(--live)",
  liveSoft: "var(--live-soft)",
  win: "var(--win)",
  four: "var(--four)",
  six: "var(--six)",
  wicket: "var(--wicket)",
  extra: "var(--extra)",
  dot: "var(--dot)",
  hover: "var(--hover)",
});

// Translucent version of a token, e.g. tint("var(--four)", 14)
export const tint = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const chipColor = (kind, t) =>
  ({
    wicket: t.wicket,
    four: t.four,
    six: t.six,
    wide: t.extra,
    noball: t.extra,
    dot: t.dot,
  })[kind] || t.sub;

// "271/5" or "116" (all out) or "245/8d"
export const scoreText = (inn) => {
  if (!inn) return "";
  if (inn.allOut) return `${inn.runs}`;
  return `${inn.runs}/${inn.wickets}${inn.declared ? "d" : ""}`;
};

export const LIVE_STATES = ["toss", "live", "innings_break", "stumps", "delayed"];

// Today as YYYY-MM-DD in the user's timezone.
export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatDate = (d, withTime) => {
  if (!d) return "";
  // a bare "YYYY-MM-DD" is a calendar date, not UTC midnight
  const plain = typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
  const date = plain ? new Date(...d.split("-").map((n, i) => Number(n) - (i === 1 ? 1 : 0))) : new Date(d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};
