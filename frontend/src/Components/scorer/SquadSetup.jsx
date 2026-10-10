import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { apiGet, scorer } from "../../api";
import { Card, Heading, Muted, Row } from "../match/ui";
import { ActionError, Button, Input } from "./Form";
import { useAction } from "../../hooks/useAction";
import { PlayerPhoto } from "../../ui/players";
import { roleLabel } from "../../ui/playerStats";

const List = styled.div`
  display: grid;
  gap: 6px;
  margin: 10px 0;
`;

const PlayerLine = styled.div`
  display: grid;
  grid-template-columns: 22px 30px 1fr auto auto auto;
  gap: 10px;
  align-items: center;
  padding: 6px 8px;
  border-radius: 10px;
  background: ${({ $t }) => $t.cardAlt};
  font-size: 0.9rem;

  .sub {
    font-size: 0.72rem;
    color: var(--muted);
  }
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

const Picker = styled.div`
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px;
  margin: 10px 0 4px;
  background: var(--hover);
`;

const Results = styled.div`
  display: grid;
  gap: 2px;
  max-height: 290px;
  overflow-y: auto;
  margin-top: 8px;
`;

const Result = styled.button`
  display: grid;
  grid-template-columns: 30px 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  text-align: left;
  border: 0;
  border-radius: 10px;
  padding: 6px 8px;
  background: ${({ $first }) => ($first ? "var(--accent-soft)" : "transparent")};
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: var(--accent-soft);
    }
  }
  .sub {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--muted);
  }
  .act {
    font-size: 0.74rem;
    font-weight: 700;
    color: var(--accent);
  }
`;

const Scope = styled.div`
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px;
  flex: none;

  button {
    border: 0;
    border-radius: 999px;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
    font-weight: 650;
    cursor: pointer;
    background: transparent;
    color: var(--text-2);
  }
  button[aria-pressed="true"] {
    background: var(--accent);
    color: var(--accent-ink);
  }
`;

// Every player, fetched once and shared by both sides' pickers.
let allPlayers = null;
const loadAllPlayers = () => {
  allPlayers ||= apiGet("/players")
    .then((d) => d.players || [])
    .catch(() => {
      allPlayers = null; // try again next time
      return [];
    });
  return allPlayers;
};

const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const PlayerSearch = ({ team, squad, picked, onAdd, t }) => {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(squad.length ? "squad" : "all");
  const [everyone, setEveryone] = useState(null);

  useEffect(() => {
    if (scope === "all" && !everyone) loadAllPlayers().then(setEveryone);
  }, [scope, everyone]);

  const q = normalize(query);
  const results = useMemo(() => {
    const pool = scope === "squad" ? squad : everyone || [];
    const hits = pool.filter((p) => !q || normalize(p.name).includes(q) || normalize(p.country).includes(q));
    // the team's own players and name-starts-with matches first
    const rank = (p) => (normalize(p.name).startsWith(q) ? 0 : 1) + (p.country === team.name ? 0 : 2);
    return (scope === "all" && !q ? [] : hits).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)).slice(0, 60);
  }, [scope, squad, everyone, q, team.name]);

  const isPicked = (p) => picked.has(normalize(p.name));
  const firstFree = results.find((p) => !isPicked(p));
  const exact = results.some((p) => normalize(p.name) === q);
  const typed = query
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const add = (p) => {
    onAdd([p]);
    setQuery("");
  };
  const addTyped = () => {
    onAdd(typed.map((name) => ({ name })));
    setQuery("");
  };

  return (
    <Picker>
      <Row $gap="8px" $align="center">
        <Input
          $t={t}
          style={{ flex: 1, minWidth: 200 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            if (firstFree) add(firstFree);
            else if (typed.length) addTyped();
          }}
          placeholder={scope === "squad" ? `Search the ${team.name} squad` : "Search every player"}
          aria-label={`Find a player for ${team.name}`}
        />
        <Scope role="group" aria-label="Search in">
          <button type="button" aria-pressed={scope === "squad"} disabled={!squad.length} onClick={() => setScope("squad")}>
            Squad ({squad.length})
          </button>
          <button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")}>
            All players
          </button>
        </Scope>
      </Row>

      <Results>
        {results.map((p) => (
          <Result key={p.id} type="button" disabled={isPicked(p)} $first={p === firstFree && !!q} onClick={() => add(p)}>
            <PlayerPhoto src={p.image_url} name={p.name} size={30} />
            <span style={{ minWidth: 0 }}>
              {p.name}
              <div className="sub">{[roleLabel(p), p.country].filter(Boolean).join(" · ")}</div>
            </span>
            <span className="act">{isPicked(p) ? "Added" : "+ Add"}</span>
          </Result>
        ))}
        {scope === "all" && !q && <Muted $t={t}>Type a name to search {everyone ? everyone.length : ""} players.</Muted>}
        {scope === "all" && q && !everyone && <Muted $t={t}>Loading players…</Muted>}
        {/* a new name: offered when nothing matches, or it looks like a full name */}
        {typed.length > 0 && !exact && (!results.length || /[\s,]/.test(query.trim())) && (
          <Result type="button" onClick={addTyped}>
            <span />
            <span>
              Add {typed.length > 1 ? `${typed.length} new players` : `“${typed[0]}” as a new player`}
              <div className="sub">Not in the player list; separate several names with commas</div>
            </span>
            <span className="act">+ Add</span>
          </Result>
        )}
      </Results>
    </Picker>
  );
};

// One team's playing XI: search the squad (or everyone), mark captain & keeper, set the order.
const TeamXI = ({ matchId, team, squad, existing, t, onSaved }) => {
  const [players, setPlayers] = useState(() =>
    existing.map((p) => {
      const known = squad.find((s) => s.id === p.profileId);
      return { name: p.name, playerId: p.profileId, isCaptain: p.isCaptain, isKeeper: p.isKeeper, image: known?.image_url, role: known && roleLabel(known) };
    })
  );
  const { busy, error, run } = useAction();

  const picked = useMemo(() => new Set(players.map((p) => normalize(p.name))), [players]);

  const add = (list) =>
    setPlayers((ps) => {
      const seen = new Set(ps.map((p) => normalize(p.name)));
      const fresh = list.filter((p) => !seen.has(normalize(p.name)) && seen.add(normalize(p.name)));
      return [
        ...ps,
        ...fresh.map((p) => ({
          name: p.name,
          playerId: p.id || null,
          isCaptain: false,
          isKeeper: false,
          image: p.image_url,
          role: p.id ? roleLabel(p) : "New player",
        })),
      ];
    });

  const remove = (name) => setPlayers((ps) => ps.filter((p) => p.name !== name));

  const flag = (name, key) =>
    setPlayers((ps) =>
      ps.map((p) => ({
        ...p,
        // only one captain / keeper per side
        [key]: p.name === name ? !p[key] : false,
      }))
    );

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
        players: players.map(({ name, playerId, isCaptain, isKeeper }) => ({ name, playerId, isCaptain, isKeeper })),
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

      <PlayerSearch team={team} squad={squad} picked={picked} onAdd={add} t={t} />

      <List>
        {players.map((p, i) => (
          <PlayerLine key={p.name} $t={t}>
            <Muted $t={t}>{i + 1}.</Muted>
            <PlayerPhoto src={p.image} name={p.name} size={30} />
            <span style={{ minWidth: 0 }}>
              {p.name}
              {p.role && <div className="sub">{p.role}</div>}
            </span>
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
            <Small $t={t} onClick={() => remove(p.name)} title="Remove">
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
