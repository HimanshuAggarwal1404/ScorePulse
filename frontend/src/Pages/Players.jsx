import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME ---------- */

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

/* ---------- STYLES ---------- */

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

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
`;

const PlayerCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-3px);
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const PlayerName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- PAGE ---------- */

const Players = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/players")
      .then(res => res.json())
      .then(setPlayers)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return players.filter(p =>
      p.name.toLowerCase().includes(q)
    );
  }, [players, search]);

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        <TitleRow>
          <PageTitle theme={theme}>Players</PageTitle>
          <SearchInput
            theme={theme}
            placeholder="Search players…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </TitleRow>

        <Grid>
          {filtered.map(p => (
            <PlayerCard
              key={p.id}
              theme={theme}
              onClick={() => navigate(`/players/${p.id}`)}
            >
              <TopRow>
                <Avatar theme={theme}>
                  {p.name
                    .split(" ")
                    .slice(0, 2)
                    .map(w => w[0])
                    .join("")}
                </Avatar>
                <div>
                  <PlayerName theme={theme}>{p.name}</PlayerName>
                  <Meta theme={theme}>
                    {p.nationality || " "}
                  </Meta>
                </div>
              </TopRow>
            </PlayerCard>
          ))}
        </Grid>
      </Container>
    </Page>
  );
};

export default Players;
