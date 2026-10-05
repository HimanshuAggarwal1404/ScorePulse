// Scores short matches by hand through the engine and checks the laws are
// applied the way a scorer expects. Creates its own matches and deletes them.
//   npm run test:engine
import assert from "node:assert/strict";
import db from "../src/db/index.js";
import * as engine from "../src/scoring/engine.js";
import { buildMatchView, loadMatchData } from "../src/scoring/state.js";

const created = [];
let passed = 0;

const view = async (id) => buildMatchView(await loadMatchData(db, id)).view;
const crease = async (id) => {
  const { rows } = await db.query(
    "SELECT striker_id, non_striker_id, bowler_id FROM innings WHERE match_id = $1 AND status = 'in_progress'",
    [id]
  );
  return rows[0] || null;
};
const rejects = async (fn, pattern, label) => {
  await assert.rejects(fn, (err) => err instanceof engine.ScoringError && pattern.test(err.message), label);
  passed++;
};
const check = (cond, label) => {
  assert.ok(cond, label);
  passed++;
};

const { rows: teams } = await db.query("SELECT id FROM teams ORDER BY id LIMIT 2");
const [A, B] = teams.map((t) => t.id);

const newMatch = async (overs) => {
  const id = await engine.createMatch({ team1Id: A, team2Id: B, format: "T20", overs, title: "Engine test" }, { quiet: true });
  created.push(id);
  const a = await engine.setSquad(id, A, Array.from({ length: 11 }, (_, i) => ({ name: `Test A${i + 1}` })), { quiet: true });
  const b = await engine.setSquad(id, B, Array.from({ length: 11 }, (_, i) => ({ name: `Test B${i + 1}` })), { quiet: true });
  return { id, a, b };
};
const q = { quiet: true };

try {
  /* ---------------- match 1: rules ---------------- */
  const { id, a, b } = await newMatch(2);

  await rejects(() => engine.startInnings(id, {}, q), /toss/, "toss is required");
  await engine.setToss(id, { winnerId: A, decision: "bat" }, q);
  await rejects(
    () => engine.startInnings(id, { strikerId: b[0], nonStrikerId: a[1], bowlerId: b[0] }, q),
    /right side/,
    "openers must come from the batting side"
  );
  await engine.startInnings(id, { strikerId: a[0], nonStrikerId: a[1], bowlerId: b[0] }, q);

  // single -> batters change ends
  await engine.recordBall(id, { runsBatter: 1 }, q);
  let c = await crease(id);
  check(c.striker_id === a[1] && c.non_striker_id === a[0], "odd runs rotate the strike");

  // wide: no legal ball, no strike change, ball number repeats
  await engine.recordBall(id, { wides: 1 }, q);
  // no-ball hit for four
  await engine.recordBall(id, { noballs: 1, runsBatter: 4, isBoundary: true }, q);
  let v = await view(id);
  let inn = v.innings[0];
  check(inn.runs === 7 && inn.legalBalls === 1, "extras add runs but not legal balls");
  const nbBatter = inn.batting.find((x) => x.id === a[1]);
  check(nbBatter.runs === 4 && nbBatter.balls === 1 && nbBatter.fours === 1, "no-ball counts as a ball faced; wide does not");
  check(inn.bowling[0].runs === 7 && inn.bowling[0].legalBalls === 1, "bowler is charged wides and no-balls");

  // leg byes are not charged to the bowler, but do rotate strike
  await engine.recordBall(id, { legbyes: 1 }, q);
  c = await crease(id);
  check(c.striker_id === a[0], "leg byes rotate the strike");
  v = await view(id);
  check(v.innings[0].bowling[0].runs === 7 && v.innings[0].extras.legbyes === 1, "leg byes go to extras, not the bowler");

  // bowled off a wide is impossible
  await rejects(() => engine.recordBall(id, { wides: 1, wickets: [{ kind: "bowled" }] }, q), /wide/, "no bowled off a wide");

  // finish the over: 4 more legal balls (dot, dot, dot, 2)
  await engine.recordBall(id, {}, q);
  await engine.recordBall(id, {}, q);
  await engine.recordBall(id, {}, q);
  await engine.recordBall(id, { runsBatter: 2 }, q);
  c = await crease(id);
  check(c.bowler_id === null, "bowler is cleared at the end of the over");
  check(c.striker_id === a[1], "batters change ends at the end of the over");
  await rejects(() => engine.recordBall(id, {}, q), /bowler/, "a new over needs a bowler");
  await rejects(() => engine.setCrease(id, { bowlerId: b[0] }, q), /two overs in a row/, "no consecutive overs");
  await engine.setCrease(id, { bowlerId: b[1] }, q);

  v = await view(id);
  check(v.innings[0].overs === "1" && v.innings[0].runs === 10, "score after one over is 10 in 1 over");
  check(v.innings[0].overSummaries[0].balls.map((x) => x.chip).join(" ") === "1 wd 5nb 1lb 0 0 0 2", "over summary chips");

  // wicket: caught, striker out, new batter needed
  await engine.recordBall(id, { wickets: [{ kind: "caught", fielders: [{ id: b[5] }] }] }, q);
  c = await crease(id);
  check(c.striker_id === null && c.non_striker_id === a[0], "dismissed striker leaves the crease");
  await rejects(() => engine.recordBall(id, {}, q), /batters/, "a new batter is required");
  await rejects(() => engine.setCrease(id, { strikerId: a[1] }, q), /already out/, "an out batter can't come back");
  v = await view(id);
  check(v.innings[0].batting.find((x) => x.id === a[1]).dismissal === "c Test B6 b Test B2", "dismissal text");
  check(v.live.lastWicket.score === "10/1", "last wicket in the live panel");

  // undo brings the batter back
  await engine.undoLastBall(id, q);
  c = await crease(id);
  check(c.striker_id === a[1] && c.bowler_id === b[1], "undo restores the crease");
  v = await view(id);
  check(v.innings[0].wickets === 0 && v.innings[0].legalBalls === 6, "undo removes the wicket and the ball");

  // run out of the non-striker going for a second
  await engine.recordBall(id, { runsBatter: 1, wickets: [{ kind: "run out", playerOutId: a[0], fielders: [{ id: b[3] }] }] }, q);
  c = await crease(id);
  check(c.striker_id === null && c.non_striker_id === a[1], "run-out end is vacated after the completed run");
  await engine.setCrease(id, { strikerId: a[2] }, q);

  // play out the second over -> innings ends on overs, break with a target
  for (let i = 0; i < 5; i++) await engine.recordBall(id, { runsBatter: i === 4 ? 6 : 0, isBoundary: i === 4 }, q);
  v = await view(id);
  check(v.innings[0].status === "completed" && v.innings[0].endReason === "overs_complete", "innings ends after the allotted overs");
  check(v.match.status === "innings_break", "match goes to innings break");
  const firstTotal = v.innings[0].runs;
  check(v.match.statusText === `Innings Break - ${v.match.team2.name} need ${firstTotal + 1} runs to win`, "innings break status text");

  // chase
  await engine.startInnings(id, { strikerId: b[0], nonStrikerId: b[1], bowlerId: a[10] }, q);
  v = await view(id);
  check(v.innings[1].target === firstTotal + 1, "target = first innings + 1");
  check(v.match.statusText === `${v.match.team2.name} need ${firstTotal + 1} runs in 12 balls`, "chase status text");
  await engine.recordBall(id, { runsBatter: 2 }, q);
  await engine.recordBall(id, { runsBatter: 6, isBoundary: true }, q);
  v = await view(id);
  check(v.live.need === firstTotal + 1 - 8 && v.live.ballsLeft === 10, "live panel: need / balls left");
  check(v.live.batters[0].onStrike && v.live.batters[0].runs === 8, "live panel: striker figures");
  while ((await view(id)).match.status === "live") {
    await engine.recordBall(id, { runsBatter: 4, isBoundary: true }, q);
  }
  v = await view(id);
  check(v.match.status === "completed", "match completes when the target is reached");
  check(v.match.result.text === `${v.match.team2.name} won by 10 wkts`, `result text (${v.match.result.text})`);
  await rejects(() => engine.recordBall(id, {}, q), /over/, "no balls after the match");

  /* ---------------- match 2: tie + super over ---------------- */
  const m2 = await newMatch(1);
  await engine.setToss(m2.id, { winnerId: A, decision: "bat" }, q);
  await engine.startInnings(m2.id, { strikerId: m2.a[0], nonStrikerId: m2.a[1], bowlerId: m2.b[0] }, q);
  for (let i = 0; i < 6; i++) await engine.recordBall(m2.id, { runsBatter: 2 }, q);
  await engine.startInnings(m2.id, { strikerId: m2.b[0], nonStrikerId: m2.b[1], bowlerId: m2.a[0] }, q);
  for (let i = 0; i < 6; i++) await engine.recordBall(m2.id, { runsBatter: 2 }, q);
  v = await view(m2.id);
  check(v.match.status === "innings_break" && /Scores level/.test(v.match.statusText), "a tie waits for a super over");
  await engine.startInnings(m2.id, { superOver: true, strikerId: m2.b[2], nonStrikerId: m2.b[3], bowlerId: m2.a[4] }, q);
  v = await view(m2.id);
  check(v.innings[2].battingTeamId === B && v.innings[2].maxWickets === 2, "team batting second bats first in the super over");
  await engine.recordBall(m2.id, { wickets: [{ kind: "bowled" }] }, q);
  await engine.setCrease(m2.id, { strikerId: m2.b[4] }, q);
  await engine.recordBall(m2.id, { wickets: [{ kind: "bowled" }] }, q);
  v = await view(m2.id);
  check(v.innings[2].status === "completed" && v.innings[2].endReason === "all_out", "two wickets end a super over");
  await engine.startInnings(m2.id, { superOver: true, strikerId: m2.a[2], nonStrikerId: m2.a[3], bowlerId: m2.b[5] }, q);
  await engine.recordBall(m2.id, { runsBatter: 1 }, q);
  v = await view(m2.id);
  check(v.match.result.text === `Match tied (${v.match.team1.name} won the Super Over)`, `super over result (${v.match.result.text})`);

  console.log(`All ${passed} engine checks passed`);
} catch (err) {
  console.error(`Failed after ${passed} checks:`, err.message);
  process.exitCode = 1;
} finally {
  for (const id of created) await db.query("DELETE FROM matches WHERE id = $1", [id]);
  await db.end();
}
