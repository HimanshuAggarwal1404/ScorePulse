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

/* ---------- ANIMATION ---------- */

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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MatchType = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Live = styled.span`
  font-size: 11px;
  font-weight: 800;
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

const TeamName = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const Score = styled.div`
  font-size: 15px;
  font-weight: 700;
  animation: ${({ live }) => (live ? pulse : "none")} 1.4s infinite;
`;

const Overs = styled.div`
  font-size: 11px;
`;

/* ---------- COMPONENT ---------- */

const MatchCard = ({ matchData }) => {
  const { darkMode } = useTheme();
  const theme = darkMode ? colors.dark : colors.light;
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);

  const isLive = matchData?.live === true;

  useEffect(() => {
    if (!matchData?.id) return;

    fetch(`http://localhost:8000/api/matches/recent`)
      .then((res) => res.json())
      .then((data) => {
        setDeliveries(Array.isArray(data.scorecard) ? data.scorecard : []);
      })
      .catch(() => setDeliveries([]));
  }, [matchData?.id]);

  /* ---------- AGGREGATE DELIVERIES ---------- */

  const inningsMap = {};

  deliveries.forEach((d) => {
    if (!inningsMap[d.innings_id]) {
      inningsMap[d.innings_id] = {
        batting_team: d.batting_team,
        runs: 0,
        wickets: 0,
        balls: 0,
      };
    }

    inningsMap[d.innings_id].runs += d.runs_total || 0;
    inningsMap[d.innings_id].balls += 1;
    if (d.player_out) inningsMap[d.innings_id].wickets += 1;
  });

  const innings = Object.values(inningsMap);

  /* ---------- 🔑 FIX IS HERE ---------- */
  const teams = [matchData?.team1, matchData?.team2].filter(
    (t) => t && t.name
  );

  return (
    <Card
      theme={theme}
      onClick={() => navigate(`/match/${matchData.id}`)}
    >
      <Header>
        <MatchType>{matchData?.format}</MatchType>
        {isLive && <Live>LIVE</Live>}
      </Header>

      {teams.map((team, idx) => {
        const inn = innings.find(
          (i) => i.batting_team === team.name
        );

        return (
          <TeamRow key={idx}>
            <TeamName>{team.name}</TeamName>

            {inn ? (
              <div>
                <Score live={isLive}>
                  {inn.runs}/{inn.wickets}
                </Score>
                <Overs>{(inn.balls / 6).toFixed(1)} ov</Overs>
              </div>
            ) : (
              <Overs>Yet to bat</Overs>
            )}
          </TeamRow>
        );
      })}
    </Card>
  );
};

export default MatchCard;
