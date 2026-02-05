import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
  },
  dark: {
    cardBg: "#151c2f",
    border: "#24304a",
    textPrimary: "#f5f7fa",
    textSecondary: "#c7d0dd",
    textMuted: "#9aa4b2",
    liveAccent: "#f87171",
    highlight: "#60a5fa",
  },
};

/* ---------- STYLED ---------- */

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px 16px;
  font-family: "Inter", sans-serif;
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
  margin-bottom: 10px;
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
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const ScoreBlock = styled.div`
  text-align: right;
  min-width: 90px;
`;

const Score = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const Overs = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.textMuted};
`;

const Status = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;

/* ---------- COMPONENT ---------- */

const MatchCard = ({ matchData }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;
  const navigate = useNavigate();

  const [score, setScore] = useState(null);

  const isLive = matchData.status === "live";
  const isCompleted = matchData.status === "completed";

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/matches/${matchData.id}/scorecard`
        );
        const data = await res.json();
        setScore(data.innings?.[0] || null);
      } catch {
        setScore(null);
      }
    };

    if (isLive || isCompleted) fetchScore();
  }, [matchData.id, isLive, isCompleted]);

  return (
    <Card
      theme={theme}
      isLive={isLive}
      onClick={() => navigate(`/match/${matchData.id}`)}
    >
      <Header>
        <MatchType theme={theme}>{matchData.format}</MatchType>
        {isLive && <Live theme={theme}>LIVE</Live>}
      </Header>

      {[matchData.team1, matchData.team2].map((team) => {
        const isBatting =
          score && score.batting_team === team.name;

        return (
          <TeamRow key={team.code}>
            <TeamLeft>
              <Badge theme={theme}>{team.code}</Badge>
              <TeamName theme={theme}>{team.name}</TeamName>
            </TeamLeft>

            <ScoreBlock>
              {isBatting && score ? (
                <>
                  <Score theme={theme}>
                    {score.total_runs}/{score.wickets}
                  </Score>
                  <Overs theme={theme}>{score.overs} ov</Overs>
                </>
              ) : isCompleted && score ? (
                <Score theme={theme}>Did not bat</Score>
              ) : (
                <Overs theme={theme}>
                  {isLive ? "Yet to bat" : "Match not started"}
                </Overs>
              )}
            </ScoreBlock>
          </TeamRow>
        );
      })}

      <Status theme={theme}>{matchData.result || " "}</Status>
    </Card>
  );
};

export default MatchCard;
