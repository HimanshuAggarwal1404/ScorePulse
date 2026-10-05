import React, { useState } from "react";
import styled from "styled-components";
import { formatDate } from "./theme";
import { BallChip, Card, Chips, Heading, Muted, Pill, PlayerName, Row } from "./ui";

/* ---------------- OVERS ---------------- */

const OverRow = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  font-size: 0.88rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 56px 1fr;
    .score {
      grid-column: 2;
    }
  }
`;

export const OversTab = ({ data, t }) => {
  const [n, setN] = useState(data.innings[data.innings.length - 1]?.number);
  const inn = data.innings.find((i) => i.number === n);
  if (!inn) {
    return (
      <Card $t={t}>
        <Muted $t={t}>No overs bowled yet.</Muted>
      </Card>
    );
  }
  return (
    <Card $t={t}>
      <Row style={{ marginBottom: 10 }}>
        {data.innings.map((i) => (
          <Pill key={i.number} $t={t} $active={i.number === n} onClick={() => setN(i.number)}>
            {i.battingTeam.short} {i.isSuperOver ? "SO" : `Inns ${i.number}`}
          </Pill>
        ))}
      </Row>
      {[...inn.overSummaries].reverse().map((o) => (
        <OverRow key={o.over} $t={t}>
          <div>
            <b>Ov {o.over}</b>
            <div>
              <Muted $t={t} $size="0.78rem">
                {o.runs} run{o.runs === 1 ? "" : "s"}
              </Muted>
            </div>
          </div>
          <div>
            <Muted $t={t} $size="0.8rem">
              {o.bowlers.join(" / ")}
            </Muted>
            <Chips style={{ marginTop: 4 }}>
              {o.balls.map((b, i) => (
                <BallChip key={i} chip={b.chip} kind={b.kind} t={t} size="sm" />
              ))}
            </Chips>
          </div>
          <div className="score" style={{ fontWeight: 700, textAlign: "right" }}>
            {inn.battingTeam.short} {o.score}
          </div>
        </OverRow>
      ))}
    </Card>
  );
};

/* ---------------- SQUADS ---------------- */

const SquadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerRow = styled.div`
  padding: 9px 0;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`;

export const SquadsTab = ({ data, t }) => (
  <SquadGrid>
    {data.squads.map((s) => {
      const xi = s.players.filter((p) => p.role === "playing");
      const others = s.players.filter((p) => p.role !== "playing");
      return (
        <Card key={s.team.id} $t={t}>
          <Heading $t={t}>{s.team.name}</Heading>
          {!s.players.length && <Muted $t={t}>Playing XI not announced yet.</Muted>}
          {xi.map((p) => (
            <PlayerRow key={p.id} $t={t}>
              <PlayerName player={p} t={t} />
            </PlayerRow>
          ))}
          {others.length > 0 && (
            <>
              <Heading $t={t} style={{ marginTop: 16 }}>
                Substitutes / replacements
              </Heading>
              {others.map((p) => (
                <PlayerRow key={p.id} $t={t}>
                  <PlayerName player={p} t={t} /> <Muted $t={t}>({p.role})</Muted>
                </PlayerRow>
              ))}
            </>
          )}
        </Card>
      );
    })}
  </SquadGrid>
);

/* ---------------- INFO ---------------- */

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoTab = ({ data, t }) => {
  const m = data.match;
  const rows = [
    ["Match", `${m.team1.name} vs ${m.team2.name}${m.title ? `, ${m.title}` : ""}`],
    ["Series", m.series],
    ["Format", m.formatLabel + (m.rules.oversPerInnings ? ` (${m.rules.oversPerInnings} overs a side)` : ` (${m.days} days)`)],
    ["Date", formatDate(m.startTime || m.startDate, !!m.startTime)],
    ["Toss", m.toss?.text],
    ["Venue", m.venue ? [m.venue.name, m.venue.city].filter(Boolean).join(", ") : null],
    ["Umpires", m.officials.umpires.join(", ")],
    ["Third umpire", m.officials.tvUmpire],
    ["Match referee", m.officials.matchReferee],
    ["Result", m.result?.text],
    ["Player of the match", m.playerOfMatch ? <PlayerName player={m.playerOfMatch} t={t} /> : null],
    ["Season", m.season],
  ].filter(([, v]) => v);

  return (
    <Card $t={t}>
      {rows.map(([k, v]) => (
        <InfoRow key={k} $t={t}>
          <Muted $t={t}>{k}</Muted>
          <span>{v}</span>
        </InfoRow>
      ))}
    </Card>
  );
};
