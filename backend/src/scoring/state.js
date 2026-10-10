// Builds the complete derived view of a match (scorecards, live panel,
// commentary, over summaries) from raw deliveries. Nothing here is stored;
// deliveries are the single source of truth.
import {
  ballChip,
  bowlerRuns,
  countsAsWicket,
  dismissalText,
  economy,
  facedByBatter,
  formatLabel,
  isBowlerWicket,
  isLegal,
  oversText,
  plural,
  runRate,
  runsTotal,
  strikeRate,
} from "./rules.js";
import { resultText, statusText, tossText } from "./text.js";

/* ------------------------------------------------------------------ */
/* LOADING                                                             */
/* ------------------------------------------------------------------ */

export const loadMatchData = async (db, matchId) => {
  const { rows: matchRows } = await db.query(
    `SELECT m.*,
            t1.name AS team1_name, COALESCE(t1.code, t1.short_code) AS team1_short,
            t2.name AS team2_name, COALESCE(t2.code, t2.short_code) AS team2_short,
            v.name AS venue_name, v.city AS venue_city, v.country AS venue_country,
            tr.name AS tournament_name
       FROM matches m
       JOIN teams t1 ON t1.id = m.team1_id
       JOIN teams t2 ON t2.id = m.team2_id
       LEFT JOIN venues v ON v.id = m.venue_id
       LEFT JOIN tournaments tr ON tr.id = m.tournament_id
      WHERE m.id = $1`,
    [matchId]
  );
  if (!matchRows.length) return null;

  const [players, innings, deliveries, wickets, fielders] = await Promise.all([
    db.query(
      `SELECT id, team_id, name, player_id, role, is_captain, is_keeper, list_order
         FROM match_players WHERE match_id = $1
        ORDER BY team_id, list_order, id`,
      [matchId]
    ),
    db.query(
      `SELECT * FROM innings WHERE match_id = $1 ORDER BY innings_number`,
      [matchId]
    ),
    db.query(
      `SELECT d.* FROM deliveries d
         JOIN innings i ON i.id = d.innings_id
        WHERE d.match_id = $1
        ORDER BY i.innings_number, d.seq`,
      [matchId]
    ),
    db.query(
      `SELECT id, delivery_id, player_out_id, kind FROM wickets
        WHERE match_id = $1 ORDER BY id`,
      [matchId]
    ),
    db.query(
      `SELECT wf.wicket_id, wf.position, wf.fielder_id, wf.is_substitute
         FROM wicket_fielders wf
         JOIN wickets w ON w.id = wf.wicket_id
        WHERE w.match_id = $1
        ORDER BY wf.wicket_id, wf.position`,
      [matchId]
    ),
  ]);

  return {
    match: matchRows[0],
    players: players.rows,
    innings: innings.rows,
    deliveries: deliveries.rows,
    wickets: wickets.rows,
    fielders: fielders.rows,
  };
};

/* ------------------------------------------------------------------ */
/* INNINGS COMPUTATION                                                 */
/* ------------------------------------------------------------------ */

const outcomeText = (d, ctx) => {
  const parts = [];
  const bat = d.runs_batter;

  if (d.wides) parts.push(d.wides === 1 ? "wide" : `${d.wides} wides`);
  if (d.noballs) parts.push("no ball");

  if (bat) {
    if (d.is_boundary) parts.push(bat === 6 ? "SIX" : "FOUR");
    else parts.push(plural(bat, "run"));
  }
  if (d.byes) parts.push(plural(d.byes, "bye"));
  if (d.legbyes) parts.push(plural(d.legbyes, "leg bye"));
  if (d.penalty) parts.push(`${plural(d.penalty, "penalty run")}`);
  if (!parts.length && !d.wickets.length) parts.push("no run");

  for (const w of d.wickets) {
    const text = dismissalText(w, ctx.name);
    parts.push(
      countsAsWicket(w.kind)
        ? `OUT! ${ctx.name(w.player_out_id)} ${text}`
        : `${ctx.name(w.player_out_id)} ${text}`
    );
  }
  return parts.join(", ");
};

const ballKind = (d) => {
  if (d.wickets.some((w) => countsAsWicket(w.kind))) return "wicket";
  if (d.is_boundary && d.runs_batter === 6) return "six";
  if (d.is_boundary && d.runs_batter === 4) return "four";
  if (d.wides) return "wide";
  if (d.noballs) return "noball";
  if (runsTotal(d) === 0) return "dot";
  return "run";
};

const computeInnings = (inn, dels, ctx) => {
  const { bpo, name, match, playerById } = ctx;

  const batters = new Map();
  const bowlers = new Map();
  const extras = { byes: 0, legbyes: 0, wides: 0, noballs: 0, penalty: 0 };
  const fallOfWickets = [];
  const partnerships = [];
  const overs = [];
  const commentary = [];

  let runs = 0;
  let wickets = 0;
  let legal = 0;
  let part = null;
  let cur = null;

  const batterEntry = (id) => {
    if (!batters.has(id)) {
      batters.set(id, {
        id,
        name: name(id),
        profileId: playerById.get(id)?.player_id ?? null,
        order: batters.size,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dots: 0,
        wicket: null,
      });
    }
    return batters.get(id);
  };

  // A batter who walks out again after "retired hurt" is no longer dismissed.
  const arrive = (id) => {
    const b = batterEntry(id);
    if (b.wicket && !countsAsWicket(b.wicket.kind)) b.wicket = null;
    return b;
  };

  const bowlerEntry = (id) => {
    if (!bowlers.has(id)) {
      bowlers.set(id, {
        id,
        name: name(id),
        profileId: playerById.get(id)?.player_id ?? null,
        order: bowlers.size,
        legalBalls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        wides: 0,
        noballs: 0,
        dots: 0,
        fours: 0,
        sixes: 0,
      });
    }
    return bowlers.get(id);
  };

  const batterLine = (b) => `${b.name} ${b.runs}(${b.balls})`;
  const bowlerFigures = (bw) =>
    `${oversText(bw.legalBalls, bpo)}-${bw.maidens}-${bw.runs}-${bw.wickets}`;

  const closePartnership = () => {
    if (!part) return;
    partnerships.push({
      wicket: part.wicket,
      runs: part.runs,
      balls: part.balls,
      batters: [part.a, part.b].map((x) => ({
        id: x.id,
        name: name(x.id),
        runs: x.runs,
        balls: x.balls,
      })),
      unbroken: false,
    });
    part = null;
  };

  const closeOver = (complete, lastDelivery) => {
    if (!cur) return;
    const bowlerIds = [...cur.bowlerIds];
    if (complete && bowlerIds.length === 1 && cur.conceded === 0) {
      bowlerEntry(bowlerIds[0]).maidens += 1;
    }
    const atCrease = [lastDelivery.batter_id, lastDelivery.non_striker_id]
      .filter((id) => {
        const b = batters.get(id);
        return b && !b.wicket;
      })
      .map((id) => batterLine(batters.get(id)));

    const summary = {
      over: cur.over + 1,
      bowlerIds,
      bowlers: bowlerIds.map(name),
      runs: cur.runs,
      wickets: cur.wickets,
      balls: cur.balls,
      complete,
      score: `${runs}/${wickets}`,
      batters: atCrease,
      bowlerFigures: bowlerIds.map((id) => `${name(id)} ${bowlerFigures(bowlerEntry(id))}`),
    };
    overs.push(summary);

    if (complete) {
      commentary.push({
        type: "over_end",
        key: `${inn.id}-over-${cur.over + 1}`,
        inningsNumber: inn.innings_number,
        over: cur.over + 1,
        runs: cur.runs,
        wickets: cur.wickets,
        balls: cur.balls.map((b) => ({ chip: b.chip, kind: b.kind })),
        score: `${ctx.teamShort(inn.batting_team_id)} ${runs}/${wickets}`,
        batters: summary.batters,
        bowlers: summary.bowlerFigures,
      });
    }
    cur = null;
  };

  let prev = null;
  for (const d of dels) {
    // ---- partnership (changes whenever the pair at the crease changes) ----
    const pairKey = [d.batter_id, d.non_striker_id].sort((a, b) => a - b).join("-");
    if (part && part.key !== pairKey) closePartnership();
    if (!part) {
      part = {
        key: pairKey,
        wicket: wickets + 1,
        runs: 0,
        balls: 0,
        a: { id: d.batter_id, runs: 0, balls: 0 },
        b: { id: d.non_striker_id, runs: 0, balls: 0 },
      };
    }

    // ---- over bookkeeping ----
    if (cur && cur.over !== d.over_number) closeOver(false, prev);
    if (!cur) {
      cur = { over: d.over_number, bowlerIds: new Set(), balls: [], runs: 0, wickets: 0, conceded: 0, legal: 0 };
    }

    const striker = arrive(d.batter_id);
    arrive(d.non_striker_id);
    const bowler = bowlerEntry(d.bowler_id);
    const total = runsTotal(d);
    const legalBall = isLegal(d);

    runs += total;
    if (legalBall) legal += 1;

    extras.byes += d.byes;
    extras.legbyes += d.legbyes;
    extras.wides += d.wides;
    extras.noballs += d.noballs;
    extras.penalty += d.penalty;

    // batter
    striker.runs += d.runs_batter;
    if (facedByBatter(d)) {
      striker.balls += 1;
      if (d.runs_batter === 0) striker.dots += 1;
    }
    if (d.is_boundary && d.runs_batter === 4) striker.fours += 1;
    if (d.is_boundary && d.runs_batter === 6) striker.sixes += 1;

    // bowler
    const conceded = bowlerRuns(d);
    bowler.runs += conceded;
    bowler.wides += d.wides;
    bowler.noballs += d.noballs;
    if (legalBall) {
      bowler.legalBalls += 1;
      if (conceded === 0) bowler.dots += 1;
    }
    if (d.is_boundary && d.runs_batter === 4) bowler.fours += 1;
    if (d.is_boundary && d.runs_batter === 6) bowler.sixes += 1;

    // partnership
    part.runs += total;
    const side = part.a.id === d.batter_id ? part.a : part.b;
    side.runs += d.runs_batter;
    if (facedByBatter(d)) {
      part.balls += 1;
      side.balls += 1;
    }

    // over
    cur.bowlerIds.add(d.bowler_id);
    cur.runs += total;
    cur.conceded += conceded;
    if (legalBall) cur.legal += 1;

    // wickets
    const wicketLines = [];
    let partnershipBroken = false;
    for (const w of d.wickets) {
      const out = batterEntry(w.player_out_id);
      out.wicket = w;
      partnershipBroken = true;
      if (countsAsWicket(w.kind)) {
        wickets += 1;
        cur.wickets += 1;
        if (isBowlerWicket(w.kind)) bowler.wickets += 1;
        fallOfWickets.push({
          wicket: wickets,
          runs,
          playerId: out.id,
          name: out.name,
          overs: oversText(legal, bpo),
        });
      }
      wicketLines.push(
        `${out.name} ${dismissalText(w, name)} ${out.runs}(${out.balls}) [4s-${out.fours} 6s-${out.sixes}]`
      );
    }

    const chip = ballChip(d);
    cur.balls.push({ chip, kind: ballKind(d), seq: d.seq });

    commentary.push({
      type: "ball",
      key: `${inn.id}-${d.seq}`,
      inningsNumber: inn.innings_number,
      seq: d.seq,
      label: `${d.over_number}.${d.ball_in_over}`,
      chip,
      kind: ballKind(d),
      runs: total,
      text: `${name(d.bowler_id)} to ${name(d.batter_id)}, ${outcomeText(d, ctx)}`,
      wicket: wicketLines.length ? wicketLines.join(" | ") : null,
      custom: d.commentary || null,
      score: `${runs}/${wickets}`,
      time: d.created_at,
    });

    if (partnershipBroken) closePartnership();
    if (cur.legal >= bpo) closeOver(true, d);
    prev = d;
  }

  if (cur && dels.length) closeOver(false, dels[dels.length - 1]);

  const inProgress = inn.status === "in_progress";
  const crease = [inn.striker_id, inn.non_striker_id].filter(Boolean);
  // new batter(s) at the crease who haven't faced yet
  for (const id of crease) arrive(id);

  if (part) {
    partnerships.push({
      wicket: part.wicket,
      runs: part.runs,
      balls: part.balls,
      batters: [part.a, part.b].map((x) => ({ id: x.id, name: name(x.id), runs: x.runs, balls: x.balls })),
      unbroken: true,
    });
  }

  // ---- scorecard tables ----
  const batting = [...batters.values()]
    .sort((a, b) => a.order - b.order)
    .map((b) => {
      const atCrease = inProgress && crease.includes(b.id);
      let dismissal = dismissalText(b.wicket, name);
      if (!b.wicket) dismissal = atCrease ? "batting" : "not out";
      return {
        id: b.id,
        name: b.name,
        profileId: b.profileId,
        isCaptain: !!playerById.get(b.id)?.is_captain,
        isKeeper: !!playerById.get(b.id)?.is_keeper,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours,
        sixes: b.sixes,
        dots: b.dots,
        strikeRate: strikeRate(b.runs, b.balls),
        dismissal,
        isOut: !!b.wicket && countsAsWicket(b.wicket.kind),
        atCrease,
        onStrike: atCrease && inn.striker_id === b.id,
      };
    });

  const batted = new Set(batters.keys());
  const didNotBat = ctx.players
    .filter((p) => p.team_id === inn.batting_team_id && p.role === "playing" && !batted.has(p.id))
    .map((p) => ({ id: p.id, name: p.name, profileId: p.player_id }));

  const bowling = [...bowlers.values()]
    .sort((a, b) => a.order - b.order)
    .map((bw) => ({
      id: bw.id,
      name: bw.name,
      profileId: bw.profileId,
      overs: oversText(bw.legalBalls, bpo),
      legalBalls: bw.legalBalls,
      maidens: bw.maidens,
      runs: bw.runs,
      wickets: bw.wickets,
      wides: bw.wides,
      noballs: bw.noballs,
      dots: bw.dots,
      fours: bw.fours,
      sixes: bw.sixes,
      economy: economy(bw.runs, bw.legalBalls, bpo),
      isBowling: inProgress && inn.bowler_id === bw.id,
    }));

  const extrasTotal = extras.byes + extras.legbyes + extras.wides + extras.noballs + extras.penalty;

  if (inn.status === "completed") {
    const reason = {
      all_out: "all out",
      overs_complete: "overs complete",
      target_reached: "target reached",
      declared: "declared",
      forfeited: "forfeited",
      match_ended: "end of match",
    }[inn.end_reason];
    commentary.push({
      type: "innings_end",
      key: `${inn.id}-end`,
      inningsNumber: inn.innings_number,
      text: `${ctx.teamName(inn.batting_team_id)} ${runs}/${wickets} (${oversText(legal, bpo)} ov)${reason ? ` - ${reason}` : ""}`,
    });
  }

  return {
    summary: {
      id: inn.id,
      number: inn.innings_number,
      battingTeamId: inn.batting_team_id,
      bowlingTeamId: inn.bowling_team_id,
      battingTeam: ctx.team(inn.batting_team_id),
      bowlingTeam: ctx.team(inn.bowling_team_id),
      status: inn.status,
      endReason: inn.end_reason,
      isSuperOver: inn.is_super_over,
      isFollowOn: inn.is_follow_on,
      runs,
      wickets,
      legalBalls: legal,
      overs: oversText(legal, bpo),
      runRate: runRate(runs, legal, bpo),
      target: inn.target_runs,
      maxBalls: inn.max_balls,
      maxOvers: inn.max_balls ? oversText(inn.max_balls, bpo) : null,
      maxWickets: inn.max_wickets,
      allOut: inn.end_reason === "all_out",
      declared: inn.end_reason === "declared",
    },
    detail: {
      extras: { ...extras, total: extrasTotal },
      batting,
      didNotBat,
      bowling,
      fallOfWickets,
      partnerships,
      overSummaries: overs,
    },
    commentary,
    live: inProgress ? { inn } : null,
  };
};

/* ------------------------------------------------------------------ */
/* MATCH VIEW                                                          */
/* ------------------------------------------------------------------ */

const buildLivePanel = (computed, ctx) => {
  const { summary, detail } = computed;
  const inn = computed.live.inn;
  const bpo = ctx.bpo;

  const batterCard = (id) => {
    if (!id) return null;
    const row = detail.batting.find((b) => b.id === id);
    return row
      ? { ...row, onStrike: id === inn.striker_id }
      : null;
  };

  const lastOver = detail.overSummaries[detail.overSummaries.length - 1];
  const currentBowlerId = inn.bowler_id || null;
  const bowlerRow = (id) => detail.bowling.find((b) => b.id === id) || null;

  // the most recent bowler other than the one currently bowling
  const previousBowlerId = [...detail.overSummaries]
    .reverse()
    .flatMap((o) => [...o.bowlerIds].reverse())
    .find((id) => id !== currentBowlerId);
  const previousBowler = previousBowlerId ? bowlerRow(previousBowlerId) : null;

  const partnership = detail.partnerships.length
    ? detail.partnerships[detail.partnerships.length - 1]
    : null;
  const fow = detail.fallOfWickets[detail.fallOfWickets.length - 1];
  const lastWicketRow = fow ? detail.batting.find((b) => b.id === fow.playerId) : null;

  const need = summary.target ? summary.target - summary.runs : null;
  const ballsLeft = summary.maxBalls ? summary.maxBalls - summary.legalBalls : null;

  // last ~3 overs of chips for the "Recent" strip
  const recent = detail.overSummaries.slice(-3).map((o) => ({
    over: o.over,
    complete: o.complete,
    balls: o.balls.map((b) => ({ chip: b.chip, kind: b.kind })),
    runs: o.runs,
  }));

  return {
    inningsId: summary.id,
    inningsNumber: summary.number,
    battingTeamId: summary.battingTeamId,
    batters: [batterCard(inn.striker_id), batterCard(inn.non_striker_id)].filter(Boolean),
    bowler: currentBowlerId ? bowlerRow(currentBowlerId) : null,
    previousBowler,
    partnership: partnership && partnership.unbroken ? partnership : null,
    lastWicket: lastWicketRow
      ? {
          name: lastWicketRow.name,
          runs: lastWicketRow.runs,
          balls: lastWicketRow.balls,
          dismissal: lastWicketRow.dismissal,
          score: `${fow.runs}/${fow.wicket}`,
          overs: fow.overs,
        }
      : null,
    recent,
    thisOver: lastOver && !lastOver.complete ? lastOver : null,
    crr: summary.runRate,
    target: summary.target,
    need: need != null && need > 0 ? need : null,
    ballsLeft,
    rrr: need != null && need > 0 && ballsLeft ? +((need * bpo) / ballsLeft).toFixed(2) : null,
    needsBowler: summary.status === "in_progress" && !inn.bowler_id,
    needsBatter:
      summary.status === "in_progress" && (!inn.striker_id || !inn.non_striker_id),
  };
};

export const buildMatchView = (data) => {
  const { match, players, innings, deliveries, wickets, fielders } = data;
  const bpo = match.balls_per_over;

  const playerById = new Map(players.map((p) => [p.id, p]));
  const name = (id) => playerById.get(id)?.name ?? "Unknown";

  const teamsById = {
    [match.team1_id]: { id: match.team1_id, name: match.team1_name, short: match.team1_short },
    [match.team2_id]: { id: match.team2_id, name: match.team2_name, short: match.team2_short },
  };
  const team = (id) => teamsById[id];
  const teamName = (id) => teamsById[id]?.name ?? "Unknown";
  const teamShort = (id) => teamsById[id]?.short ?? "";

  // attach wickets + fielders to deliveries
  const fieldersByWicket = new Map();
  for (const f of fielders) {
    if (!fieldersByWicket.has(f.wicket_id)) fieldersByWicket.set(f.wicket_id, []);
    fieldersByWicket.get(f.wicket_id).push({
      id: f.fielder_id,
      isSubstitute: f.is_substitute,
      isKeeper: !!playerById.get(f.fielder_id)?.is_keeper,
    });
  }
  const wicketsByDelivery = new Map();
  for (const w of wickets) {
    const key = String(w.delivery_id);
    if (!wicketsByDelivery.has(key)) wicketsByDelivery.set(key, []);
    wicketsByDelivery.get(key).push({ ...w, fielders: fieldersByWicket.get(w.id) || [] });
  }
  const byInnings = new Map(innings.map((i) => [i.id, []]));
  for (const d of deliveries) {
    const ws = (wicketsByDelivery.get(String(d.id)) || []).map((w) => ({
      ...w,
      bowlerName: name(d.bowler_id),
    }));
    byInnings.get(d.innings_id)?.push({ ...d, wickets: ws });
  }

  const ctx = { bpo, name, match, playerById, players, team, teamName, teamShort };
  const computed = innings.map((inn) => computeInnings(inn, byInnings.get(inn.id), ctx));
  const summaries = computed.map((c) => c.summary);

  const liveComputed = [...computed].reverse().find((c) => c.live);
  const showLive = liveComputed && !["completed", "abandoned"].includes(match.status);

  const squads = [match.team1_id, match.team2_id].map((tid) => ({
    team: team(tid),
    players: players
      .filter((p) => p.team_id === tid)
      .map((p) => ({
        id: p.id,
        name: p.name,
        profileId: p.player_id,
        role: p.role,
        isCaptain: p.is_captain,
        isKeeper: p.is_keeper,
      })),
  }));

  const view = {
    match: {
      id: match.id,
      source: match.source,
      title: match.match_title,
      series: match.series_name || match.tournament_name,
      season: match.season,
      format: match.format,
      formatLabel: formatLabel(match.format, match.team_type),
      teamType: match.team_type,
      status: match.status,
      statusNote: match.status_note,
      currentDay: match.current_day,
      startDate: match.start_date,
      startTime: match.start_time,
      days: match.days,
      venue: match.venue_name
        ? { name: match.venue_name, city: match.venue_city, country: match.venue_country }
        : null,
      team1: team(match.team1_id),
      team2: team(match.team2_id),
      rules: {
        oversPerInnings: match.overs_per_innings,
        ballsPerOver: bpo,
        inningsPerTeam: match.innings_per_team,
      },
      toss: match.toss_winner_id
        ? {
            winnerId: match.toss_winner_id,
            decision: match.toss_decision,
            text: `${teamName(match.toss_winner_id)} won the toss and opted to ${match.toss_decision === "bat" ? "bat" : "bowl"}`,
          }
        : null,
      result: match.result_type
        ? {
            type: match.result_type,
            winnerId: match.winner_id,
            margin: match.win_margin,
            marginType: match.win_margin_type,
            method: match.result_method,
            text: match.result_text || resultText(match, teamName),
          }
        : null,
      playerOfMatch: match.player_of_match_id
        ? {
            id: match.player_of_match_id,
            name: name(match.player_of_match_id),
            profileId: playerById.get(match.player_of_match_id)?.player_id ?? null,
          }
        : null,
      officials: {
        umpires: match.umpires || [],
        tvUmpire: match.tv_umpire,
        matchReferee: match.match_referee,
      },
      statusText: statusText(match, summaries, teamName),
      tossText: tossText(match, teamName),
      updatedAt: match.updated_at,
    },
    innings: computed.map((c) => ({ ...c.summary, ...c.detail })),
    live: showLive ? buildLivePanel(liveComputed, ctx) : null,
    squads,
  };

  const commentary = computed.map((c) => ({
    inningsNumber: c.summary.number,
    battingTeam: c.summary.battingTeam,
    items: c.commentary,
  }));

  return { view, commentary };
};

// Flattened commentary, newest first, optionally paged.
export const commentaryFeed = (commentary, { inningsNumber, before, limit = 60 } = {}) => {
  let all = [];
  for (const inn of commentary) {
    if (inningsNumber && inn.inningsNumber !== Number(inningsNumber)) continue;
    all = all.concat(inn.items);
  }
  all.reverse();
  let start = 0;
  if (before) {
    const idx = all.findIndex((i) => i.key === before);
    start = idx >= 0 ? idx + 1 : 0;
  }
  const items = all.slice(start, start + Number(limit));
  return {
    items,
    nextCursor: start + Number(limit) < all.length ? items[items.length - 1]?.key ?? null : null,
  };
};
