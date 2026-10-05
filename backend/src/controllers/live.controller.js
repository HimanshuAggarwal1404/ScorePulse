// Public, read-only endpoints for match lists, the match centre and live updates.
import db from "../db/index.js";
import { buildMatchView, commentaryFeed, loadMatchData } from "../scoring/state.js";
import { subscribeList, subscribeMatch } from "../scoring/events.js";
import { formatLabel, oversText } from "../scoring/rules.js";
import { statusText } from "../scoring/text.js";

const LIVE_STATES = ["toss", "live", "innings_break", "stumps", "delayed"];
const FILTERS = {
  live: LIVE_STATES,
  upcoming: ["upcoming"],
  completed: ["completed", "abandoned"],
};

const matchId = (req) => {
  const id = Number(req.params.matchId);
  if (!Number.isInteger(id) || id <= 0) {
    const err = new Error("Invalid match id");
    err.status = 400;
    throw err;
  }
  return id;
};

/* ---------- match lists ---------- */

const listCards = async (statuses, limit) => {
  const { rows: matches } = await db.query(
    `SELECT m.*,
            t1.name AS team1_name, COALESCE(t1.code, t1.short_code) AS team1_short,
            t2.name AS team2_name, COALESCE(t2.code, t2.short_code) AS team2_short,
            v.name AS venue_name, v.city AS venue_city
       FROM matches m
       JOIN teams t1 ON t1.id = m.team1_id
       JOIN teams t2 ON t2.id = m.team2_id
       LEFT JOIN venues v ON v.id = m.venue_id
      WHERE m.status = ANY($1::match_status[])
      ORDER BY
        CASE WHEN m.status = 'upcoming' THEN m.start_date END ASC,
        m.start_date DESC, m.updated_at DESC
      LIMIT $2`,
    [statuses, limit]
  );
  if (!matches.length) return [];

  const { rows: totals } = await db.query(
    "SELECT * FROM innings_totals WHERE match_id = ANY($1::int[]) ORDER BY match_id, innings_number",
    [matches.map((m) => m.id)]
  );

  return matches.map((m) => {
    const bpo = m.balls_per_over;
    const teamName = (id) => (id === m.team1_id ? m.team1_name : m.team2_name);
    const inns = totals
      .filter((t) => t.match_id === m.id)
      .map((t) => ({
        number: t.innings_number,
        battingTeamId: t.batting_team_id,
        bowlingTeamId: t.bowling_team_id,
        runs: t.runs,
        wickets: t.wickets,
        legalBalls: t.legal_balls,
        overs: oversText(t.legal_balls, bpo),
        target: t.target_runs,
        maxBalls: t.max_balls,
        status: t.status,
        isSuperOver: t.is_super_over,
        allOut: t.end_reason === "all_out",
        declared: t.end_reason === "declared",
      }));

    const side = (id, name, short) => ({
      id,
      name,
      short,
      innings: inns
        .filter((i) => i.battingTeamId === id && !i.isSuperOver)
        .map((i) => ({
          runs: i.runs,
          wickets: i.wickets,
          overs: i.overs,
          allOut: i.allOut,
          declared: i.declared,
          batting: i.status === "in_progress",
        })),
    });

    return {
      id: m.id,
      title: m.match_title,
      series: m.series_name,
      format: m.format,
      formatLabel: formatLabel(m.format, m.team_type),
      status: m.status,
      isLive: LIVE_STATES.includes(m.status),
      statusText: statusText(m, inns, teamName),
      startDate: m.start_date,
      startTime: m.start_time,
      venue: m.venue_name ? { name: m.venue_name, city: m.venue_city } : null,
      winnerId: m.winner_id,
      team1: side(m.team1_id, m.team1_name, m.team1_short),
      team2: side(m.team2_id, m.team2_name, m.team2_short),
    };
  });
};

// GET /api/matches?status=live|upcoming|completed&limit=
export const getMatches = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const status = req.query.status;
  if (status && !FILTERS[status]) {
    return res.status(400).json({ error: "status must be live, upcoming or completed" });
  }
  const statuses = status ? FILTERS[status] : Object.values(FILTERS).flat();
  res.json({ matches: await listCards(statuses, limit) });
};

// GET /api/matches/recent -> live first, then latest results (home page carousel)
export const getRecentMatches = async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const live = await listCards(FILTERS.live, limit);
  const done = await listCards(FILTERS.completed, Math.max(limit - live.length, 0));
  res.json([...live, ...done]);
};

export const streamMatchList = (req, res) => subscribeList(req, res);

/* ---------- one match ---------- */

const loadView = async (req, res) => {
  const data = await loadMatchData(db, matchId(req));
  if (!data) {
    res.status(404).json({ error: "Match not found" });
    return null;
  }
  return buildMatchView(data);
};

// GET /api/matches/:matchId -> match centre (info, live panel, scorecards, latest commentary)
export const getMatch = async (req, res) => {
  const built = await loadView(req, res);
  if (!built) return;
  res.json({ ...built.view, latestCommentary: commentaryFeed(built.commentary, { limit: 30 }).items });
};

// GET /api/matches/:matchId/scorecard
export const getScorecard = async (req, res) => {
  const built = await loadView(req, res);
  if (!built) return;
  res.json({ match: built.view.match, innings: built.view.innings });
};

// GET /api/matches/:matchId/commentary?innings=2&before=<key>&limit=60
export const getCommentary = async (req, res) => {
  const built = await loadView(req, res);
  if (!built) return;
  res.json(
    commentaryFeed(built.commentary, {
      inningsNumber: req.query.innings,
      before: req.query.before,
      limit: Math.min(Number(req.query.limit) || 60, 300),
    })
  );
};

// GET /api/matches/:matchId/stream  (Server-Sent Events)
export const streamMatch = async (req, res) => {
  await subscribeMatch(req, res, matchId(req));
};
