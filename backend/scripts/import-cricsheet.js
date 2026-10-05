// Imports Cricsheet JSON files from /MatchesData through the scoring engine
// and cross-checks every innings total against the raw file.
//
//   npm run import:cricsheet              -> every file in MatchesData
//   npm run import:cricsheet -- 1490238   -> one match
//   npm run import:cricsheet -- --force   -> re-import matches that already exist
import db from "../src/db/index.js";
import { createFromSource, listSources, loadSource, playSource } from "../src/scoring/cricsheet.js";
import { countsAsWicket } from "../src/scoring/rules.js";

const args = process.argv.slice(2);
const force = args.includes("--force");
const ids = args.filter((a) => !a.startsWith("--"));
const targets = ids.length ? ids : listSources().map((s) => s.id);

const expectedTotals = (json) =>
  json.innings.map((inn) => {
    const dels = inn.overs.flatMap((o) => o.deliveries);
    return {
      team: inn.team,
      runs: dels.reduce((s, d) => s + d.runs.total, 0),
      wickets: dels.reduce((s, d) => s + (d.wickets || []).filter((w) => countsAsWicket(w.kind)).length, 0),
      legal: dels.filter((d) => !d.extras?.wides && !d.extras?.noballs).length,
    };
  });

let problems = 0;

for (const id of targets) {
  const json = loadSource(id);
  const { rows: existing } = await db.query(
    "SELECT id FROM matches WHERE source = 'cricsheet' AND source_match_id = $1",
    [id]
  );
  if (existing.length) {
    if (!force) {
      console.log(`- ${id}: already imported (match ${existing[0].id}), use --force to re-import`);
      continue;
    }
    await db.query("DELETE FROM matches WHERE id = $1", [existing[0].id]);
  }

  const started = Date.now();
  const matchId = await createFromSource(json, { source: "cricsheet", sourceMatchId: id });
  const outcome = await playSource(matchId, json, { quiet: true });

  const { rows: totals } = await db.query(
    `SELECT it.*, t.name AS team FROM innings_totals it JOIN teams t ON t.id = it.batting_team_id
      WHERE it.match_id = $1 ORDER BY innings_number`,
    [matchId]
  );
  const { rows: m } = await db.query("SELECT result_text FROM matches WHERE id = $1", [matchId]);

  const expected = expectedTotals(json);
  const lines = expected.map((e, i) => {
    const got = totals[i];
    const ok = got && got.team === e.team && got.runs === e.runs && got.wickets === e.wickets && got.legal_balls === e.legal;
    if (!ok) problems++;
    return `    ${ok ? "ok " : "BAD"} ${e.team}: ${got?.runs}/${got?.wickets} in ${got?.legal_balls} balls` +
      (ok ? "" : `  (expected ${e.runs}/${e.wickets} in ${e.legal})`);
  });

  console.log(`+ ${id} -> match ${matchId}  [${outcome}, ${Date.now() - started} ms]  ${m[0].result_text}`);
  console.log(lines.join("\n"));
}

console.log(problems ? `\n${problems} innings did not match the source data` : "\nAll innings match the source data");
await db.end();
process.exit(problems ? 1 : 0);
