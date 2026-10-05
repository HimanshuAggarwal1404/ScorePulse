import React, { useState } from "react";
import { scorer } from "../../api";
import { Card, Heading, Muted, Row } from "../match/ui";
import { ActionError, Button, Check, Field, Input, Select } from "./Form";
import { useAction } from "../../hooks/useAction";

// Which side bats next, following the toss and normal alternation.
const defaultBattingTeam = (data) => {
  const { match, innings } = data;
  if (!innings.length) {
    const toss = match.toss;
    if (!toss) return match.team1.id;
    return toss.decision === "bat" ? toss.winnerId : toss.winnerId === match.team1.id ? match.team2.id : match.team1.id;
  }
  const last = innings[innings.length - 1];
  // the team batting second in the match opens a super over
  if (isTied(data)) return last.battingTeamId;
  return last.bowlingTeamId;
};

const isTied = ({ match, innings }) => {
  if (match.rules.inningsPerTeam !== 1 || innings.length < 2 || innings.length % 2 === 1) return false;
  const [a, b] = innings.slice(-2);
  return a.status === "completed" && b.status === "completed" && a.runs === b.runs;
};

const StartInnings = ({ data, t, onState }) => {
  const { match, innings, squads } = data;
  const tied = isTied(data);
  const [battingTeamId, setBattingTeamId] = useState(defaultBattingTeam(data));
  const [form, setForm] = useState({ strikerId: "", nonStrikerId: "", bowlerId: "", maxOvers: "", target: "" });
  const [superOver, setSuperOver] = useState(tied);
  const { busy, error, run } = useAction();

  const bowlingTeamId = battingTeamId === match.team1.id ? match.team2.id : match.team1.id;
  // substitute fielders can't bat or bowl
  const playersOf = (teamId) =>
    (squads.find((s) => s.team.id === teamId)?.players || []).filter((p) => p.role !== "substitute");
  const batters = playersOf(battingTeamId);
  const bowlers = playersOf(bowlingTeamId);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const number = innings.length + 1;
  const multiDay = match.rules.inningsPerTeam === 2;

  const start = () =>
    run(async () => {
      const res = await scorer("POST", `/matches/${match.id}/innings`, {
        battingTeamId,
        strikerId: Number(form.strikerId),
        nonStrikerId: Number(form.nonStrikerId),
        bowlerId: Number(form.bowlerId),
        superOver,
        maxOvers: form.maxOvers || undefined,
        target: form.target || undefined,
      });
      onState(res.state);
    });

  const label = superOver ? "Super Over" : multiDay ? `Innings ${number}` : number === 1 ? "1st innings" : "2nd innings";

  return (
    <Card $t={t}>
      <Heading $t={t}>Start {label}</Heading>
      {tied && (
        <Muted $t={t}>
          Scores are level. Start a Super Over below, or record the result as a tie from the match controls.
        </Muted>
      )}
      <Row $align="flex-end" style={{ marginTop: 10 }}>
        <Field $t={t}>
          Batting team
          <Select $t={t} value={battingTeamId} onChange={(e) => setBattingTeamId(Number(e.target.value))}>
            <option value={match.team1.id}>{match.team1.name}</option>
            <option value={match.team2.id}>{match.team2.name}</option>
          </Select>
        </Field>
        <Field $t={t}>
          Striker
          <Select $t={t} value={form.strikerId} onChange={set("strikerId")}>
            <option value="">Select…</option>
            {batters.map((p) => (
              <option key={p.id} value={p.id} disabled={String(p.id) === form.nonStrikerId}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field $t={t}>
          Non-striker
          <Select $t={t} value={form.nonStrikerId} onChange={set("nonStrikerId")}>
            <option value="">Select…</option>
            {batters.map((p) => (
              <option key={p.id} value={p.id} disabled={String(p.id) === form.strikerId}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field $t={t}>
          Opening bowler
          <Select $t={t} value={form.bowlerId} onChange={set("bowlerId")}>
            <option value="">Select…</option>
            {bowlers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
      </Row>

      <Row $align="flex-end" style={{ marginTop: 12 }}>
        {match.rules.oversPerInnings && !superOver && (
          <Field $t={t} $min="130px">
            Overs (if reduced)
            <Input $t={t} type="number" min="1" placeholder={String(match.rules.oversPerInnings)} value={form.maxOvers} onChange={set("maxOvers")} />
          </Field>
        )}
        {number > 1 && (
          <Field $t={t} $min="130px">
            Target (if revised)
            <Input $t={t} type="number" min="1" placeholder="auto" value={form.target} onChange={set("target")} />
          </Field>
        )}
        {match.rules.inningsPerTeam === 1 && number > 2 && (
          <Check $t={t}>
            <input type="checkbox" checked={superOver} onChange={(e) => setSuperOver(e.target.checked)} /> Super Over
          </Check>
        )}
      </Row>

      <ActionError error={error} t={t} onKeySaved={start} />
      <Row style={{ marginTop: 12 }}>
        <Button $t={t} onClick={start} disabled={busy || !form.strikerId || !form.nonStrikerId || !form.bowlerId}>
          {busy ? "Starting…" : `Start ${label}`}
        </Button>
        {multiDay && number === 3 && (
          <Muted $t={t}>Enforcing the follow-on? Pick the side that batted second as the batting team.</Muted>
        )}
      </Row>
    </Card>
  );
};

export default StartInnings;
