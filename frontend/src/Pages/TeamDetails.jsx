import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME TOKENS ---------- */

const themeTokens = {
  light: {
    pageBg: "#f6f7f9",
    cardBg: "#ffffff",
    cardBorder: "#e5e7eb",
    textPrimary: "#0f172a",
    textMuted: "#64748b",
  },
  dark: {
    pageBg: "#0b1220",
    cardBg: "#151c2f",
    cardBorder: "#24304a",
    textPrimary: "#f5f7fa",
    textMuted: "#9aa4b2",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background: ${({ theme }) => theme.pageBg};
`;

const Container = styled.div`
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 20px;
`;

/* ---------- PLAYER CARD ---------- */

const PlayerCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
`;

const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const PlayerMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 4px;
`;

/* ---------- PAGE ---------- */

const TeamDetails = () => {
  const { teamId } = useParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? themeTokens.dark : themeTokens.light;

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/teams/${teamId}/players`)
      .then((res) => res.json())
      .then((data) => setPlayers(data.players || []));
  }, [teamId]);
const formatRole = (role) => {
  if (!role) return "";
  if (role.toLowerCase() === "allrounder") return "All-Rounder";
  if (role.toLowerCase() === "wk") return "Wicketkeeper";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        <Title theme={theme}>Squad</Title>

        {players.map((player) => (
          <PlayerCard key={player.id} theme={theme}>
            <PlayerName theme={theme}>{player.name}</PlayerName>
            <PlayerMeta theme={theme}>
              {formatRole(player.role)}

              {player.batting_style && ` • ${player.batting_style}`}
              {player.bowling_style && ` • ${player.bowling_style}`}
            </PlayerMeta>
          </PlayerCard>
        ))}
      </Container>
    </Page>
  );
};

export default TeamDetails;
