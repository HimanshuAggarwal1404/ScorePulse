import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { glass, pressable } from "../ui/styles";
import { PlayerPhoto, TeamMono } from "../ui/players";
import { fmtNum, headlineStats, roleLabel, teamColor } from "../ui/playerStats";

const Card = styled(Link)`
  ${glass}
  ${pressable}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1rem 1rem 0.9rem;
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;
  overflow: hidden;

  /* a wash of the player's country colour behind the photo */
  &::before {
    content: "";
    position: absolute;
    inset: -40% auto auto -20%;
    width: 70%;
    height: 120%;
    background: radial-gradient(closest-side, ${({ $color }) => `color-mix(in srgb, ${$color} 16%, transparent)`}, transparent);
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover {
      border-color: ${({ $color }) => `color-mix(in srgb, ${$color} 45%, transparent)`};
    }
  }
`;

const Top = styled.div`
  position: relative;
  display: flex;
  gap: 0.85rem;
  align-items: center;
  min-width: 0;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.015em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badges = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  gap: 4px;
`;

const Rank = styled.span`
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 0.18rem 0.45rem;
  border-radius: var(--radius-pill);
  color: var(--accent-ink);
  background: linear-gradient(140deg, var(--accent), var(--accent-2));
`;

const Stats = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;

  div + div {
    border-left: 1px solid var(--border);
    padding-left: 0.75rem;
  }
  b {
    display: block;
    font-family: var(--font-display);
    font-size: 1.12rem;
    font-weight: 750;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  small {
    font-size: 0.66rem;
    font-weight: 650;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
`;

// teamsById: { [id]: { short_code, type } } for the country colour and franchise badge.
// ipl: headline IPL figures instead of international ones (franchise views).
const PlayerCard = ({ player, teamsById = {}, rank, ipl = false }) => {
  const code = teamsById[player.country_team_id]?.short_code;
  const franchises = (player.team_ids || []).map((id) => teamsById[id]).filter((t) => t?.type === "franchise");
  return (
    <Card to={`/players/${player.id}`} $color={teamColor(code)}>
      <Badges>
        {rank && <Rank title={`ICC ${rank.label} ranking`}>#{rank.rank}</Rank>}
        {franchises.map((t) => (
          <TeamMono key={t.short_code} $code={t.short_code} $size="1.6rem" $small title={t.name}>
            {t.short_code}
          </TeamMono>
        ))}
      </Badges>
      <Top>
        <PlayerPhoto src={player.image_url} name={player.name} code={code} size={58} />
        <div style={{ minWidth: 0, paddingRight: franchises.length || rank ? "3rem" : 0 }}>
          <Name>{player.name}</Name>
          <Meta>{[player.country, roleLabel(player)].filter(Boolean).join(" · ")}</Meta>
          {(player.batting_style || player.bowling_style) && (
            <Meta>{[player.batting_style, player.bowling_style].filter(Boolean).join(" · ")}</Meta>
          )}
        </div>
      </Top>
      <Stats>
        {headlineStats(player, { ipl }).map((s) => (
          <div key={s.label}>
            <b>{fmtNum(s.value)}</b>
            <small>{s.label}</small>
          </div>
        ))}
      </Stats>
    </Card>
  );
};

export default PlayerCard;
