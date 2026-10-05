import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { scorer } from "../../api";
import { Card, Heading, Muted, Row } from "../match/ui";
import { ActionError, Button, Field, TextArea } from "./Form";
import { useAction } from "../../hooks/useAction";

const List = styled.div`
  display: grid;
  gap: 6px;
  margin: 10px 0;
`;

const PlayerLine = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr auto auto auto;
  gap: 10px;
  align-items: center;
  padding: 6px 8px;
  border-radius: 8px;
  background: ${({ $t }) => $t.cardAlt};
  font-size: 0.9rem;
`;

const Small = styled.button`
  border: 1px solid ${({ $t, $on }) => ($on ? $t.accent : $t.border)};
  background: ${({ $t, $on }) => ($on ? $t.accentSoft : "transparent")};
  color: ${({ $t, $on }) => ($on ? $t.accent : $t.muted)};
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 7px;
  cursor: pointer;
`;

// One team's playing XI: tick squad players and/or type names, mark captain & keeper.
const TeamXI = ({ matchId, team, squad, existing, t, onSaved }) => {
  const initial = existing.length
    ? existing.map((p) => ({ name: p.name, isCaptain: p.isCaptain, isKeeper: p.isKeeper }))
    : [];
  const [players, setPlayers] = useState(initial);
  const [extra, setExtra] = useState("");
  const { busy, error, run } = useAction();

  const picked = useMemo(() => new Set(players.map((p) => p.name.toLowerCase())), [players]);

  const toggle = (name) =>
    setPlayers((ps) =>
      picked.has(name.toLowerCase())
        ? ps.filter((p) => p.name.toLowerCase() !== name.toLowerCase())
        : [...ps, { name, isCaptain: false, isKeeper: false }]
    );

  const flag = (name, key) =>
    setPlayers((ps) =>
      ps.map((p) => ({
        ...p,
        // only one captain / keeper per side
        [key]: p.name === name ? !p[key] : false,
      }))
    );

  const addTyped = () => {
    const names = extra
      .split(/\n|,/)
      .map((n) => n.trim())
      .filter((n) => n && !picked.has(n.toLowerCase()));
    setPlayers((ps) => [...ps, ...names.map((name) => ({ name, isCaptain: false, isKeeper: false }))]);
    setExtra("");
  };

  const move = (i, dir) =>
    setPlayers((ps) => {
      const next = [...ps];
      const j = i + dir;
      if (j < 0 || j >= next.length) return ps;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = () =>
    run(async () => {
      await scorer("PUT", `/matches/${matchId}/squads/${team.id}`, {
        players: players.map((p) => {
          const fromSquad = squad.find((s) => s.name.toLowerCase() === p.name.toLowerCase());
          return { ...p, playerId: fromSquad?.id };
        }),
      });
      onSaved();
    });

  return (
    <Card $t={t}>
      <Row $justify="space-between">
        <Heading $t={t} style={{ margin: 0 }}>
          {team.name} - playing XI
        </Heading>
        <Muted $t={t}>{players.length} selected</Muted>
      </Row>

      {squad.length > 0 && (
        <>
          <Muted $t={t}>Squad</Muted>
          <Row $gap="6px" style={{ margin: "6px 0 10px" }}>
            {squad.map((s) => (
              <Small key={s.id} $t={t} $on={picked.has(s.name.toLowerCase())} onClick={() => toggle(s.name)}>
                {s.name}
              </Small>
            ))}
          </Row>
        </>
      )}

      <Row $align="flex-end">
        <Field $t={t} $grow>
          Add players (one per line or comma separated)
          <TextArea $t={t} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={"Rohit Sharma\nVirat Kohli"} />
        </Field>
        <Button $t={t} $variant="ghost" onClick={addTyped} disabled={!extra.trim()}>
          Add
        </Button>
      </Row>

      <List>
        {players.map((p, i) => (
          <PlayerLine key={p.name} $t={t}>
            <Muted $t={t}>{i + 1}.</Muted>
            <span>{p.name}</span>
            <Row $gap="4px">
              <Small $t={t} onClick={() => move(i, -1)} title="Move up">
                ↑
              </Small>
              <Small $t={t} onClick={() => move(i, 1)} title="Move down">
                ↓
              </Small>
            </Row>
            <Row $gap="4px">
              <Small $t={t} $on={p.isCaptain} onClick={() => flag(p.name, "isCaptain")}>
                C
              </Small>
              <Small $t={t} $on={p.isKeeper} onClick={() => flag(p.name, "isKeeper")}>
                WK
              </Small>
            </Row>
            <Small $t={t} onClick={() => toggle(p.name)} title="Remove">
              ✕
            </Small>
          </PlayerLine>
        ))}
      </List>

      <ActionError error={error} t={t} onKeySaved={save} />
      <Row>
        <Button $t={t} onClick={save} disabled={busy || players.length < 2}>
          {busy ? "Saving…" : existing.length ? "Update XI" : "Save XI"}
        </Button>
        {players.length !== 11 && <Muted $t={t}>A full side is 11 players.</Muted>}
      </Row>
    </Card>
  );
};

const SquadSetup = ({ data, teams, t, onSaved }) => (
  <>
    {data.squads.map((s) => (
      <TeamXI
        key={s.team.id}
        matchId={data.match.id}
        team={s.team}
        squad={teams.find((x) => x.id === s.team.id)?.squad || []}
        existing={s.players.filter((p) => p.role === "playing")}
        t={t}
        onSaved={onSaved}
      />
    ))}
    <Muted $t={t}>The list order is the batting order shown on the scorecard; you can still pick any batter when they walk in.</Muted>
  </>
);

export default SquadSetup;
