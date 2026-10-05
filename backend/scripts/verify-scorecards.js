// Cross-checks every imported Cricsheet match: the scorecard built from the
// database must match figures computed independently from the raw JSON.
//   npm run verify
import db from "../src/db/index.js";
import { loadSource } from "../src/scoring/cricsheet.js";
import { buildMatchView, loadMatchData } from "../src/scoring/state.js";

const BOWLER_KINDS = ["bowled", "caught", "caught and bowled", "lbw", "stumped", "hit wicket"];

const expectFromJson = (inn) => {
  const bat = {};
  const bowl = {};
  for (const d of inn.overs.flatMap((o) => o.deliveries)) {
    const e = d.extras || {};
    const b = (bat[d.batter] ||= { runs: 0, balls: 0, fours: 0, sixes: 0 });
    b.runs += d.runs.batter;
    if (!e.wides) b.balls += 1;
    if (d.runs.batter === 4 && !d.runs.non_boundary) b.fours += 1;
    if (d.runs.batter === 6 && !d.runs.non_boundary) b.sixes += 1;

    const w = (bowl[d.bowler] ||= { runs: 0, legal: 0, wickets: 0 });
    w.runs += d.runs.batter + (e.wides || 0) + (e.noballs || 0);
    if (!e.wides && !e.noballs) w.legal += 1;
    w.wickets += (d.wickets || []).filter((x) => BOWLER_KINDS.includes(x.kind)).length;
  }
  return { bat, bowl };
};

const { rows: matches } = await db.query(
  "SELECT id, source_match_id FROM matches WHERE source = 'cricsheet' ORDER BY id"
);

let checked = 0;
const errors = [];

for (const m of matches) {
  const json = loadSource(m.source_match_id);
  const { view } = buildMatchView(await loadMatchData(db, m.id));

  json.innings.forEach((inn, i) => {
    const got = view.innings[i];
    const exp = expectFromJson(inn);
    const where = `${m.source_match_id} inns ${i + 1}`;

    for (const [name, e] of Object.entries(exp.bat)) {
      const row = got.batting.find((b) => b.name === name);
      checked++;
      if (!row) errors.push(`${where}: batter ${name} missing`);
      else if (row.runs !== e.runs || row.balls !== e.balls || row.fours !== e.fours || row.sixes !== e.sixes) {
        errors.push(`${where}: ${name} ${row.runs}(${row.balls}) ${row.fours}x4 ${row.sixes}x6, expected ${e.runs}(${e.balls}) ${e.fours}x4 ${e.sixes}x6`);
      }
    }
    for (const [name, e] of Object.entries(exp.bowl)) {
      const row = got.bowling.find((b) => b.name === name);
      checked++;
      if (!row) errors.push(`${where}: bowler ${name} missing`);
      else if (row.runs !== e.runs || row.legalBalls !== e.legal || row.wickets !== e.wickets) {
        errors.push(`${where}: ${name} ${row.legalBalls}b ${row.runs}r ${row.wickets}w, expected ${e.legal}b ${e.runs}r ${e.wickets}w`);
      }
    }

    // scorecard must add up: batters + extras = total; FOW count = wickets
    const sum = got.batting.reduce((s, b) => s + b.runs, 0) + got.extras.total;
    checked++;
    if (sum !== got.runs) errors.push(`${where}: batting + extras = ${sum}, total = ${got.runs}`);
    checked++;
    if (got.fallOfWickets.length !== got.wickets) errors.push(`${where}: ${got.fallOfWickets.length} FOW for ${got.wickets} wickets`);
    const partRuns = got.partnerships.reduce((s, p) => s + p.runs, 0);
    checked++;
    if (partRuns !== got.runs) errors.push(`${where}: partnerships add to ${partRuns}, total = ${got.runs}`);
  });
}

console.log(`${checked} checks across ${matches.length} matches`);
if (errors.length) {
  console.log(errors.join("\n"));
  console.log(`\n${errors.length} problems`);
} else {
  console.log("All scorecards match the source data");
}
await db.end();
process.exit(errors.length ? 1 : 0);
