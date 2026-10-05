// Replays a real Cricsheet match ball by ball, as if it were live. Each
// replay is its own match row; progress lives in the database, so a replay
// picks up where it left off after a server restart.
import db from "../db/index.js";
import { createFromSource, loadSource, playSource } from "./cricsheet.js";
import { ScoringError } from "./engine.js";
import { notifyMatch } from "./events.js";
import { localDate } from "./rules.js";

const running = new Map(); // matchId -> { stopped, intervalMs }

const run = async (matchId) => {
  if (running.has(matchId)) return;
  const { rows } = await db.query("SELECT * FROM replays WHERE match_id = $1", [matchId]);
  if (!rows.length) return;
  const ctl = { stopped: false, intervalMs: rows[0].interval_ms };
  running.set(matchId, ctl);

  try {
    const json = loadSource(rows[0].source_file);
    const outcome = await playSource(matchId, json, {
      delayMs: () => ctl.intervalMs,
      isStopped: () => ctl.stopped,
    });
    if (outcome !== "stopped") {
      await db.query("UPDATE replays SET state = 'finished' WHERE match_id = $1", [matchId]);
    }
  } catch (err) {
    console.error(`Replay ${matchId} stopped:`, err.message);
    await db.query("UPDATE replays SET state = 'paused' WHERE match_id = $1", [matchId]).catch(() => {});
  } finally {
    running.delete(matchId);
    notifyMatch(matchId);
  }
};

const clampInterval = (ms) => Math.min(Math.max(Number(ms) || 4000, 200), 60000);

export const startReplay = async ({ sourceId, intervalMs }) => {
  const json = loadSource(sourceId);
  const matchId = await createFromSource(json, {
    source: "replay",
    sourceMatchId: `${sourceId}-${Date.now()}`,
    startDate: localDate(),
  });
  await db.query(
    "INSERT INTO replays (match_id, source_file, interval_ms) VALUES ($1, $2, $3)",
    [matchId, String(sourceId), clampInterval(intervalMs)]
  );
  notifyMatch(matchId);
  run(matchId);
  return matchId;
};

export const pauseReplay = async (matchId) => {
  const { rowCount } = await db.query(
    "UPDATE replays SET state = 'paused' WHERE match_id = $1 AND state = 'running'",
    [matchId]
  );
  if (!rowCount) throw new ScoringError("Replay is not running", 409);
  const ctl = running.get(Number(matchId));
  if (ctl) ctl.stopped = true;
};

export const resumeReplay = async (matchId, { intervalMs } = {}) => {
  const { rows } = await db.query("SELECT * FROM replays WHERE match_id = $1", [matchId]);
  if (!rows.length) throw new ScoringError("Not a replay match", 404);
  if (rows[0].state === "finished") throw new ScoringError("Replay already finished", 409);
  const interval = intervalMs ? clampInterval(intervalMs) : rows[0].interval_ms;
  await db.query("UPDATE replays SET state = 'running', interval_ms = $2 WHERE match_id = $1", [matchId, interval]);

  const ctl = running.get(Number(matchId));
  if (ctl && !ctl.stopped) {
    ctl.intervalMs = interval; // just a speed change
  } else {
    // wait for a paused loop to exit before starting a new one
    for (let i = 0; i < 100 && running.has(Number(matchId)); i++) await new Promise((r) => setTimeout(r, 100));
    run(Number(matchId));
  }
};

export const listReplays = async () => {
  const { rows } = await db.query(
    `SELECT r.*, m.status, m.match_title, t1.name AS team1, t2.name AS team2
       FROM replays r
       JOIN matches m ON m.id = r.match_id
       JOIN teams t1 ON t1.id = m.team1_id
       JOIN teams t2 ON t2.id = m.team2_id
      ORDER BY r.created_at DESC`
  );
  return rows.map((r) => ({
    matchId: r.match_id,
    source: r.source_file,
    intervalMs: r.interval_ms,
    state: r.state,
    active: running.has(r.match_id),
    status: r.status,
    title: `${r.team1} vs ${r.team2}${r.match_title ? `, ${r.match_title}` : ""}`,
  }));
};

// On boot: continue any replay that was running when the server stopped.
export const resumeRunningReplays = async () => {
  const { rows } = await db.query("SELECT match_id FROM replays WHERE state = 'running'");
  for (const r of rows) run(r.match_id);
  if (rows.length) console.log(`Resumed ${rows.length} replay(s)`);
};
