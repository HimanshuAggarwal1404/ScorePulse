import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { scoreText } from "./match/theme";
import { LiveDot } from "./match/ui";
import { glass, pressable } from "../ui/styles";

const Card = styled(Link)`
  ${glass}
  ${pressable}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  height: 100%;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;
  overflow: hidden;

  /* live matches carry a thin neon edge */
  ${({ $live }) =>
    $live &&
    `
    border-color: var(--accent-line);
    &::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
    }
  `}

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
    }
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.74rem;
  color: var(--muted);
`;

const Meta = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
`;

const Live = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--live);
`;

const TeamRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6rem;
  opacity: ${({ $dim }) => ($dim ? 0.6 : 1)};
`;

const Mono = styled.span`
  min-width: 2.2rem;
  height: 1.6rem;
  padding: 0 0.35rem;
  display: grid;
  place-items: center;
  border-radius: 8px;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  background: ${({ $on }) => ($on ? "var(--accent)" : "var(--solid-2)")};
  color: ${({ $on }) => ($on ? "var(--accent-ink)" : "var(--text-2)")};
`;

const TeamName = styled.span`
  font-weight: ${({ $strong }) => ($strong ? 700 : 600)};
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Score = styled.span`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  small {
    font-family: var(--font);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0;
    margin-left: 0.3rem;
    color: var(--muted);
  }
`;

const Status = styled.div`
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  font-weight: 650;
  color: ${({ $live }) => ($live ? "var(--live)" : "var(--accent)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const scoreFor = (side) =>
  side.innings.length
    ? side.innings.map((i, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && " & "}
          {scoreText(i)}
          {side.innings.length === 1 && <small>{i.overs} ov</small>}
        </React.Fragment>
      ))
    : null;

const MatchCard = ({ matchData: m }) => {
  if (!m) return null;
  const batting = [m.team1, m.team2].find((s) => s.innings.some((i) => i.batting));

  return (
    <Card to={`/match/${m.id}`} $live={m.isLive}>
      <Top>
        <Meta>
          {[m.title, m.title?.includes(m.formatLabel) ? null : m.formatLabel, m.venue?.city || m.venue?.name]
            .filter(Boolean)
            .join(" · ")}
        </Meta>
        {m.isLive && (
          <Live>
            <LiveDot />
            LIVE
          </Live>
        )}
      </Top>
      {[m.team1, m.team2].map((side) => {
        const strong = m.winnerId === side.id || batting?.id === side.id;
        return (
          <TeamRow key={side.id} $dim={(m.winnerId && m.winnerId !== side.id) || (batting && batting.id !== side.id)}>
            <Mono $on={batting?.id === side.id}>{side.short}</Mono>
            <TeamName $strong={strong}>{side.name}</TeamName>
            <Score>{scoreFor(side)}</Score>
          </TeamRow>
        );
      })}
      <Status $live={m.isLive}>{m.statusText}</Status>
    </Card>
  );
};

export default MatchCard;
