import React from "react";
import styled from "styled-components";

/* ---------- Colors ---------- */

const colors = {
  light: {
    bg: "#ffffff",
    border: "#eaeaea",
    textPrimary: "#111",
    textSecondary: "#777",
    textMuted: "#999",
    hoverShadow: "rgba(0,0,0,0.08)",
    live: "#d32f2f",
  },
  dark: {
    bg: "#121212",
    border: "#2a2a2a",
    textPrimary: "#f5f5f5",
    textSecondary: "#b5b5b5",
    textMuted: "#888",
    hoverShadow: "rgba(0,0,0,0.5)",
    live: "#ff4d4d",
  },
};

/* ---------- Card ---------- */

const Card = styled.div`
  width: 100%;
  max-width: 360px;
  background: ${({ theme }) => theme.bg};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-family: "Inter", "Segoe UI", sans-serif;

  &:hover {
    box-shadow: 0 8px 22px ${({ theme }) => theme.hoverShadow};
    transform: translateY(-2px);
  }
`;

/* ---------- Header ---------- */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const MatchType = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Live = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.live};
`;

/* ---------- Teams ---------- */

const Teams = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Overs = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  margin-left: 6px;
`;

const TeamRight = styled.div`
  text-align: right;
`;

const Score = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

/* ---------- Status ---------- */

const Status = styled.div`
  margin-top: 14px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

/* ---------- Component ---------- */

const MatchCard = ({ matchData, darkMode = false }) => {
  const theme = darkMode ? colors.dark : colors.light;

  const data = matchData;

  return (
    <Card theme={theme}>
      <Header>
        <MatchType theme={theme}>{data.type}</MatchType>
        {data.live && <Live theme={theme}>LIVE</Live>}
      </Header>

      <Teams>
        {[data.team1, data.team2].map((team, i) => (
          <TeamRow key={i}>
            <TeamLeft>
              <TeamBadge theme={theme}>{team.code}</TeamBadge>
              <TeamName theme={theme}>{team.name}</TeamName>
              <Overs theme={theme}>{team.overs} ov</Overs>
            </TeamLeft>
            <TeamRight>
              <Score theme={theme}>
                {team.score}/{team.wickets}
              </Score>
            </TeamRight>
          </TeamRow>
        ))}
      </Teams>

      {data.status && <Status theme={theme}>{data.status}</Status>}
    </Card>
  );
};

export default MatchCard;
