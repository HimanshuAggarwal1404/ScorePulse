import React, { useState } from "react";
import styled from "styled-components";
import { scorer } from "../../api";
import { Card, Heading, Muted, Row } from "../match/ui";
import { ActionError, Button, Field, Input, Select } from "./Form";
import { useAction } from "../../hooks/useAction";

const Panel = styled.details`
  border-top: 1px solid ${({ $t }) => $t.border};
  padding: 10px 0;

  summary {
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 4px 0;
  }
  &[open] summary {
    margin-bottom: 10px;
  }
`;

export const TossForm = ({ data, t, onState }) => {
  const { match } = data;
  const [winnerId, setWinnerId] = useState(match.team1.id);
  const [decision, setDecision] = useState("bat");
  const { busy, error, run } = useAction();
  const save = () =>
    run(async () => onState((await scorer("POST", `/matches/${match.id}/toss`, { winnerId, decision })).state));

  return (
    <Card $t={t}>
      <Heading $t={t}>Toss</Heading>
      <Row $align="flex-end">
        <Field $t={t}>
          Won by
          <Select $t={t} value={winnerId} onChange={(e) => setWinnerId(Number(e.target.value))}>
            <option value={match.team1.id}>{match.team1.name}</option>
            <option value={match.team2.id}>{match.team2.name}</option>
          </Select>
        </Field>
        <Field $t={t}>
          Elected to
          <Select $t={t} value={decision} onChange={(e) => setDecision(e.target.value)}>
            <option value="bat">Bat</option>
            <option value="field">Bowl</option>
          </Select>
        </Field>
        <Button $t={t} onClick={save} disabled={busy}>
          Save toss
        </Button>
      </Row>
      <ActionError error={error} t={t} onKeySaved={save} />
    </Card>
  );
};

const MatchControls = ({ data, t, onState }) => {
  const { match, innings, squads } = data;
  const inPlay = innings.some((i) => i.status === "in_progress");
  const multiDay = match.rules.inningsPerTeam === 2;
  const { busy, error, run } = useAction();

  const [note, setNote] = useState("");
  const [revise, setRevise] = useState({ target: "", maxOvers: "" });
  const [result, setResult] = useState({ type: "draw", winnerId: match.team1.id, margin: "", marginType: "runs", method: "", text: "" });
  const [sub, setSub] = useState({ teamId: match.team1.id, name: "", role: "substitute" });
  const [pom, setPom] = useState(match.playerOfMatch?.id || "");

  const call = (method, path, body) => run(async () => onState((await scorer(method, path, body)).state));
  const base = `/matches/${match.id}`;
  const allPlayers = squads.flatMap((s) => s.players.map((p) => ({ ...p, team: s.team.short })));

  return (
    <Card $t={t}>
      <Heading $t={t}>Match controls</Heading>
      <ActionError error={error} t={t} />

      {!["completed", "abandoned"].includes(match.status) && (
        <Panel $t={t}>
          <summary>Interruptions</summary>
          <Row $align="flex-end">
            <Field $t={t} $grow>
              Note (shown to viewers)
              <Input $t={t} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Rain stops play / Bad light / Lunch" />
            </Field>
            <Button $t={t} $variant="ghost" disabled={busy} onClick={() => call("POST", `${base}/status`, { status: "delayed", note })}>
              Stop play
            </Button>
            {multiDay && (
              <Button $t={t} $variant="ghost" disabled={busy} onClick={() => call("POST", `${base}/status`, { status: "stumps", note })}>
                Stumps
              </Button>
            )}
            <Button $t={t} disabled={busy} onClick={() => call("POST", `${base}/status`, { status: "live" })}>
              Resume play
            </Button>
          </Row>
          <Muted $t={t}>
            Current: {match.status}
            {match.statusNote ? ` - ${match.statusNote}` : ""}
            {multiDay ? ` · Day ${match.currentDay}` : ""}
          </Muted>
        </Panel>
      )}

      {inPlay && (
        <Panel $t={t}>
          <summary>Revise target / overs (DLS)</summary>
          <Row $align="flex-end">
            <Field $t={t} $min="130px">
              Target
              <Input $t={t} type="number" min="1" value={revise.target} onChange={(e) => setRevise((r) => ({ ...r, target: e.target.value }))} />
            </Field>
            <Field $t={t} $min="130px">
              Overs
              <Input $t={t} type="number" min="1" step="0.1" value={revise.maxOvers} onChange={(e) => setRevise((r) => ({ ...r, maxOvers: e.target.value }))} />
            </Field>
            <Button
              $t={t}
              disabled={busy || (!revise.target && !revise.maxOvers)}
              onClick={() => call("PATCH", `${base}/innings/current`, { target: revise.target || undefined, maxOvers: revise.maxOvers || undefined })}
            >
              Revise
            </Button>
          </Row>
        </Panel>
      )}

      {inPlay && (
        <Panel $t={t}>
          <summary>End the innings</summary>
          <Row>
            {multiDay && (
              <Button $t={t} $variant="ghost" disabled={busy} onClick={() => call("POST", `${base}/innings/end`, { reason: "declared" })}>
                Declare
              </Button>
            )}
            <Button $t={t} $variant="ghost" disabled={busy} onClick={() => call("POST", `${base}/innings/end`, { reason: "all_out" })}>
              All out (no more batters)
            </Button>
            <Button $t={t} $variant="ghost" disabled={busy} onClick={() => call("POST", `${base}/innings/end`, { reason: "overs_complete" })}>
              Overs complete
            </Button>
          </Row>
        </Panel>
      )}

      <Panel $t={t}>
        <summary>{match.status === "completed" ? "Change the result" : "Finish the match / record a result"}</summary>
        <Row $align="flex-end">
          <Field $t={t}>
            Result
            <Select $t={t} value={result.type} onChange={(e) => setResult((r) => ({ ...r, type: e.target.value }))}>
              <option value="win">Win</option>
              <option value="tie">Tie</option>
              <option value="draw">Draw</option>
              <option value="no_result">No result</option>
              <option value="abandoned">Abandoned</option>
            </Select>
          </Field>
          {result.type === "win" && (
            <>
              <Field $t={t}>
                Winner
                <Select $t={t} value={result.winnerId} onChange={(e) => setResult((r) => ({ ...r, winnerId: Number(e.target.value) }))}>
                  <option value={match.team1.id}>{match.team1.name}</option>
                  <option value={match.team2.id}>{match.team2.name}</option>
                </Select>
              </Field>
              <Field $t={t} $min="90px">
                Margin
                <Input $t={t} type="number" min="0" value={result.margin} onChange={(e) => setResult((r) => ({ ...r, margin: e.target.value }))} />
              </Field>
              <Field $t={t} $min="110px">
                By
                <Select $t={t} value={result.marginType} onChange={(e) => setResult((r) => ({ ...r, marginType: e.target.value }))}>
                  <option value="runs">runs</option>
                  <option value="wickets">wickets</option>
                  <option value="innings">innings &amp; runs</option>
                </Select>
              </Field>
              <Field $t={t} $min="110px">
                Method
                <Select $t={t} value={result.method} onChange={(e) => setResult((r) => ({ ...r, method: e.target.value }))}>
                  <option value="">-</option>
                  <option value="DLS">DLS</option>
                  <option value="Super Over">Super Over</option>
                  <option value="Awarded">Awarded</option>
                </Select>
              </Field>
            </>
          )}
          <Button
            $t={t}
            $variant="danger"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Record this result? Any innings in progress will be closed.")) {
                call("POST", `${base}/result`, { ...result, marginType: result.margin ? result.marginType : null });
              }
            }}
          >
            Record result
          </Button>
        </Row>
      </Panel>

      <Panel $t={t}>
        <summary>Player of the match</summary>
        <Row $align="flex-end">
          <Field $t={t} $grow>
            Player
            <Select $t={t} value={pom} onChange={(e) => setPom(e.target.value)}>
              <option value="">None</option>
              {allPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.team})
                </option>
              ))}
            </Select>
          </Field>
          <Button $t={t} disabled={busy} onClick={() => call("PUT", `${base}/player-of-match`, { playerId: pom ? Number(pom) : null })}>
            Save
          </Button>
        </Row>
      </Panel>

      <Panel $t={t}>
        <summary>Add a substitute / replacement</summary>
        <Row $align="flex-end">
          <Field $t={t}>
            Team
            <Select $t={t} value={sub.teamId} onChange={(e) => setSub((s) => ({ ...s, teamId: Number(e.target.value) }))}>
              <option value={match.team1.id}>{match.team1.name}</option>
              <option value={match.team2.id}>{match.team2.name}</option>
            </Select>
          </Field>
          <Field $t={t} $grow>
            Name
            <Input $t={t} value={sub.name} onChange={(e) => setSub((s) => ({ ...s, name: e.target.value }))} />
          </Field>
          <Field $t={t}>
            Type
            <Select $t={t} value={sub.role} onChange={(e) => setSub((s) => ({ ...s, role: e.target.value }))}>
              <option value="substitute">Substitute fielder</option>
              <option value="replacement">Replacement (can bat / bowl)</option>
            </Select>
          </Field>
          <Button
            $t={t}
            disabled={busy || !sub.name.trim()}
            onClick={async () => {
              await call("POST", `${base}/players`, sub);
              setSub((s) => ({ ...s, name: "" }));
            }}
          >
            Add
          </Button>
        </Row>
      </Panel>
    </Card>
  );
};

export default MatchControls;
