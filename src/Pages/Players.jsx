import React from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME TOKENS ---------- */

const tokens = {
  light: {
    pageBg: "#f6f7f9",
    cardBg: "#ffffff",
    border: "#e5e7eb",
    text: "#0f172a",
    muted: "#64748b",
    hover: "#f1f5f9",
  },
  dark: {
    pageBg: "#0b1220",
    cardBg: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    hover: "#1e293b",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.pageBg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 16px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 24px;
`;

/* ---------- TEAM SECTION ---------- */

const TeamSection = styled.div`
  margin-bottom: 36px;
`;

const TeamHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 16px;
`;

/* ---------- GRID ---------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

/* ---------- PLAYER CARD ---------- */

const PlayerCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
  }
`;

const PlayerImage = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 8px;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
  margin-bottom: 10px;
`;

const PlayerName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const PlayerRole = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- TEMP DATA (BACKEND-LIKE) ---------- */

const playersData = {
  India: [
    { id: 1, name: "Rohit Sharma", role: "Batsman" },
    { id: 2, name: "Virat Kohli", role: "Batsman" },
    { id: 3, name: "Jasprit Bumrah", role: "Bowler" },
    { id: 4, name: "Ravindra Jadeja", role: "All-rounder" },
  ],
  Australia: [
    { id: 5, name: "Pat Cummins", role: "Bowler" },
    { id: 6, name: "Steve Smith", role: "Batsman" },
    { id: 7, name: "Glenn Maxwell", role: "All-rounder" },
  ],
  England: [
    { id: 8, name: "Joe Root", role: "Batsman" },
    { id: 9, name: "Ben Stokes", role: "All-rounder" },
  ],
};

/* ---------- PAGE ---------- */

const Players = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const handlePlayerClick = (player) => {
    // later: navigate(`/players/${player.id}`)
    console.log("Open player:", player.name);
  };

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <PageTitle theme={theme}>Players</PageTitle>

        {Object.entries(playersData).map(([team, players]) => (
          <TeamSection key={team}>
            <TeamHeader theme={theme}>{team}</TeamHeader>

            <Grid>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  theme={theme}
                  onClick={() => handlePlayerClick(player)}
                >
                  <PlayerImage theme={theme}>
                    Player Photo
                  </PlayerImage>

                  <PlayerName theme={theme}>
                    {player.name}
                  </PlayerName>
                  <PlayerRole theme={theme}>
                    {player.role}
                  </PlayerRole>
                </PlayerCard>
              ))}
            </Grid>
          </TeamSection>
        ))}
      </Container>
    </Page>
  );
};

export default Players;
