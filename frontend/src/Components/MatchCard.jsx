import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

/* ---------- THEME ---------- */

const colors = {
  light: {
    cardBg: "#ffffff",
    border: "#e5e7eb",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    liveAccent: "#dc2626",
    highlight: "#2563eb",
    winner: "#16a34a",
  },
  dark: {
    cardBg: "#151c2f",
    border: "#24304a",
    textPrimary: "#f5f7fa",
    textSecondary: "#c7d0dd",
    textMuted: "#9aa4b2",
    liveAccent: "#f87171",
    highlight: "#60a5fa",
    winner: "#22c55e",
  },
};

/* ---------- ANIMATIONS ---------- */

const pulse = keyframes`
  0% { opacity: 1 }
  50% { opacity: 0.55 }
  100% { opacity: 1 }
`;

/* ---------- STYLED ---------- */

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;

  ${({ isLive, theme }) =>
    isLive &&
    `
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${theme.liveAccent};
    }
  `}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MatchType = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
  text-transform: uppercase;
`;

const Live = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.liveAccent};
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  opacity: ${({ muted }) => (muted ? 0.55 : 1)};
`;

const TeamLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Badge = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: ${({ winner }) => (winner ? 800 : 600)};
  color: ${({ theme, winner }) =>
    winner ? theme.winner : theme.textPrimary};
`;

const ScoreBlock = styled.div`
  text-align: right;
  min-width: 110px;
`;

const Score = styled.div`
  font-size: 15px;
  font-weight: 700;
  animation: ${({ live }) => (live ? pulse : "none")} 1.4s infinite;
`;

const Overs = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
`;

const Meta = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  justify-content: space-between;
`;

const Status = styled.div`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.textSecondary};
`;

/* ---------- COMPONENT ---------- */

const MatchCard = ({ matchData }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;
  const navigate = useNavigate();

  const [innings, setInnings] = useState([]);

  const isLive = matchData.status === "live";
  const isCompleted = matchData.status === "completed";

  useEffect(() => {
    const fetchScore = async () => {
      const res = await fetch(
        `http://localhost:8000/api/matches/${matchData.id}/scorecard`
      );
      const data = await res.json();
      setInnings(data.innings || []);
    };

    if (isLive || isCompleted) fetchScore();
  }, [matchData.id, isLive, isCompleted]);

  /* ---------- DERIVED LOGIC ---------- */

  let winner = null;
  let resultText = "";
  let target = null;
  let rrr = null;

  if (innings.length >= 1) {
    const first = innings[0];
    target = Number(first.total_runs) + 1;
  }

  if (innings.length === 2) {
    const [inn1, inn2] = innings;
    const r1 = Number(inn1.total_runs);
    const r2 = Number(inn2.total_runs);

    if (r2 > r1) {
      winner = inn2.batting_team;
      resultText = `${winner} won by ${10 - inn2.wickets} wickets`;
    } else if (r1 > r2 && isCompleted) {
      winner = inn1.batting_team;
      resultText = `${winner} won by ${r1 - r2} runs`;
    }

    // RRR (only if live)
    if (isLive) {
      const ballsLeft = 6 * 6 - Math.ceil(Number(inn2.overs) * 6);
      const runsLeft = target - r2;
      rrr =
        ballsLeft > 0
          ? ((runsLeft * 6) / ballsLeft).toFixed(2)
          : null;
    }
  }

  return (
    <Card
      theme={theme}
      isLive={isLive}
      onClick={() =>
        navigate(`/match/${matchData.id}?scroll=latest`)
      }
    >
      <Header>
        <MatchType theme={theme}>
          Match {matchData.match_number || 1} • {matchData.format}
        </MatchType>
        {isLive && <Live theme={theme}>LIVE</Live>}
      </Header>

      {[matchData.team1, matchData.team2].map((team) => {
        const teamInn = innings.find(
          (i) => i.batting_team === team.name
        );

        return (
          <TeamRow
            key={team.code}
            muted={winner && winner !== team.name}
          >
            <TeamLeft>
              <Badge theme={theme}>{team.code}</Badge>
              <TeamName
                theme={theme}
                winner={winner === team.name}
              >
                {team.name}
              </TeamName>
            </TeamLeft>

            <ScoreBlock>
              {teamInn ? (
                <>
                  <Score live={isLive && innings[innings.length - 1] === teamInn}>
                    {teamInn.total_runs}/{teamInn.wickets}
                  </Score>
                  <Overs>{teamInn.overs} ov</Overs>
                </>
              ) : (
                <Overs>
                  {isLive ? "Yet to bat" : "Match not started"}
                </Overs>
              )}
            </ScoreBlock>
          </TeamRow>
        );
      })}

      <Meta theme={theme}>
        {isLive && target && (
          <span>Target {target}</span>
        )}
        {isLive && rrr && (
          <span>RRR {rrr}</span>
        )}
      </Meta>

      <Status theme={theme}>
        {resultText || matchData.result || " "}
      </Status>
    </Card>
  );
};

export default MatchCard;
