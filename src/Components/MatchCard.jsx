import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME ---------- */

const colors = {
  light: {
    cardBg: "#ffffff",
    border: "#e5e7eb",
    liveAccent: "#dc2626",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    highlight: "#2563eb",
  },
  dark: {
    cardBg: "#151c2f",
    border: "#24304a",
    liveAccent: "#f87171",
    textPrimary: "#f5f7fa",
    textSecondary: "#c7d0dd",
    textMuted: "#9aa4b2",
    highlight: "#60a5fa",
  },
};

/* ---------- STYLED ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-left: ${({ isLive, theme }) =>
    isLive ? `4px solid ${theme.liveAccent}` : `1px solid ${theme.border}`};
  border-radius: 14px;
  padding: 14px 16px;
  font-family: "Inter", sans-serif;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MatchType = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondary};
`;

const Live = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.liveAccent};
`;

/* ---------- TEAM ROW ---------- */

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const TeamLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Badge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  max-width: 150px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    max-width: 100%;
    font-size: 15px;
  }
`;

const Batting = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.highlight};

  @media (max-width: 640px) {
    display: none;
  }
`;

const ScoreBlock = styled.div`
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
    margin-left: 38px; /* aligns under team name */
  }
`;

const Score = styled.div`
  font-size: ${({ isLive }) => (isLive ? "17px" : "15px")};
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};

  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

const Overs = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

/* ---------- STATUS ---------- */

const Status = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};

  @media (max-width: 640px) {
    font-size: 12px;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/* ---------- COMPONENT ---------- */

const MatchCard = ({ matchData }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const { team1, team2, status, live, type } = matchData;
  const statusText = status?.toLowerCase() || "";

  const isCompleted =
    statusText.includes("won") ||
    statusText.includes("draw") ||
    statusText.includes("tie");

  const isLive = live && !isCompleted;

  const battingTeam =
    isLive && statusText.includes("need") ? team2 : null;

  const teams = battingTeam
    ? [battingTeam, battingTeam === team1 ? team2 : team1]
    : [team1, team2];

  return (
    <Card theme={theme} isLive={isLive}>
      <Header>
        <MatchType theme={theme}>{type}</MatchType>
        {isLive && <Live theme={theme}>LIVE</Live>}
      </Header>

      {teams.map((team, i) => (
        <TeamRow key={team.code}>
          <TeamLeft>
            <Badge theme={theme}>{team.code}</Badge>
            <TeamName theme={theme}>{team.name}</TeamName>
            {i === 0 && battingTeam && (
              <Batting theme={theme}>• BAT</Batting>
            )}
          </TeamLeft>

          <ScoreBlock>
            <Score theme={theme} isLive={isLive}>
              {team.score}/{team.wickets}
            </Score>
            <Overs theme={theme}>{team.overs} ov</Overs>
          </ScoreBlock>
        </TeamRow>
      ))}

      <Status theme={theme}>{status}</Status>
    </Card>
  );
};

export default MatchCard;
