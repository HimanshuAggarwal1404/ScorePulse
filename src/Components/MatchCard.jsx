import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

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
  overflow: hidden;

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
  font-weight: 700;
  color: ${({ theme }) => theme.liveAccent};
`;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
`;

const TeamLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0; /* IMPORTANT for ellipsis */
  flex: 1;
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
  flex-shrink: 0;
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Batting = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.highlight};
  flex-shrink: 0;
`;

const ScoreBlock = styled.div`
  text-align: right;
  flex-shrink: 0;
  min-width: 72px; /* LOCKS RIGHT COLUMN */
`;

const Score = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 1.1;
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
            <Score theme={theme}>
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
