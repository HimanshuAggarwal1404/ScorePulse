import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

/* ---------- Theme Tokens ---------- */

const colors = {
  light: {
    cardBg: "#ffffff",
    border: "#e5e7eb",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",
    highlight: "#2563eb",
    live: "#dc2626",
  },
  dark: {
    cardBg: "#151c2f",
    border: "#24304a",
    textPrimary: "#f5f7fa",
    textSecondary: "#c7d0dd",
    textMuted: "#9aa4b2",
    highlight: "#60a5fa",
    live: "#f87171",
  },
};

/* ---------- Styled ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px 16px;
  font-family: "Inter", "Segoe UI", sans-serif;
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
  color: ${({ theme }) => theme.live};
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
  gap: 10px;
`;

const TeamBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const Batting = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.highlight};
`;

const ScoreBlock = styled.div`
  text-align: right;
`;

const Score = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const Overs = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
`;

const Status = styled.div`
  margin-top: 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

/* ---------- Component ---------- */

const MatchCard = ({ matchData }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;

  const { team1, team2, status, live, type } = matchData;

  /* ---------- CRITICAL STATE LOGIC ---------- */

  const statusText = status?.toLowerCase() || "";

  const isCompleted =
    statusText.includes("won") ||
    statusText.includes("beat") ||
    statusText.includes("draw") ||
    statusText.includes("tie") ||
    statusText.includes("no result") ||
    statusText.includes("abandoned");

  const isLive = live && !isCompleted;

  /* ---------- Batting Team (ONLY if LIVE & chasing) ---------- */

  const battingTeam =
    isLive && statusText.includes("need") ? team2 : null;

  const teamsToRender = battingTeam
    ? [battingTeam, battingTeam === team1 ? team2 : team1]
    : [team1, team2];

  /* ---------- Render ---------- */

  return (
    <Card theme={theme}>
      <Header>
        <MatchType theme={theme}>{type}</MatchType>
        {isLive && <Live theme={theme}>LIVE</Live>}
      </Header>

      {teamsToRender.map((team, index) => (
        <TeamRow key={team.code}>
          <TeamLeft>
            <TeamBadge theme={theme}>{team.code}</TeamBadge>
            <TeamName theme={theme}>{team.name}</TeamName>
            {index === 0 && battingTeam && (
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

      {status && <Status theme={theme}>{status}</Status>}
    </Card>
  );
};

export default MatchCard;
