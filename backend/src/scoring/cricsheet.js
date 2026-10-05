// Cricsheet (https://cricsheet.org/format/json/) adapter. Turns a match file
// into engine calls, so imported and replayed matches are scored by exactly
// the same rules as a match entered in the scorer console.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db/index.js";
import * as engine from "./engine.js";
import { formatLabel, ordinal } from "./rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SOURCE_DIR = path.resolve(__dirname, "../../../MatchesData");

const FORMATS = { T20: "T20", IT20: "T20", ODI: "ODI", ODM: "LIST_A", Test: "TEST", MDM: "FIRST_CLASS" };

const KNOWN_CODES = {
  Ireland: "IRE",
  "United Arab Emirates": "UAE",
  Zimbabwe: "ZIM",
  Netherlands: "NED",
  Scotland: "SCO",
  Nepal: "NEP",
  Oman: "OMA",
  "United States of America": "USA",
  Queensland: "QLD",
  Victoria: "VIC",
  "New South Wales": "NSW",
  "South Australia": "SA",
  "Western Australia": "WA",
  Tasmania: "TAS",
  Canterbury: "CANT",
  "Northern Districts": "ND",
  Auckland: "AUCK",
  Wellington: "WELL",
  Otago: "OTAG",
  "Central Districts": "CD",
  "Panadura Sports Club": "PSC",
  "Tamil Union Cricket and Athletic Club": "TUCC",
  "Kurunegala Youth Cricket Club": "KYCC",
  "Nugegoda Sports Welfare Club": "NSWC",
  "Chilaw Marians Cricket Club": "CMCC",
  "Badureliya Sports Club": "BSC",
};

/* ------------------------------------------------------------------ */
/* FILES                                                               */
/* ------------------------------------------------------------------ */

export const loadSource = (id) => {
  const file = path.join(SOURCE_DIR, `${String(id).replace(/[^0-9A-Za-z_-]/g, "")}.json`);
  if (!fs.existsSync(file)) throw new engine.ScoringError(`Cricsheet file ${id}.json not found`, 404);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
};

export const listSources = () =>
  fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => {
      const json = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, f), "utf-8"));
      const info = json.info;
      return {
        id: path.basename(f, ".json"),
        teams: info.teams,
        date: info.dates[0],
        format: formatLabel(FORMATS[info.match_type] || info.match_type, info.team_type),
        event: info.event?.name || null,
        venue: info.venue,
        balls: json.innings.reduce(
          (s, inn) => s + inn.overs.reduce((t, o) => t + o.deliveries.length, 0),
          0
        ),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

/* ------------------------------------------------------------------ */
/* TEAMS                                                               */
/* ------------------------------------------------------------------ */

const ensureTeam = async (name, teamType) => {
  const { rows } = await db.query("SELECT id FROM teams WHERE lower(name) = lower($1)", [name]);
  if (rows.length) return rows[0].id;

  const base =
    KNOWN_CODES[name] ||
    name
      .split(/\s+/)
      .filter((w) => /^[A-Z]/.test(w))
      .map((w) => w[0])
      .join("")
      .slice(0, 4) ||
    name.slice(0, 3).toUpperCase();

  for (let i = 0; i < 20; i++) {
    const code = (i ? `${base.slice(0, 4)}${i}` : base).slice(0, 5);
    const { rows: ins } = await db.query(
      `INSERT INTO teams (name, short_code, code, type) VALUES ($1, $2, $2, $3)
       ON CONFLICT DO NOTHING RETURNING id`,
      [name, code, teamType === "international" ? "international" : "domestic"]
    );
    if (ins.length) return ins[0].id;
  }
  throw new Error(`Could not create team ${name}`);
};

/* ------------------------------------------------------------------ */
/* SETUP                                                               */
/* ------------------------------------------------------------------ */

const toBalls = (overs, bpo) => {
  const whole = Math.floor(overs);
  return whole * bpo + Math.round((overs - whole) * 10);
};

const matchTitle = (info, format) => {
  const ev = info.event || {};
  if (ev.stage) return ev.stage;
  if (ev.match_number) {
    return info.team_type === "international"
      ? `${ordinal(ev.match_number)} ${formatLabel(format, info.team_type)}`
      : `${ordinal(ev.match_number)} Match`;
  }
  if (ev.group) return `${ev.group} Group`;
  return formatLabel(format, info.team_type);
};

export const createFromSource = async (json, { source, sourceMatchId, startDate } = {}) => {
  const info = json.info;
  const format = FORMATS[info.match_type];
  if (!format) throw new Error(`Unsupported match type ${info.match_type}`);

  const [t1, t2] = await Promise.all(info.teams.map((t) => ensureTeam(t, info.team_type)));

  const multiDay = format === "TEST" || format === "FIRST_CLASS";
  const officials = info.officials || {};
  const matchId = await engine.createMatch(
    {
      source,
      sourceMatchId,
      format,
      team1Id: t1,
      team2Id: t2,
      teamType: info.team_type === "international" ? "international" : "club",
      gender: info.gender,
      overs: multiDay ? null : info.overs,
      ballsPerOver: info.balls_per_over || 6,
      inningsPerTeam: multiDay ? 2 : 1,
      days: multiDay ? Math.max(info.dates.length, format === "TEST" ? 5 : 3) : 1,
      venueName: info.venue,
      venueCity: info.city,
      startDate: startDate || info.dates[0],
      seriesName: info.event?.name,
      title: matchTitle(info, format),
      season: String(info.season),
      umpires: officials.umpires,
      tvUmpire: officials.tv_umpires?.[0],
      matchReferee: officials.match_referees?.[0],
    },
    { quiet: true }
  );

  const registry = info.registry?.people || {};
  const teamIds = { [info.teams[0]]: t1, [info.teams[1]]: t2 };
  for (const team of info.teams) {
    await engine.setSquad(
      matchId,
      teamIds[team],
      info.players[team].map((name) => ({ name, registryId: registry[name] })),
      { quiet: true }
    );
  }
  return matchId;
};

/* ------------------------------------------------------------------ */
/* PLAYING THE BALLS                                                   */
/* ------------------------------------------------------------------ */

const mapResult = (outcome, teamIds) => {
  if (outcome.result === "draw") return { type: "draw" };
  if (outcome.result === "no result") return { type: "no_result" };
  if (outcome.result === "tie") {
    return outcome.eliminator
      ? { type: "win", winnerId: teamIds[outcome.eliminator], method: "Super Over" }
      : { type: "tie" };
  }
  if (!outcome.winner) return { type: "no_result" };
  const by = outcome.by || {};
  const method = { "D/L": "DLS", VJD: "VJD", Awarded: "Awarded" }[outcome.method] || outcome.method || null;
  if (by.innings) return { type: "win", winnerId: teamIds[outcome.winner], margin: by.runs, marginType: "innings", method };
  if (by.runs != null) return { type: "win", winnerId: teamIds[outcome.winner], margin: by.runs, marginType: "runs", method };
  if (by.wickets != null) return { type: "win", winnerId: teamIds[outcome.winner], margin: by.wickets, marginType: "wickets", method };
  return { type: "win", winnerId: teamIds[outcome.winner], method };
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Feeds a Cricsheet match into an existing match row.
 * Resumable: innings / balls already in the database are skipped.
 *
 * opts.delayMs   pause between balls, number or () => number (0 = as fast as possible)
 * opts.isStopped () => boolean, checked between balls
 * opts.quiet     don't push SSE updates (bulk import)
 */
export const playSource = async (matchId, json, opts = {}) => {
  const { delayMs = 0, isStopped = () => false, quiet = false } = opts;
  const info = json.info;
  const bpo = info.balls_per_over || 6;
  const eopts = { quiet, trusted: true };
  const delay = typeof delayMs === "function" ? delayMs : () => delayMs;
  const wait = async (factor = 1) => {
    if (isStopped()) return true;
    if (delay()) await sleep(delay() * factor);
    return isStopped();
  };

  const { rows: mRows } = await db.query("SELECT * FROM matches WHERE id = $1", [matchId]);
  const match = mRows[0];
  const teamIds = { [info.teams[0]]: match.team1_id, [info.teams[1]]: match.team2_id };

  const { rows: players } = await db.query(
    "SELECT id, team_id, name FROM match_players WHERE match_id = $1",
    [matchId]
  );
  const ids = new Map(players.map((p) => [`${p.team_id}|${p.name}`, p.id]));
  const playerId = async (teamId, name, role = "replacement") => {
    const key = `${teamId}|${name}`;
    if (!ids.has(key)) {
      ids.set(key, await engine.addPlayer(matchId, teamId, { name, role, registryId: info.registry?.people?.[name] }, eopts));
    }
    return ids.get(key);
  };

  // ---- toss ----
  if (match.status === "upcoming") {
    if (await wait(2)) return "stopped";
    await engine.setToss(matchId, { winnerId: teamIds[info.toss.winner], decision: info.toss.decision }, eopts);
    if (await wait(3)) return "stopped";
  }

  const fullBalls = info.overs ? info.overs * bpo : null;

  for (const [idx, inn] of json.innings.entries()) {
    const number = idx + 1;
    const battingTeamId = teamIds[inn.team];
    const bowlingTeamId = battingTeamId === match.team1_id ? match.team2_id : match.team1_id;
    const deliveries = inn.overs.flatMap((o) => o.deliveries);
    if (!deliveries.length) continue;

    const { rows: existing } = await db.query(
      "SELECT * FROM innings WHERE match_id = $1 AND innings_number = $2",
      [matchId, number]
    );
    let skip = 0;
    if (existing.length) {
      if (existing[0].status === "completed") continue;
      const { rows } = await db.query("SELECT COUNT(*)::int AS n FROM deliveries WHERE innings_id = $1", [existing[0].id]);
      skip = rows[0].n;
    } else {
      // limits: a later innings' DLS / reduced target tells us how long this one was
      let maxBalls = null;
      if (inn.super_over) maxBalls = bpo;
      else if (inn.target?.overs) maxBalls = toBalls(inn.target.overs, bpo);
      else if (fullBalls) {
        maxBalls = fullBalls;
        const next = json.innings[idx + 1];
        const legal = deliveries.filter((d) => !d.extras?.wides && !d.extras?.noballs).length;
        if (next?.target?.overs) {
          const reduced = toBalls(next.target.overs, bpo);
          if (reduced < fullBalls && legal <= reduced) maxBalls = reduced;
        }
      }

      const first = deliveries[0];
      await engine.startInnings(
        matchId,
        {
          battingTeamId,
          superOver: !!inn.super_over,
          strikerId: await playerId(battingTeamId, first.batter),
          nonStrikerId: await playerId(battingTeamId, first.non_striker),
          bowlerId: await playerId(bowlingTeamId, first.bowler),
          maxBalls,
          target: inn.target?.runs,
          maxWickets: inn.super_over ? 2 : 10 - (inn.absent_hurt?.length || 0),
        },
        eopts
      );
    }

    for (const d of deliveries.slice(skip)) {
      if (await wait()) return "stopped";
      const extras = d.extras || {};
      const wickets = [];
      for (const w of d.wickets || []) {
        const fielders = [];
        for (const f of w.fielders || []) {
          const fname = typeof f === "string" ? f : f.name;
          if (!fname) continue;
          fielders.push({
            id: await playerId(bowlingTeamId, fname, "substitute"),
            isSubstitute: !!f.substitute,
          });
        }
        wickets.push({
          kind: w.kind,
          playerOutId: await playerId(battingTeamId, w.player_out),
          fielders,
        });
      }
      await engine.recordBall(
        matchId,
        {
          batterId: await playerId(battingTeamId, d.batter),
          nonStrikerId: await playerId(battingTeamId, d.non_striker),
          bowlerId: await playerId(bowlingTeamId, d.bowler),
          runsBatter: d.runs.batter,
          isBoundary: [4, 6].includes(d.runs.batter) && !d.runs.non_boundary,
          wides: extras.wides,
          noballs: extras.noballs,
          byes: extras.byes,
          legbyes: extras.legbyes,
          penalty: extras.penalty,
          wickets,
        },
        eopts
      );
    }

    // the data ran out but the engine still has the innings open
    const { rows: after } = await db.query(
      "SELECT status FROM innings WHERE match_id = $1 AND innings_number = $2",
      [matchId, number]
    );
    if (after[0]?.status === "in_progress") {
      const isLast = idx === json.innings.length - 1;
      const reason = inn.declared ? "declared" : inn.forfeited ? "forfeited" : isLast ? "match_ended" : "overs_complete";
      await engine.endInnings(matchId, { reason }, eopts);
    }
    if (idx < json.innings.length - 1 && (await wait(6))) return "stopped";
  }

  // ---- result: Cricsheet's official outcome wins over our computation ----
  const official = mapResult(info.outcome, teamIds);
  const { rows: final } = await db.query("SELECT * FROM matches WHERE id = $1", [matchId]);
  const m = final[0];
  const same =
    m.status === "completed" &&
    m.result_type === official.type &&
    (m.winner_id || null) === (official.winnerId || null) &&
    (official.margin == null || m.win_margin === official.margin) &&
    (m.result_method || null) === (official.method || null);

  if (!same) {
    await engine.setResult(matchId, official, eopts);
  }

  const pom = info.player_of_match?.[0];
  if (pom) {
    const team = info.teams.find((t) => info.players[t].includes(pom));
    if (team) await engine.setPlayerOfMatch(matchId, await playerId(teamIds[team], pom), eopts);
  }

  return same ? "finished" : "finished-with-official-result";
};
