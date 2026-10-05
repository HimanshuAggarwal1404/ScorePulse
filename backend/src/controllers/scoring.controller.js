// Scorer console endpoints. Every change goes through the scoring engine and
// the response is the fresh match state, so the console never has to guess.
import db from "../db/index.js";
import * as engine from "../scoring/engine.js";
import { buildLivePayload } from "../scoring/events.js";
import { listSources } from "../scoring/cricsheet.js";
import * as replays from "../scoring/replay.js";

const id = (req) => Number(req.params.matchId);

const respond = async (res, matchId, extra = {}) => {
  const state = await buildLivePayload(matchId);
  res.json({ ...extra, state });
};

// Optional shared secret: set SCORER_KEY in .env to protect write access.
export const requireScorer = (req, res, next) => {
  const key = process.env.SCORER_KEY;
  if (!key || req.get("x-scorer-key") === key) return next();
  res.status(401).json({ error: "Scorer key required" });
};

/* ---------- reference data ---------- */

export const getTeamsWithSquads = async (req, res) => {
  const { rows: teams } = await db.query("SELECT id, name, short_code, type FROM teams ORDER BY type, name");
  const { rows: squad } = await db.query(
    `SELECT pt.team_id, p.id, p.name, p.role
       FROM player_teams pt JOIN players p ON p.id = pt.player_id
      WHERE pt.is_current = true
      ORDER BY p.name`
  );
  res.json({
    teams: teams.map((t) => ({
      ...t,
      squad: squad.filter((s) => s.team_id === t.id).map(({ team_id: _t, ...p }) => p),
    })),
  });
};

export const getSources = (req, res) => res.json({ sources: listSources() });

export const getConsoleMatches = async (req, res) => {
  const { rows } = await db.query(
    `SELECT m.id, m.status, m.source, m.format, m.match_title, m.start_date, m.result_text,
            t1.name AS team1, t2.name AS team2
       FROM matches m
       JOIN teams t1 ON t1.id = m.team1_id
       JOIN teams t2 ON t2.id = m.team2_id
      ORDER BY (m.status IN ('completed', 'abandoned')), m.updated_at DESC
      LIMIT 100`
  );
  res.json({ matches: rows });
};

/* ---------- replays ---------- */

export const getReplays = async (req, res) => res.json({ replays: await replays.listReplays() });

export const postReplay = async (req, res) => {
  const matchId = await replays.startReplay({ sourceId: req.body.sourceId, intervalMs: req.body.intervalMs });
  res.status(201).json({ matchId });
};

export const pauseReplay = async (req, res) => {
  await replays.pauseReplay(id(req));
  res.json({ ok: true });
};

export const resumeReplay = async (req, res) => {
  await replays.resumeReplay(id(req), { intervalMs: req.body?.intervalMs });
  res.json({ ok: true });
};

/* ---------- match setup ---------- */

export const postMatch = async (req, res) => {
  const matchId = await engine.createMatch(req.body);
  res.status(201).json({ matchId });
};

export const patchMatch = async (req, res) => {
  await engine.updateMatchInfo(id(req), req.body);
  await respond(res, id(req));
};

export const deleteMatch = async (req, res) => {
  await engine.deleteMatch(id(req));
  res.status(204).end();
};

export const putSquad = async (req, res) => {
  await engine.setSquad(id(req), req.params.teamId, req.body.players);
  await respond(res, id(req));
};

export const postPlayer = async (req, res) => {
  const playerId = await engine.addPlayer(id(req), req.body.teamId, req.body);
  await respond(res, id(req), { playerId });
};

export const postToss = async (req, res) => {
  await engine.setToss(id(req), req.body);
  await respond(res, id(req));
};

/* ---------- play ---------- */

export const postInnings = async (req, res) => {
  await engine.startInnings(id(req), req.body);
  await respond(res, id(req));
};

export const postBall = async (req, res) => {
  const result = await engine.recordBall(id(req), req.body);
  await respond(res, id(req), { result });
};

export const undoBall = async (req, res) => {
  const result = await engine.undoLastBall(id(req));
  await respond(res, id(req), { result });
};

export const putCrease = async (req, res) => {
  await engine.setCrease(id(req), req.body);
  await respond(res, id(req));
};

export const endInnings = async (req, res) => {
  await engine.endInnings(id(req), req.body);
  await respond(res, id(req));
};

export const reviseInnings = async (req, res) => {
  await engine.reviseInnings(id(req), req.body);
  await respond(res, id(req));
};

export const postStatus = async (req, res) => {
  await engine.setMatchStatus(id(req), req.body);
  await respond(res, id(req));
};

export const postResult = async (req, res) => {
  await engine.setResult(id(req), req.body);
  await respond(res, id(req));
};

export const putPlayerOfMatch = async (req, res) => {
  await engine.setPlayerOfMatch(id(req), req.body.playerId);
  await respond(res, id(req));
};
