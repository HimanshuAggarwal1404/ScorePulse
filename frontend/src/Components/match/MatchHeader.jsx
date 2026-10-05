import React from "react";
import styled from "styled-components";
import { LIVE_STATES, formatDate, scoreText } from "./theme";
import { LiveDot } from "./ui";
import { glass } from "../../ui/styles";

const Wrap = styled.header`
  ${glass}
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.5rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow-lg);

  /* a faint neon wash behind the scoreboard */
  &::before {
    content: "";
    position: absolute;
    inset: -40% -10% auto auto;
    width: 60%;
    height: 140%;
    background: radial-gradient(closest-side, var(--accent-soft), transparent);
    pointer-events: none;
  }

  @media (max-width: 600px) {
    padding: 1.15rem 1rem 1rem;
  }
`;

const Meta = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.6rem;
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 0.6rem;

  span + span::before {
    content: "·";
    margin-right: 0.6rem;
    opacity: 0.6;
  }
`;

const Format = styled.b`
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.04em;
`;

const Title = styled.h1`
  position: relative;
  font-size: clamp(1.3rem, 2.6vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.022em;
  margin-bottom: 1.1rem;

  small {
    font-size: 0.7em;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: -0.01em;
  }
`;

const Teams = styled.div`
  position: relative;
  display: grid;
  gap: 0.5rem;
`;

const TeamLine = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius);
  background: ${({ $batting }) => ($batting ? "var(--accent-soft)" : "var(--hover)")};
  border: 1px solid ${({ $batting }) => ($batting ? "var(--accent-line)" : "var(--border)")};
  opacity: ${({ $dim }) => ($dim ? 0.62 : 1)};
  transition: background-color var(--settle) var(--ease), border-color var(--settle) var(--ease),
    opacity var(--settle) var(--ease);
`;

const Mono = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: ${({ $batting }) => ($batting ? "var(--accent-ink)" : "var(--text)")};
  background: ${({ $batting }) => ($batting ? "var(--accent)" : "var(--solid-2)")};
  box-shadow: ${({ $batting }) => ($batting ? "var(--glow)" : "inset 0 1px 0 var(--glass-highlight)")};
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: -0.012em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Score = styled.div`
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 3vw, 1.85rem);
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;

  small {
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0;
    color: var(--muted);
    margin-left: 0.4rem;
  }
  .amp {
    color: var(--muted);
    font-weight: 500;
    margin: 0 0.3rem;
  }
`;

const Status = styled.div`
  position: relative;
  margin-top: 1rem;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.005em;
  color: ${({ $kind }) => ($kind === "live" ? "var(--live)" : $kind === "done" ? "var(--accent)" : "var(--extra)")};
`;

const Stats = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
`;

const Stat = styled.div`
  padding: 0.45rem 0.75rem;
  border-radius: 12px;
  background: var(--solid-2);
  border: 1px solid var(--border);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);

  b {
    display: block;
    margin-top: 2px;
    font-size: 1rem;
    letter-spacing: -0.01em;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--live);
  background: var(--live-soft);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
`;

const inningsLine = (innings) =>
  innings.map((i, idx) => (
    <React.Fragment key={i.id}>
      {idx > 0 && <span className="amp">&amp;</span>}
      {scoreText(i)}
      {(i.status === "in_progress" || innings.length === 1) && (
        <small>
          {i.overs}
          {i.maxOvers && i.status === "in_progress" ? `/${i.maxOvers}` : ""} ov
        </small>
      )}
    </React.Fragment>
  ));

const MatchHeader = ({ data }) => {
  const { match, innings, live } = data;
  const isLive = LIVE_STATES.includes(match.status);
  const regular = innings.filter((i) => !i.isSuperOver);
  const superOvers = innings.filter((i) => i.isSuperOver);
  const battingTeamId = innings.find((i) => i.status === "in_progress")?.battingTeamId;

  const team = (side) => {
    const own = regular.filter((i) => i.battingTeamId === side.id);
    const batting = battingTeamId === side.id;
    const lost = match.result?.winnerId && match.result.winnerId !== side.id;
    return (
      <TeamLine key={side.id} $batting={batting} $dim={(isLive && battingTeamId && !batting) || lost}>
        <Mono $batting={batting}>{side.short}</Mono>
        <Name>
          <span>{side.name}</span>
          {batting && <LiveDot title="Batting" />}
        </Name>
        <Score>
          {own.length ? inningsLine(own) : <small>{isLive ? "Yet to bat" : ""}</small>}
        </Score>
      </TeamLine>
    );
  };

  const kind = isLive ? "live" : match.status === "completed" ? "done" : "upcoming";

  return (
    <Wrap>
      <Meta>
        {isLive && (
          <LiveBadge>
            <LiveDot />
            LIVE
          </LiveBadge>
        )}
        <Format>{match.formatLabel}</Format>
        {match.series && <span>{match.series}</span>}
        {match.venue && <span>{match.venue.name}</span>}
        <span>{formatDate(match.startTime || match.startDate, !!match.startTime)}</span>
      </Meta>
      <Title>
        {match.team1.name} vs {match.team2.name}
        {match.title ? <small>, {match.title}</small> : null}
      </Title>

      <Teams>
        {team(match.team1)}
        {team(match.team2)}
      </Teams>

      {superOvers.length > 0 && (
        <Status $kind="upcoming" as="div" style={{ fontSize: "0.85rem" }}>
          Super Over: {superOvers.map((s) => `${s.battingTeam.short} ${s.runs}/${s.wickets}`).join(" · ")}
        </Status>
      )}

      {match.statusText && <Status $kind={kind}>{match.statusText}</Status>}

      {live && (
        <Stats>
          <Stat>
            CRR<b>{live.crr.toFixed(2)}</b>
          </Stat>
          {live.rrr != null && (
            <Stat>
              Req. rate<b>{live.rrr.toFixed(2)}</b>
            </Stat>
          )}
          {live.target && (
            <Stat>
              Target<b>{live.target}</b>
            </Stat>
          )}
          {live.partnership && (
            <Stat>
              Partnership
              <b>
                {live.partnership.runs} ({live.partnership.balls})
              </b>
            </Stat>
          )}
        </Stats>
      )}
    </Wrap>
  );
};

export default MatchHeader;
