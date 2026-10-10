// The scoring engine: every write to a match goes through here, inside a
// transaction that holds a row lock on the match. The scorer console, the
// Cricsheet importer and the replay runner all use the same functions, so the
// rules are applied identically everywhere.
import db from "../db/index.js";
import { notifyMatch } from "./events.js";
import {
  countsAsWicket,
  isLegal,
  localDate,
  runsRan,
  validateWicketOnDelivery,
} from "./rules.js";
import { resultText } from "./text.js";

export class ScoringError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const fail = (msg, status) => {
  throw new ScoringError(msg, status);
};

const DEFAULTS = {
  T20: { overs: 20, inningsPerTeam: 1, days: 1 },
  T10: { overs: 10, inningsPerTeam: 1, days: 1 },
  ODI: { overs: 50, inningsPerTeam: 1, days: 1 },
  LIST_A: { overs: 50, inningsPerTeam: 1, days: 1 },
  TEST: { overs: null, inningsPerTeam: 2, days: 5 },
  FIRST_CLASS: { overs: null, inningsPerTeam: 2, days: 4 },
};

/* ------------------------------------------------------------------ */
/* TRANSACTION HELPERS                                                 */
/* ------------------------------------------------------------------ */

const inTransaction = async (fn, { notify } = {}) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    if (notify) notifyMatch(notify(result));
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
};

// Runs fn(client, match) with the match row locked, then notifies listeners.
const withMatch = (matchId, fn, { quiet = false } = {}) =>
  inTransaction(
    async (client) => {
      const { rows } = await client.query(
        "SELECT * FROM matches WHERE id = $1 FOR UPDATE",
        [matchId]
      );
      if (!rows.length) fail("Match not found", 404);
      const result = await fn(client, rows[0]);
      await client.query("UPDATE matches SET updated_at = now() WHERE id = $1", [matchId]);
      return result;
    },
    { notify: quiet ? undefined : () => matchId }
  );

const currentInnings = async (client, matchId) => {
  const { rows } = await client.query(
    `SELECT * FROM innings WHERE match_id = $1 AND status = 'in_progress' FOR UPDATE`,
    [matchId]
  );
  return rows[0] || null;
};

const inningsTotals = async (client, matchId) => {
  const { rows } = await client.query(
    `SELECT * FROM innings_totals WHERE match_id = $1 ORDER BY innings_number`,
    [matchId]
  );
  return rows;
};

const teamName = async (client, teamId) => {
  const { rows } = await client.query("SELECT name FROM teams WHERE id = $1", [teamId]);
  return rows[0]?.name ?? "Unknown";
};

const loadPlayers = async (client, matchId, ids) => {
  const { rows } = await client.query(
    "SELECT * FROM match_players WHERE match_id = $1 AND id = ANY($2::int[])",
    [matchId, ids.filter(Boolean)]
  );
  return new Map(rows.map((r) => [r.id, r]));
};

const assertTeam = (players, id, teamId, label) => {
  const p = players.get(Number(id));
  if (!p) fail(`${label} is not part of this match`);
  if (p.team_id !== teamId) fail(`${label} (${p.name}) does not play for the right side`);
  return p;
};

const otherTeam = (match, teamId) =>
  teamId === match.team1_id ? match.team2_id : match.team1_id;

/* ------------------------------------------------------------------ */
/* MATCH SETUP                                                         */
/* ------------------------------------------------------------------ */

const upsertVenue = async (client, { name, city, country }) => {
  if (!name) return null;
  const { rows } = await client.query(
    `INSERT INTO venues (name, city, country) VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE
       SET city = COALESCE(venues.city, EXCLUDED.city),
           country = COALESCE(venues.country, EXCLUDED.country)
     RETURNING id`,
    [name.slice(0, 100), city?.slice(0, 100) || null, country?.slice(0, 100) || null]
  );
  return rows[0].id;
};

export const createMatch = (input, { quiet = false } = {}) =>
  inTransaction(
    async (client) => {
      const format = String(input.format || "").toUpperCase();
      if (!DEFAULTS[format]) fail(`Unknown format "${input.format}"`);
      const team1Id = Number(input.team1Id);
      const team2Id = Number(input.team2Id);
      if (!team1Id || !team2Id || team1Id === team2Id) fail("Pick two different teams");

      const { rows: teams } = await client.query(
        "SELECT id, type FROM teams WHERE id = ANY($1::int[])",
        [[team1Id, team2Id]]
      );
      if (teams.length !== 2) fail("Team not found", 404);

      const d = DEFAULTS[format];
      const overs = input.overs === undefined ? d.overs : input.overs ? Number(input.overs) : null;
      const inningsPerTeam = Number(input.inningsPerTeam || d.inningsPerTeam);
      if (inningsPerTeam === 1 && !overs) fail("Limited-overs matches need an overs limit");

      const teamType =
        input.teamType ||
        (teams.every((t) => t.type === "international") ? "international" : teams[0].type || "domestic");

      const venueId = await upsertVenue(client, {
        name: input.venueName,
        city: input.venueCity,
        country: input.venueCountry,
      });

      const { rows } = await client.query(
        `INSERT INTO matches (
           source, source_match_id, tournament_id, series_name, match_title, season,
           format, team_type, gender, team1_id, team2_id, venue_id,
           start_date, start_time, days, overs_per_innings, balls_per_over, innings_per_team,
           umpires, tv_umpire, match_referee)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         RETURNING id`,
        [
          input.source || "manual",
          input.sourceMatchId || null,
          input.tournamentId || null,
          input.seriesName || null,
          input.title || null,
          input.season || null,
          format,
          teamType,
          input.gender || "male",
          team1Id,
          team2Id,
          venueId,
          input.startDate || localDate(),
          input.startTime || null,
          Number(input.days || d.days),
          overs,
          Number(input.ballsPerOver || 6),
          inningsPerTeam,
          input.umpires?.length ? input.umpires : null,
          input.tvUmpire || null,
          input.matchReferee || null,
        ]
      );
      return rows[0].id;
    },
    { notify: quiet ? undefined : (id) => id }
  );

// Replaces a side's XI (allowed until the first ball is bowled).
export const setSquad = (matchId, teamId, players, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      teamId = Number(teamId);
      if (![match.team1_id, match.team2_id].includes(teamId)) fail("Team is not in this match");
      if (!Array.isArray(players) || !players.length) fail("Provide at least one player");

      const { rows: used } = await client.query(
        "SELECT 1 FROM innings WHERE match_id = $1 LIMIT 1",
        [matchId]
      );
      if (used.length) fail("Squads are locked once play has started - add substitutes instead", 409);

      const names = players.map((p) => String(p.name || "").trim());
      if (names.some((n) => !n)) fail("Every player needs a name");
      if (new Set(names.map((n) => n.toLowerCase())).size !== names.length) fail("Duplicate player names");

      await client.query("UPDATE matches SET player_of_match_id = NULL WHERE id = $1", [matchId]);
      await client.query("DELETE FROM match_players WHERE match_id = $1 AND team_id = $2", [matchId, teamId]);

      const ids = [];
      for (const [i, p] of players.entries()) {
        ids.push(await insertPlayer(client, matchId, teamId, { ...p, listOrder: i + 1 }));
      }
      return ids;
    },
    opts
  );

const insertPlayer = async (client, matchId, teamId, p) => {
  const { rows } = await client.query(
    `INSERT INTO match_players
       (match_id, team_id, name, registry_id, player_id, role, is_captain, is_keeper, list_order)
     VALUES (
       $1, $2, $3, $4,
       -- profile: picked in the console, else Cricsheet registry, else same name (this team's squad first)
       COALESCE(
         (SELECT id FROM players WHERE id = $5),
         (SELECT id FROM players WHERE cricsheet_id = $4),
         (SELECT p.id FROM players p
            LEFT JOIN player_teams pt ON pt.player_id = p.id AND pt.team_id = $2
           WHERE lower(p.name) = lower($3)
           ORDER BY (pt.team_id IS NOT NULL) DESC, (p.country_team_id = $2) DESC NULLS LAST
           LIMIT 1)),
       $6, $7, $8, $9)
     ON CONFLICT (match_id, team_id, name) DO UPDATE SET role = match_players.role
     RETURNING id`,
    [
      matchId,
      teamId,
      String(p.name).trim(),
      p.registryId || null,
      p.playerId || null,
      p.role || "playing",
      !!p.isCaptain,
      !!p.isKeeper,
      p.listOrder || 0,
    ]
  );
  return rows[0].id;
};

// Adds a substitute / replacement (concussion, impact player ...) at any time.
export const addPlayer = (matchId, teamId, player, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      teamId = Number(teamId);
      if (![match.team1_id, match.team2_id].includes(teamId)) fail("Team is not in this match");
      if (!player?.name?.trim()) fail("Player needs a name");
      const { rows } = await client.query(
        "SELECT COALESCE(MAX(list_order), 0) + 1 AS n FROM match_players WHERE match_id = $1 AND team_id = $2",
        [matchId, teamId]
      );
      return insertPlayer(client, matchId, teamId, {
        ...player,
        role: player.role || "substitute",
        listOrder: rows[0].n,
      });
    },
    opts
  );

export const setToss = (matchId, { winnerId, decision }, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      winnerId = Number(winnerId);
      if (![match.team1_id, match.team2_id].includes(winnerId)) fail("Toss winner must be one of the teams");
      if (!["bat", "field"].includes(decision)) fail('Decision must be "bat" or "field"');
      if (!["upcoming", "toss"].includes(match.status)) fail("The toss can only be set before play starts", 409);
      await client.query(
        "UPDATE matches SET toss_winner_id = $2, toss_decision = $3, status = 'toss' WHERE id = $1",
        [matchId, winnerId, decision]
      );
    },
    opts
  );

export const updateMatchInfo = (matchId, input, opts = {}) =>
  withMatch(
    matchId,
    async (client) => {
      const venueId = input.venueName
        ? await upsertVenue(client, { name: input.venueName, city: input.venueCity, country: input.venueCountry })
        : undefined;
      const fields = {
        series_name: input.seriesName,
        match_title: input.title,
        season: input.season,
        start_date: input.startDate,
        start_time: input.startTime,
        venue_id: venueId,
        umpires: input.umpires,
        tv_umpire: input.tvUmpire,
        match_referee: input.matchReferee,
      };
      const sets = [];
      const vals = [matchId];
      for (const [col, val] of Object.entries(fields)) {
        if (val === undefined) continue;
        vals.push(val);
        sets.push(`${col} = $${vals.length}`);
      }
      if (sets.length) await client.query(`UPDATE matches SET ${sets.join(", ")} WHERE id = $1`, vals);
    },
    opts
  );

/* ------------------------------------------------------------------ */
/* INNINGS                                                             */
/* ------------------------------------------------------------------ */

export const startInnings = (matchId, input = {}, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      if (["completed", "abandoned"].includes(match.status)) fail("Match is already over", 409);
      if (!match.toss_winner_id) fail("Record the toss first");
      if (await currentInnings(client, matchId)) fail("An innings is already in progress", 409);

      const totals = await inningsTotals(client, matchId);
      const regular = totals.filter((t) => !t.is_super_over);
      const superOvers = totals.filter((t) => t.is_super_over);
      const number = totals.length + 1;
      const isSuperOver = !!input.superOver;
      const bpo = match.balls_per_over;

      if (isSuperOver) {
        if (match.innings_per_team !== 1) fail("Super overs are only for limited-overs matches");
        if (regular.length < 2) fail("Both regular innings must be completed first");
        if (superOvers.length % 2 === 0) {
          const [a, b] = superOvers.length ? superOvers.slice(-2) : regular.slice(-2);
          if (a.runs !== b.runs) fail("A super over is only played when scores are level");
        }
      } else if (regular.length >= match.innings_per_team * 2) {
        fail("All innings have been played");
      }

      // batting side: explicit, else from the toss / alternate
      const previous = totals[totals.length - 1];
      let battingTeamId = Number(input.battingTeamId) || null;
      if (!battingTeamId) {
        if (!previous) {
          battingTeamId =
            match.toss_decision === "bat" ? match.toss_winner_id : otherTeam(match, match.toss_winner_id);
        } else if (isSuperOver && superOvers.length % 2 === 0) {
          // team batting second in the match bats first in the super over
          battingTeamId = (superOvers.length ? superOvers[superOvers.length - 1] : regular[regular.length - 1]).batting_team_id;
        } else {
          battingTeamId = otherTeam(match, previous.batting_team_id);
        }
      }
      if (![match.team1_id, match.team2_id].includes(battingTeamId)) fail("Batting team is not in this match");
      const bowlingTeamId = otherTeam(match, battingTeamId);

      const isFollowOn =
        !isSuperOver && match.innings_per_team === 2 && regular.length === 2 &&
        battingTeamId === regular[1].batting_team_id;

      // limits
      let maxBalls = null;
      if (input.maxOvers) maxBalls = Math.round(Number(input.maxOvers) * bpo);
      else if (input.maxBalls) maxBalls = Number(input.maxBalls);
      else if (isSuperOver) maxBalls = bpo;
      else if (match.overs_per_innings) {
        maxBalls = match.overs_per_innings * bpo;
        // a chase in a reduced match defaults to the first innings' allocation
        if (regular.length === 1 && regular[0].max_balls) maxBalls = regular[0].max_balls;
      }
      const maxWickets = isSuperOver ? 2 : Number(input.maxWickets || 10);

      // target (only for the last innings of the match / super over)
      let target = input.target ? Number(input.target) : null;
      if (!target) {
        if (isSuperOver && superOvers.length % 2 === 1) {
          target = superOvers[superOvers.length - 1].runs + 1;
        } else if (!isSuperOver && match.innings_per_team === 1 && regular.length === 1) {
          target = regular[0].runs + 1;
        } else if (!isSuperOver && match.innings_per_team === 2 && regular.length === 3) {
          const agg = (team) => regular.filter((t) => t.batting_team_id === team).reduce((s, t) => s + t.runs, 0);
          target = agg(bowlingTeamId) - agg(battingTeamId) + 1;
          if (target <= 0) fail("No 4th innings needed - the match is already decided");
        }
      }

      const players = await loadPlayers(client, matchId, [input.strikerId, input.nonStrikerId, input.bowlerId]);
      const strikerId = input.strikerId ? assertTeam(players, input.strikerId, battingTeamId, "Striker").id : null;
      const nonStrikerId = input.nonStrikerId ? assertTeam(players, input.nonStrikerId, battingTeamId, "Non-striker").id : null;
      const bowlerId = input.bowlerId ? assertTeam(players, input.bowlerId, bowlingTeamId, "Bowler").id : null;
      if (strikerId && strikerId === nonStrikerId) fail("Pick two different opening batters");

      const { rows } = await client.query(
        `INSERT INTO innings (match_id, innings_number, batting_team_id, bowling_team_id, is_super_over,
                              is_follow_on, max_balls, max_wickets, target_runs, striker_id, non_striker_id, bowler_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [matchId, number, battingTeamId, bowlingTeamId, isSuperOver, isFollowOn, maxBalls, maxWickets,
         target, strikerId, nonStrikerId, bowlerId]
      );
      await client.query(
        "UPDATE matches SET status = 'live', status_note = NULL WHERE id = $1",
        [matchId]
      );
      return rows[0].id;
    },
    opts
  );

const bowlerQuota = (match, inn) => {
  if (!inn.max_balls || inn.is_super_over) return null;
  return Math.ceil(inn.max_balls / match.balls_per_over / 5) * match.balls_per_over;
};

// Position within the current over: how many legal balls bowled, and who bowled the previous over.
const overPosition = async (client, match, inn) => {
  const { rows } = await client.query(
    "SELECT legal_balls FROM innings_totals WHERE innings_id = $1",
    [inn.id]
  );
  const legal = rows[0].legal_balls;
  const over = Math.floor(legal / match.balls_per_over);
  const inOver = legal % match.balls_per_over;
  const { rows: prev } = await client.query(
    `SELECT bowler_id FROM deliveries WHERE innings_id = $1 AND over_number = $2
      ORDER BY seq DESC LIMIT 1`,
    [inn.id, over - 1]
  );
  const { rows: thisOver } = await client.query(
    "SELECT COUNT(*)::int AS n FROM deliveries WHERE innings_id = $1 AND over_number = $2",
    [inn.id, over]
  );
  return { legal, over, inOver, previousBowlerId: prev[0]?.bowler_id ?? null, startedOver: thisOver[0].n > 0 };
};

const dismissedIn = async (client, inningsId) => {
  const { rows } = await client.query(
    `SELECT w.player_out_id, w.kind FROM wickets w
       JOIN deliveries d ON d.id = w.delivery_id
      WHERE d.innings_id = $1 ORDER BY d.seq`,
    [inningsId]
  );
  const out = new Set();
  for (const r of rows) {
    if (countsAsWicket(r.kind)) out.add(r.player_out_id);
  }
  return out;
};

const checkBowler = async (client, match, inn, bowlerId, pos) => {
  if (!pos.startedOver && pos.previousBowlerId === bowlerId) {
    fail("A bowler cannot bowl two overs in a row");
  }
  const quota = bowlerQuota(match, inn);
  if (quota) {
    const { rows } = await client.query(
      `SELECT COUNT(*) FILTER (WHERE is_legal)::int AS legal FROM deliveries
        WHERE innings_id = $1 AND bowler_id = $2`,
      [inn.id, bowlerId]
    );
    if (rows[0].legal >= quota && !pos.startedOver) {
      fail(`This bowler has completed their quota of ${quota / match.balls_per_over} overs`);
    }
  }
};

// Sets who is on strike / at the other end / bowling (new batter, new over, manual swap).
export const setCrease = (matchId, input, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      const inn = await currentInnings(client, matchId);
      if (!inn) fail("No innings in progress", 409);

      let strikerId = input.strikerId === undefined ? inn.striker_id : input.strikerId && Number(input.strikerId);
      let nonStrikerId =
        input.nonStrikerId === undefined ? inn.non_striker_id : input.nonStrikerId && Number(input.nonStrikerId);
      const bowlerId = input.bowlerId === undefined ? inn.bowler_id : input.bowlerId && Number(input.bowlerId);
      if (input.swap) [strikerId, nonStrikerId] = [nonStrikerId, strikerId];

      const players = await loadPlayers(client, matchId, [strikerId, nonStrikerId, bowlerId]);
      const out = await dismissedIn(client, inn.id);
      for (const [id, label] of [[strikerId, "Striker"], [nonStrikerId, "Non-striker"]]) {
        if (!id) continue;
        assertTeam(players, id, inn.batting_team_id, label);
        if (out.has(id)) fail(`${players.get(id).name} is already out`);
      }
      if (strikerId && strikerId === nonStrikerId) fail("Striker and non-striker must be different");

      if (bowlerId && bowlerId !== inn.bowler_id) {
        assertTeam(players, bowlerId, inn.bowling_team_id, "Bowler");
        const pos = await overPosition(client, match, inn);
        if (!opts.trusted) await checkBowler(client, match, inn, bowlerId, pos);
      }

      await client.query(
        "UPDATE innings SET striker_id = $2, non_striker_id = $3, bowler_id = $4 WHERE id = $1",
        [inn.id, strikerId || null, nonStrikerId || null, bowlerId || null]
      );
    },
    opts
  );

/* ------------------------------------------------------------------ */
/* BALL BY BALL                                                        */
/* ------------------------------------------------------------------ */

const int = (v, label, max = 99) => {
  const n = v === undefined || v === null || v === "" ? 0 : Number(v);
  if (!Number.isInteger(n) || n < 0 || n > max) fail(`Invalid ${label}`);
  return n;
};

// input: { runsBatter, isBoundary, wides, noballs, byes, legbyes, penalty,
//          wickets: [{ kind, playerOutId, fielders: [{ id, isSubstitute }] }],
//          commentary, batterId?, nonStrikerId?, bowlerId? }
// opts.trusted skips the "laws" checks that historical data may not satisfy
// (e.g. a bowler changing mid-over through injury).
export const recordBall = (matchId, input, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      if (["completed", "abandoned"].includes(match.status)) fail("Match is already over", 409);
      const inn = await currentInnings(client, matchId);
      if (!inn) fail("No innings in progress - start the next innings first", 409);

      const batterId = Number(input.batterId || inn.striker_id) || null;
      const nonStrikerId = Number(input.nonStrikerId || inn.non_striker_id) || null;
      const bowlerId = Number(input.bowlerId || inn.bowler_id) || null;
      if (!batterId || !nonStrikerId) fail("Select both batters at the crease first");
      if (!bowlerId) fail("Select the bowler for this over first");
      if (batterId === nonStrikerId) fail("Striker and non-striker must be different");

      const d = {
        runs_batter: int(input.runsBatter, "runs off the bat", 7),
        is_boundary: !!input.isBoundary,
        wides: int(input.wides, "wides", 7),
        noballs: int(input.noballs, "no-balls", 5),
        byes: int(input.byes, "byes", 7),
        legbyes: int(input.legbyes, "leg byes", 7),
        penalty: int(input.penalty, "penalty runs", 10),
      };
      if (d.is_boundary && ![4, 6].includes(d.runs_batter)) fail("A boundary is worth 4 or 6");
      if (d.wides && (d.runs_batter || d.noballs)) fail("A wide cannot also be a no-ball or have runs off the bat");
      if (d.byes && d.legbyes) fail("A ball can have byes or leg byes, not both");
      if ((d.byes || d.legbyes) && d.runs_batter) fail("Byes / leg byes and runs off the bat cannot be combined");

      const players = await loadPlayers(client, matchId, [batterId, nonStrikerId, bowlerId]);
      assertTeam(players, batterId, inn.batting_team_id, "Batter");
      assertTeam(players, nonStrikerId, inn.batting_team_id, "Non-striker");
      assertTeam(players, bowlerId, inn.bowling_team_id, "Bowler");

      const pos = await overPosition(client, match, inn);
      if (!opts.trusted) {
        const out = await dismissedIn(client, inn.id);
        if (out.has(batterId) || out.has(nonStrikerId)) fail("One of the batters is already out");
        await checkBowler(client, match, inn, bowlerId, pos);
      }

      const wickets = Array.isArray(input.wickets) ? input.wickets : input.wicket ? [input.wicket] : [];
      for (const w of wickets) {
        const err = validateWicketOnDelivery(w.kind, d);
        if (err) fail(err);
        const outId = Number(w.playerOutId || batterId);
        if (w.kind !== "timed out" && ![batterId, nonStrikerId].includes(outId)) {
          fail("The dismissed batter must be one of the two at the crease");
        }
        if (!["run out", "obstructing the field", "retired hurt", "retired not out", "retired out", "timed out"].includes(w.kind) && outId !== batterId) {
          fail(`Only the striker can be out ${w.kind}`);
        }
        w.playerOutId = outId;
      }
      if (wickets.length > 1 && new Set(wickets.map((w) => w.playerOutId)).size !== wickets.length) {
        fail("The same batter cannot be dismissed twice");
      }

      const { rows: seqRows } = await client.query(
        "SELECT COALESCE(MAX(seq), 0) + 1 AS seq FROM deliveries WHERE innings_id = $1",
        [inn.id]
      );
      const legal = isLegal(d);
      const { rows: ins } = await client.query(
        `INSERT INTO deliveries (innings_id, match_id, seq, over_number, ball_in_over,
                                 batter_id, non_striker_id, bowler_id,
                                 runs_batter, is_boundary, wides, noballs, byes, legbyes, penalty, commentary)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         RETURNING id`,
        [inn.id, matchId, seqRows[0].seq, pos.over, pos.inOver + 1, batterId, nonStrikerId, bowlerId,
         d.runs_batter, d.is_boundary, d.wides, d.noballs, d.byes, d.legbyes, d.penalty,
         input.commentary?.trim() || null]
      );
      const deliveryId = ins[0].id;

      for (const w of wickets) {
        const { rows: wr } = await client.query(
          "INSERT INTO wickets (delivery_id, match_id, player_out_id, kind) VALUES ($1,$2,$3,$4) RETURNING id",
          [deliveryId, matchId, w.playerOutId, w.kind]
        );
        for (const [i, f] of (w.fielders || []).entries()) {
          const fid = Number(f.id ?? f);
          const fp = (await loadPlayers(client, matchId, [fid])).get(fid);
          if (!fp) fail("Fielder is not part of this match");
          if (fp.team_id !== inn.bowling_team_id) fail(`${fp.name} is not on the fielding side`);
          await client.query(
            "INSERT INTO wicket_fielders (wicket_id, position, fielder_id, is_substitute) VALUES ($1,$2,$3,$4)",
            [wr[0].id, i + 1, fid, !!f.isSubstitute || fp.role !== "playing"]
          );
        }
      }

      // ---- crease after the ball ----
      let striker = batterId;
      let nonStriker = nonStrikerId;
      if (runsRan(d) % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
      for (const w of wickets) {
        if (striker === w.playerOutId) striker = null;
        if (nonStriker === w.playerOutId) nonStriker = null;
      }
      const overComplete = legal && pos.inOver + 1 === match.balls_per_over;
      if (overComplete) [striker, nonStriker] = [nonStriker, striker];

      // ---- has the innings ended? ----
      const { rows: t } = await client.query("SELECT * FROM innings_totals WHERE innings_id = $1", [inn.id]);
      const tot = t[0];
      let endReason = null;
      if (inn.target_runs && tot.runs >= inn.target_runs) endReason = "target_reached";
      else if (tot.wickets >= inn.max_wickets) endReason = "all_out";
      else if (inn.max_balls && tot.legal_balls >= inn.max_balls) endReason = "overs_complete";

      if (endReason) {
        await closeInnings(client, match, inn, endReason);
      } else {
        await client.query(
          "UPDATE innings SET striker_id = $2, non_striker_id = $3, bowler_id = $4 WHERE id = $1",
          [inn.id, striker, nonStriker, overComplete ? null : bowlerId]
        );
        if (match.status !== "live") {
          await client.query("UPDATE matches SET status = 'live', status_note = NULL WHERE id = $1", [matchId]);
        }
      }

      return { deliveryId, inningsEnded: endReason, overComplete };
    },
    opts
  );

const closeInnings = async (client, match, inn, reason) => {
  await client.query(
    `UPDATE innings SET status = 'completed', end_reason = $2, ended_at = now(),
            striker_id = NULL, non_striker_id = NULL, bowler_id = NULL
      WHERE id = $1`,
    [inn.id, reason]
  );
  const result = await decideResult(client, match);
  if (result) {
    await applyResult(client, match, result);
  } else {
    await client.query("UPDATE matches SET status = 'innings_break' WHERE id = $1", [match.id]);
  }
  return result;
};

// Works out whether the match is over after an innings closes.
const decideResult = async (client, match) => {
  const totals = await inningsTotals(client, match.id);
  if (totals.some((t) => t.status === "in_progress")) return null;
  const regular = totals.filter((t) => !t.is_super_over);
  const superOvers = totals.filter((t) => t.is_super_over);

  const chaseResult = (first, second, target) => {
    if (second.runs >= target) {
      return { type: "win", winnerId: second.batting_team_id, margin: second.max_wickets - second.wickets, marginType: "wickets" };
    }
    if (second.end_reason === "match_ended" && match.innings_per_team === 2) return { type: "draw" };
    if (second.runs === target - 1) return { type: "tie" };
    return { type: "win", winnerId: second.bowling_team_id, margin: target - 1 - second.runs, marginType: "runs" };
  };

  if (match.innings_per_team === 1) {
    if (superOvers.length) {
      if (superOvers.length % 2 === 1) return null;
      const [a, b] = superOvers.slice(-2);
      if (a.runs === b.runs) return null; // another super over, or the scorer declares a tie
      return { type: "win", winnerId: a.runs > b.runs ? a.batting_team_id : b.batting_team_id, method: "Super Over" };
    }
    if (regular.length < 2) {
      // first innings ended because the match was called off
      if (regular[0]?.end_reason === "match_ended") return { type: "no_result" };
      return null;
    }
    const [a, b] = regular;
    const natural = a.runs + 1;
    const target = b.target_runs || natural;
    if (b.end_reason === "match_ended" && b.runs < target) return { type: "no_result" };
    const r = chaseResult(a, b, target);
    // a tie leaves the match open: the scorer starts a Super Over or confirms the tie
    if (r.type === "tie") return null;
    if (target !== natural && r.type === "win") r.method = "DLS";
    return r;
  }

  // multi-day
  if (regular.some((t) => t.end_reason === "match_ended")) {
    const last = regular[regular.length - 1];
    if (regular.length === 4 && last.target_runs && last.runs >= last.target_runs) {
      return chaseResult(regular[2], last, last.target_runs);
    }
    return { type: "draw" };
  }
  const agg = (team, list) => list.filter((t) => t.batting_team_id === team).reduce((s, t) => s + t.runs, 0);
  if (regular.length === 3) {
    const thirdTeam = regular[2].batting_team_id;
    const other = otherTeam(match, thirdTeam);
    const diff = agg(other, regular) - agg(thirdTeam, regular);
    if (diff > 0) return { type: "win", winnerId: other, margin: diff, marginType: "innings" };
    return null;
  }
  if (regular.length === 4) {
    const last = regular[3];
    const target = last.target_runs || agg(last.bowling_team_id, regular) - agg(last.batting_team_id, regular.slice(0, 3)) + 1;
    return chaseResult(regular[2], last, target);
  }
  return null;
};

const applyResult = async (client, match, r) => {
  const names = {
    [match.team1_id]: await teamName(client, match.team1_id),
    [match.team2_id]: await teamName(client, match.team2_id),
  };
  const row = {
    result_type: r.type,
    winner_id: r.winnerId || null,
    win_margin: r.margin ?? null,
    win_margin_type: r.marginType || null,
    result_method: r.method || null,
  };
  const text = r.text || resultText(row, (id) => names[id]);
  await client.query(
    `UPDATE matches SET status = $2, result_type = $3, winner_id = $4, win_margin = $5,
            win_margin_type = $6, result_method = $7, result_text = $8, status_note = NULL
      WHERE id = $1`,
    [match.id, r.type === "abandoned" ? "abandoned" : "completed", row.result_type, row.winner_id,
     row.win_margin, row.win_margin_type, row.result_method, text]
  );
};

export const endInnings = (matchId, { reason }, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      const allowed = ["declared", "forfeited", "all_out", "overs_complete", "match_ended"];
      if (!allowed.includes(reason)) fail(`Reason must be one of: ${allowed.join(", ")}`);
      const inn = await currentInnings(client, matchId);
      if (!inn) fail("No innings in progress", 409);
      if (reason === "declared" && match.innings_per_team !== 2) fail("Declarations are only for multi-day matches");
      return closeInnings(client, match, inn, reason);
    },
    opts
  );

// Revise the current innings' target / overs (rain, DLS).
export const reviseInnings = (matchId, input, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      const inn = await currentInnings(client, matchId);
      if (!inn) fail("No innings in progress", 409);
      const maxBalls = input.maxOvers ? Math.round(Number(input.maxOvers) * match.balls_per_over) : inn.max_balls;
      const target = input.target ? Number(input.target) : inn.target_runs;
      await client.query("UPDATE innings SET max_balls = $2, target_runs = $3 WHERE id = $1", [inn.id, maxBalls, target]);

      const { rows } = await client.query("SELECT * FROM innings_totals WHERE innings_id = $1", [inn.id]);
      const tot = rows[0];
      if (target && tot.runs >= target) return closeInnings(client, match, { ...inn, target_runs: target }, "target_reached");
      if (maxBalls && tot.legal_balls >= maxBalls) return closeInnings(client, match, inn, "overs_complete");
      return null;
    },
    opts
  );

export const undoLastBall = (matchId, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      const { rows: inns } = await client.query(
        "SELECT * FROM innings WHERE match_id = $1 ORDER BY innings_number DESC FOR UPDATE",
        [matchId]
      );
      if (!inns.length) fail("Nothing to undo", 409);
      const latest = inns[0];

      const { rows: last } = await client.query(
        "SELECT * FROM deliveries WHERE innings_id = $1 ORDER BY seq DESC LIMIT 1",
        [latest.id]
      );

      const clearResult = `UPDATE matches SET result_type = NULL, winner_id = NULL, win_margin = NULL,
          win_margin_type = NULL, result_method = NULL, result_text = NULL WHERE id = $1`;

      // an innings that hasn't started yet: undo removes it
      if (!last.length) {
        await client.query("DELETE FROM innings WHERE id = $1", [latest.id]);
        await client.query(clearResult, [matchId]);
        await client.query("UPDATE matches SET status = $2 WHERE id = $1", [matchId, inns.length > 1 ? "innings_break" : "toss"]);
        return { removedInnings: latest.innings_number };
      }

      const d = last[0];
      await client.query("DELETE FROM deliveries WHERE id = $1", [d.id]);
      await client.query(
        `UPDATE innings SET status = 'in_progress', end_reason = NULL, ended_at = NULL,
                striker_id = $2, non_striker_id = $3, bowler_id = $4 WHERE id = $1`,
        [latest.id, d.batter_id, d.non_striker_id, d.bowler_id]
      );
      await client.query(clearResult, [matchId]);
      await client.query("UPDATE matches SET status = 'live', status_note = NULL WHERE id = $1", [matchId]);
      return { removedDelivery: d.id };
    },
    opts
  );

/* ------------------------------------------------------------------ */
/* MATCH STATE / RESULT                                                */
/* ------------------------------------------------------------------ */

// Interruptions: rain, stumps, resume.
export const setMatchStatus = (matchId, { status, note, day }, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      if (!["live", "delayed", "stumps"].includes(status)) fail('Status must be "live", "delayed" or "stumps"');
      if (["completed", "abandoned", "upcoming"].includes(match.status)) fail("Match is not in play", 409);
      if (status === "stumps" && match.innings_per_team !== 2) fail("Stumps only applies to multi-day matches");
      const inn = await currentInnings(client, matchId);
      // resuming with no innings running goes back to the break
      const next = status === "live" && !inn ? (match.status === "toss" ? "toss" : "innings_break") : status;
      const nextDay = day ? Number(day) : status === "live" && match.status === "stumps" ? match.current_day + 1 : match.current_day;
      await client.query(
        "UPDATE matches SET status = $2, status_note = $3, current_day = $4 WHERE id = $1",
        [matchId, next, note?.trim() || null, Math.min(nextDay, match.days)]
      );
    },
    opts
  );

// Manual result (draw, no result, abandoned, DLS/award, or overriding the computed one).
export const setResult = (matchId, input, opts = {}) =>
  withMatch(
    matchId,
    async (client, match) => {
      const type = input.type;
      if (!["win", "tie", "draw", "no_result", "abandoned"].includes(type)) fail("Unknown result type");
      if (type === "win" && ![match.team1_id, match.team2_id].includes(Number(input.winnerId))) {
        fail("Pick the winning team");
      }
      const inn = await currentInnings(client, matchId);
      if (inn) {
        await client.query(
          `UPDATE innings SET status = 'completed', end_reason = 'match_ended', ended_at = now(),
                  striker_id = NULL, non_striker_id = NULL, bowler_id = NULL WHERE id = $1`,
          [inn.id]
        );
      }
      await applyResult(client, match, {
        type,
        winnerId: type === "win" ? Number(input.winnerId) : null,
        margin: input.margin != null && input.margin !== "" ? Number(input.margin) : null,
        marginType: input.marginType || null,
        method: input.method || null,
        text: input.text?.trim() || null,
      });
      if (input.playerOfMatchId !== undefined) {
        await client.query("UPDATE matches SET player_of_match_id = $2 WHERE id = $1", [matchId, input.playerOfMatchId || null]);
      }
    },
    opts
  );

export const setPlayerOfMatch = (matchId, playerId, opts = {}) =>
  withMatch(
    matchId,
    async (client) => {
      if (playerId) {
        const p = (await loadPlayers(client, matchId, [Number(playerId)])).get(Number(playerId));
        if (!p) fail("Player is not part of this match");
      }
      await client.query("UPDATE matches SET player_of_match_id = $2 WHERE id = $1", [matchId, playerId || null]);
    },
    opts
  );

export const deleteMatch = async (matchId) => {
  const { rowCount } = await db.query("DELETE FROM matches WHERE id = $1", [matchId]);
  if (!rowCount) fail("Match not found", 404);
  notifyMatch(matchId);
};

