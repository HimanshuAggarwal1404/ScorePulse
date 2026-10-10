// The real-world cricket calendar (Cricbuzz): upcoming fixtures and recent /
// live results. A fixture never links out; if ScorePulse has scored or replayed
// it, it points at our own match page, otherwise it carries what the scorer
// console needs to start scoring it.
import db from "../db/index.js";
import { cached, clean, fetchPage, imageUrl, valueAfter, valuesAfter } from "../lib/cricbuzz.js";
import { logoFor } from "../lib/teamLogos.js";

const RESULTS_TTL = 2 * 60 * 1000;
const UPCOMING_TTL = 30 * 60 * 1000;

const DONE = new Set(["Complete", "Abandon", "Abandoned", "Cancelled", "No Result"]);
const NOT_STARTED = new Set(["Preview", "Upcoming"]);
const FORMAT = { T20: "T20", T20I: "T20", ODI: "ODI", TEST: "TEST", T10: "T10" };
const OVERS = { T20: 20, ODI: 50, T10: 10 };

const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

// {inngs1: {runs, wickets, overs, isDeclared}, inngs2: ...} -> "455 & 120/3", "40.2"
const scoreOf = (s) => {
  const innings = [s?.inngs1, s?.inngs2].filter((i) => i && i.runs !== undefined);
  if (!innings.length) return null;
  const text = innings
    .map((i) => `${i.runs}${i.wickets !== undefined && i.wickets < 10 ? `/${i.wickets}` : ""}${i.isDeclared ? "d" : ""}${i.isFollowOn ? " (f/o)" : ""}`)
    .join(" & ");
  return { text, overs: innings.at(-1).overs ?? null };
};

// "+05:30" -> minutes
const offsetMinutes = (tz) => {
  const m = String(tz || "").match(/([+-])(\d{2}):(\d{2})/);
  return m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
};
const localDate = (ms, tz) => new Date(Number(ms) + offsetMinutes(tz) * 60000).toISOString().slice(0, 10);

const normalize = (info, score, category) => {
  const state = clean(info.state) || "Upcoming";
  const teams = [info.team1, info.team2].map((t, i) => ({
    name: t?.teamName || "TBC",
    short: t?.teamSName || "TBC",
    image: logoFor(t?.teamName) || imageUrl(t?.imageId, slug(t?.teamName || "team")),
    score: scoreOf(score?.[`team${i + 1}Score`]),
  }));
  const women = /women/i.test(`${info.seriesName} ${teams[0].name} ${teams[1].name}`);
  return {
    id: info.matchId,
    series: info.seriesName || null,
    title: info.matchDesc || null,
    format: info.matchFormat || null,
    category: women ? "Women" : category,
    start: info.startDate ? new Date(Number(info.startDate)).toISOString() : null,
    localDate: info.startDate ? localDate(info.startDate, info.venueInfo?.timezone) : null,
    state,
    status: clean(info.status),
    isLive: !DONE.has(state) && !NOT_STARTED.has(state),
    isDone: DONE.has(state),
    venue: info.venueInfo ? { ground: info.venueInfo.ground || null, city: info.venueInfo.city || null } : null,
    teams,
  };
};

// Live and recent results come in groups: {"matchType":"International","seriesMatches":[{seriesAdWrapper: {matches}}]}.
// The page repeats some groups (header ticker, main list), so read them all and dedupe later.
const fromLiveScores = (text) =>
  [...text.matchAll(/"matchType":"([^"]+)","seriesMatches":/g)].flatMap((m) =>
    (valueAfter(text, "seriesMatches", m.index) || []).flatMap((s) =>
      (s.seriesAdWrapper?.matches || []).map((x) => normalize({ seriesName: s.seriesAdWrapper.seriesName, ...x.matchInfo }, x.matchScore, m[1]))
    )
  );

// Schedule: matchScheduleMap[].scheduleAdWrapper.matchScheduleList[].matchInfo[]
const fromSchedule = (text, category) =>
  valuesAfter(text, "matchScheduleMap").flat().flatMap((day) =>
    (day.scheduleAdWrapper?.matchScheduleList || []).flatMap((s) =>
      (s.matchInfo || []).map((info) => normalize({ seriesName: s.seriesName, ...info }, null, category))
    )
  );

const dedupe = (list) => [...new Map(list.map((m) => [m.id, m])).values()];

const loaders = {
  results: async () => {
    const [live, recent] = await Promise.all([fetchPage("/cricket-match/live-scores"), fetchPage("/cricket-match/live-scores/recent-matches")]);
    const matches = dedupe([...fromLiveScores(live), ...fromLiveScores(recent)]).filter((m) => !NOT_STARTED.has(m.state));
    if (!matches.length) throw new Error("no results found");
    return matches.sort((a, b) => Number(b.isLive) - Number(a.isLive) || String(b.start).localeCompare(String(a.start)));
  },
  upcoming: async () => {
    const pages = await Promise.all(
      [["International", "international"], ["League", "league"], ["Domestic", "domestic"]].map(async ([category, path]) =>
        fromSchedule(await fetchPage(`/cricket-schedule/upcoming-series/${path}`), category)
      )
    );
    const matches = dedupe(pages.flat()).filter((m) => m.start && new Date(m.start) > Date.now() - 6 * 3600 * 1000);
    if (!matches.length) throw new Error("no fixtures found");
    return matches.sort((a, b) => String(a.start).localeCompare(String(b.start)));
  },
};

export const getFixtures = async (req, res) => {
  const type = req.query.type === "results" ? "results" : "upcoming";
  try {
    const result = await cached(`fixtures:${type}`, type === "results" ? RESULTS_TTL : UPCOMING_TTL, loaders[type]);
    if (!result) return res.status(503).json({ error: "Fixtures are unavailable right now" });

    const [{ rows: teams }, { rows: ours }] = await Promise.all([
      db.query("SELECT id, name FROM teams"),
      db.query(
        `SELECT m.id, m.status, m.start_date, lower(t1.name) AS a, lower(t2.name) AS b
           FROM matches m JOIN teams t1 ON t1.id = m.team1_id JOIN teams t2 ON t2.id = m.team2_id
          WHERE m.start_date BETWEEN now() - interval '45 days' AND now() + interval '120 days'`
      ),
    ]);
    const teamId = new Map(teams.map((t) => [t.name.toLowerCase(), t.id]));
    const dayDiff = (a, b) => Math.abs(new Date(a) - new Date(b)) / 86400000;

    const matches = result.value.map((m) => {
      const [a, b] = m.teams.map((t) => t.name.toLowerCase());
      const mine = ours.find((o) => ((o.a === a && o.b === b) || (o.a === b && o.b === a)) && m.localDate && dayDiff(o.start_date, m.localDate) <= 1);
      const ids = m.teams.map((t) => teamId.get(t.name.toLowerCase()) || null);
      const format = FORMAT[m.format] || "T20";
      return {
        ...m,
        teams: m.teams.map((t, i) => ({ ...t, teamId: ids[i] })),
        scorePulse: mine ? { matchId: mine.id, status: mine.status } : null,
        // everything the scorer console needs to create this match
        prefill:
          !mine && !m.isDone && ids[0] && ids[1]
            ? {
                team1Id: ids[0],
                team2Id: ids[1],
                format,
                overs: OVERS[format] ?? "",
                seriesName: m.series || "",
                title: m.title || "",
                venueName: m.venue?.ground || "",
                venueCity: m.venue?.city || "",
                startDate: m.localDate || "",
              }
            : null,
      };
    });

    res.set("Cache-Control", "public, max-age=60");
    res.json({ source: "Cricbuzz", updatedAt: result.updatedAt, matches });
  } catch (err) {
    console.error("Fixtures error:", err.message);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
};
