import React, { useState } from "react";
import styled from "styled-components";
import { scorer } from "../../api";
import { BallChip, Card, Chips, Heading, Muted, Row } from "../match/ui";
import { tint } from "../match/theme";
import { ActionError, Button, Check, Field, Input, Select } from "./Form";
import { useAction } from "../../hooks/useAction";

const RunGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(52px, 1fr));
  gap: 8px;

  @media (max-width: 560px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const RunButton = styled.button`
  height: 62px;
  border-radius: 16px;
  transition: transform var(--press) var(--ease), background-color var(--quick) var(--ease);
  &:active:not(:disabled) {
    transform: scale(0.94);
  }
  font-variant-numeric: tabular-nums;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid ${({ $t, $color }) => $color || $t.border};
  background: ${({ $t, $color }) => ($color ? tint($color, 14) : $t.cardAlt)};
  color: ${({ $t, $color }) => $color || $t.text};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Toggle = styled.button`
  padding: 9px 14px;
  border-radius: 999px;
  transition: transform var(--press) var(--ease), background-color var(--quick) var(--ease);
  &:active:not(:disabled) {
    transform: scale(0.96);
  }
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid ${({ $t, $on, $color }) => ($on ? $color || $t.accent : $t.border)};
  background: ${({ $t, $on, $color }) => ($on ? tint($color || $t.accent, 14) : "transparent")};
  color: ${({ $t, $on, $color }) => ($on ? $color || $t.accent : $t.text)};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Crease = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Slot = styled.div`
  border: 1px solid ${({ $t, $hot }) => ($hot ? "var(--accent-line)" : $t.border)};
  box-shadow: ${({ $hot }) => ($hot ? "var(--glow)" : "none")};
  background: ${({ $t, $hot }) => ($hot ? $t.accentSoft : $t.cardAlt)};
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.9rem;

  .label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ $t }) => $t.muted};
  }
  .name {
    font-weight: 700;
    margin: 2px 0;
  }
`;

const WICKETS = [
  "bowled",
  "caught",
  "caught and bowled",
  "lbw",
  "stumped",
  "run out",
  "hit wicket",
  "retired hurt",
  "retired out",
  "obstructing the field",
  "handled the ball",
  "hit the ball twice",
];
const NEEDS_FIELDER = ["caught", "stumped", "run out"];
const EITHER_END = ["run out", "obstructing the field", "retired hurt", "retired out"];

const describe = (runs, mods, ran) => {
  if (mods.wide) return runs ? `${runs + 1} wides` : "1 wide";
  const parts = [];
  if (mods.noball) parts.push("no ball");
  if (mods.bye) parts.push(`${runs} bye${runs === 1 ? "" : "s"}`);
  else if (mods.legbye) parts.push(`${runs} leg bye${runs === 1 ? "" : "s"}`);
  else if (runs === 4 || runs === 6) parts.push(ran ? `${runs} runs (run)` : runs === 4 ? "FOUR" : "SIX");
  else parts.push(runs ? `${runs} run${runs === 1 ? "" : "s"}` : mods.noball ? "" : "dot ball");
  return parts.filter(Boolean).join(" + ");
};

const ScoringPad = ({ data, t, onState }) => {
  const { match, live, squads } = data;
  const inn = data.innings.find((i) => i.status === "in_progress");
  const [mods, setMods] = useState({ wide: false, noball: false, bye: false, legbye: false });
  const [ran, setRan] = useState(false);
  const [wicket, setWicket] = useState(null); // { kind, playerOutId, fielderId, sub }
  const [text, setText] = useState("");
  const [pick, setPick] = useState("");
  const [pickBowler, setPickBowler] = useState("");
  const { busy, error, run } = useAction();

  const battingSquad = (squads.find((s) => s.team.id === inn.battingTeamId)?.players || []).filter(
    (p) => p.role !== "substitute"
  );
  const fieldingSide = squads.find((s) => s.team.id === inn.bowlingTeamId)?.players || [];
  // substitutes can field but not bowl
  const bowlingSquad = fieldingSide.filter((p) => p.role !== "substitute");
  const striker = live.batters.find((b) => b.onStrike);
  const nonStriker = live.batters.find((b) => !b.onStrike);

  // batters who can still walk in: not out and not already at the crease
  const out = new Set(inn.batting.filter((b) => b.isOut).map((b) => b.id));
  const atCrease = new Set(live.batters.map((b) => b.id));
  const available = battingSquad.filter((p) => !out.has(p.id) && !atCrease.has(p.id));

  const lastOverBowler = live.needsBowler ? live.previousBowler?.id : null;
  const figures = (id) => {
    const b = inn.bowling.find((x) => x.id === id);
    return b ? ` (${b.overs}-${b.maidens}-${b.runs}-${b.wickets})` : "";
  };

  const apply = (res) => {
    if (res?.state) onState(res.state);
    return res;
  };

  const toggleMod = (key) =>
    setMods((m) => {
      const next = { ...m, [key]: !m[key] };
      if (key === "wide" && next.wide) Object.assign(next, { noball: false, bye: false, legbye: false });
      if (key === "noball" && next.noball) next.wide = false;
      if (key === "bye" && next.bye) Object.assign(next, { legbye: false, wide: false });
      if (key === "legbye" && next.legbye) Object.assign(next, { bye: false, wide: false });
      return next;
    });

  const reset = () => {
    setMods({ wide: false, noball: false, bye: false, legbye: false });
    setRan(false);
    setWicket(null);
    setText("");
  };

  const submit = (runs) =>
    run(async () => {
      const body = {};
      if (mods.wide) body.wides = 1 + runs;
      else {
        if (mods.noball) body.noballs = 1;
        if (mods.bye) body.byes = runs;
        else if (mods.legbye) body.legbyes = runs;
        else {
          body.runsBatter = runs;
          body.isBoundary = (runs === 4 || runs === 6) && !ran;
        }
      }
      if (wicket) {
        body.wickets = [
          {
            kind: wicket.kind,
            playerOutId: Number(wicket.playerOutId || striker?.id),
            fielders: wicket.fielderId ? [{ id: Number(wicket.fielderId), isSubstitute: wicket.sub }] : [],
          },
        ];
      }
      if (text.trim()) body.commentary = text.trim();
      const res = apply(await scorer("POST", `/matches/${match.id}/balls`, body));
      if (res) reset();
    });

  const undo = () => run(async () => apply(await scorer("DELETE", `/matches/${match.id}/balls/last`)));
  const swap = () => run(async () => apply(await scorer("PUT", `/matches/${match.id}/crease`, { swap: true })));

  const sendBatter = (onStrike) =>
    run(async () => {
      const id = Number(pick);
      const body = !live.batters.length
        ? onStrike
          ? { strikerId: id }
          : { nonStrikerId: id }
        : striker
          ? { nonStrikerId: id }
          : { strikerId: id };
      const res = apply(await scorer("PUT", `/matches/${match.id}/crease`, body));
      if (res) setPick("");
    });

  const sendBowler = () =>
    run(async () => {
      const res = apply(await scorer("PUT", `/matches/${match.id}/crease`, { bowlerId: Number(pickBowler) }));
      if (res) setPickBowler("");
    });

  const blocked = live.needsBatter || live.needsBowler;

  return (
    <Card $t={t}>
      <Row $justify="space-between" style={{ marginBottom: 12 }}>
        <Heading $t={t} style={{ margin: 0 }}>
          {inn.battingTeam.name} {inn.runs}/{inn.wickets} ({inn.overs}
          {inn.maxOvers ? `/${inn.maxOvers}` : ""} ov)
        </Heading>
        <Chips>
          <Muted $t={t}>This over:</Muted>
          {(live.thisOver?.balls || []).map((b, i) => (
            <BallChip key={i} chip={b.chip} kind={b.kind} t={t} size="sm" />
          ))}
        </Chips>
      </Row>

      <Crease>
        <Slot $t={t} $hot>
          <div className="label">Striker</div>
          <div className="name">{striker ? striker.name : "-"}</div>
          {striker && (
            <Muted $t={t}>
              {striker.runs}({striker.balls})
            </Muted>
          )}
        </Slot>
        <Slot $t={t}>
          <div className="label">Non-striker</div>
          <div className="name">{nonStriker ? nonStriker.name : "-"}</div>
          {nonStriker && (
            <Muted $t={t}>
              {nonStriker.runs}({nonStriker.balls})
            </Muted>
          )}
        </Slot>
        <Slot $t={t}>
          <div className="label">Bowler</div>
          <div className="name">{live.bowler ? live.bowler.name : "-"}</div>
          {live.bowler && (
            <Muted $t={t}>
              {live.bowler.overs}-{live.bowler.maidens}-{live.bowler.runs}-{live.bowler.wickets}
            </Muted>
          )}
        </Slot>
      </Crease>

      {live.needsBatter && (
        <Row $align="flex-end" style={{ marginBottom: 12 }}>
          <Field $t={t} $grow>
            New batter
            <Select $t={t} value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Select…</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {inn.batting.some((b) => b.id === p.id) ? " (resuming)" : ""}
                </option>
              ))}
            </Select>
          </Field>
          {live.batters.length === 0 ? (
            <>
              <Button $t={t} onClick={() => sendBatter(true)} disabled={!pick || busy}>
                On strike
              </Button>
              <Button $t={t} $variant="ghost" onClick={() => sendBatter(false)} disabled={!pick || busy}>
                Non-striker
              </Button>
            </>
          ) : (
            <Button $t={t} onClick={() => sendBatter()} disabled={!pick || busy}>
              Send in ({striker ? "non-striker's end" : "on strike"})
            </Button>
          )}
        </Row>
      )}

      {live.needsBowler && !live.needsBatter && (
        <Row $align="flex-end" style={{ marginBottom: 12 }}>
          <Field $t={t} $grow>
            Bowler for the next over
            <Select $t={t} value={pickBowler} onChange={(e) => setPickBowler(e.target.value)}>
              <option value="">Select…</option>
              {bowlingSquad.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === lastOverBowler}>
                  {p.name}
                  {figures(p.id)}
                  {p.id === lastOverBowler ? " - bowled last over" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Button $t={t} onClick={sendBowler} disabled={!pickBowler || busy}>
            Start over
          </Button>
        </Row>
      )}

      <Row $gap="8px" style={{ marginBottom: 10 }}>
        <Toggle $t={t} $color={t.extra} $on={mods.wide} onClick={() => toggleMod("wide")}>
          Wide
        </Toggle>
        <Toggle $t={t} $color={t.extra} $on={mods.noball} onClick={() => toggleMod("noball")}>
          No ball
        </Toggle>
        <Toggle $t={t} $color={t.extra} $on={mods.bye} onClick={() => toggleMod("bye")}>
          Bye
        </Toggle>
        <Toggle $t={t} $color={t.extra} $on={mods.legbye} onClick={() => toggleMod("legbye")}>
          Leg bye
        </Toggle>
        <Toggle
          $t={t}
          $color={t.wicket}
          $on={!!wicket}
          onClick={() => setWicket((w) => (w ? null : { kind: "bowled", playerOutId: "", fielderId: "", sub: false }))}
        >
          Wicket
        </Toggle>
        <Check $t={t}>
          <input type="checkbox" checked={ran} onChange={(e) => setRan(e.target.checked)} /> 4 / 6 were run (not a boundary)
        </Check>
      </Row>

      {wicket && (
        <Row $align="flex-end" style={{ marginBottom: 10 }}>
          <Field $t={t}>
            How out
            <Select $t={t} value={wicket.kind} onChange={(e) => setWicket((w) => ({ ...w, kind: e.target.value }))}>
              {WICKETS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </Select>
          </Field>
          {EITHER_END.includes(wicket.kind) && (
            <Field $t={t}>
              Who's out
              <Select $t={t} value={wicket.playerOutId} onChange={(e) => setWicket((w) => ({ ...w, playerOutId: e.target.value }))}>
                <option value="">{striker ? `${striker.name} (striker)` : "Striker"}</option>
                {nonStriker && <option value={nonStriker.id}>{nonStriker.name} (non-striker)</option>}
              </Select>
            </Field>
          )}
          {NEEDS_FIELDER.includes(wicket.kind) && (
            <>
              <Field $t={t}>
                {wicket.kind === "stumped" ? "Keeper" : "Fielder"}
                <Select $t={t} value={wicket.fielderId} onChange={(e) => setWicket((w) => ({ ...w, fielderId: e.target.value }))}>
                  <option value="">Select…</option>
                  {fieldingSide.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.role !== "playing" ? " (sub)" : ""}
                    </option>
                  ))}
                </Select>
              </Field>
              <Check $t={t}>
                <input type="checkbox" checked={wicket.sub} onChange={(e) => setWicket((w) => ({ ...w, sub: e.target.checked }))} /> Substitute fielder
              </Check>
            </>
          )}
        </Row>
      )}

      <Muted $t={t}>
        Tap the runs {mods.wide ? "taken in addition to the wide" : mods.bye || mods.legbye ? "run as byes" : "scored"}
        {wicket ? ` - records a wicket (${wicket.kind})` : ""}.
      </Muted>
      <RunGrid style={{ marginTop: 8 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((r) => (
          <RunButton
            key={r}
            $t={t}
            $color={wicket ? t.wicket : r === 4 && !ran && !mods.wide ? t.four : r === 6 && !ran && !mods.wide ? t.six : null}
            disabled={busy || blocked}
            onClick={() => submit(r)}
            title={describe(r, mods, ran)}
          >
            {r}
          </RunButton>
        ))}
      </RunGrid>

      <Row style={{ marginTop: 12 }} $align="flex-end">
        <Field $t={t} $grow>
          Commentary (optional)
          <Input $t={t} value={text} onChange={(e) => setText(e.target.value)} placeholder="Full and straight, driven down the ground…" />
        </Field>
      </Row>

      <ActionError error={error} t={t} />
      <Row style={{ marginTop: 12 }}>
        <Button $t={t} $variant="ghost" onClick={undo} disabled={busy}>
          ↶ Undo last ball
        </Button>
        <Button $t={t} $variant="ghost" onClick={swap} disabled={busy || live.batters.length < 2}>
          ⇄ Swap strike
        </Button>
        <Button $t={t} $variant="ghost" onClick={reset} disabled={busy}>
          Clear selection
        </Button>
      </Row>
    </Card>
  );
};

export default ScoringPad;
