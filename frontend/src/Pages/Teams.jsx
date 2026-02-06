import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

/* ---------- THEME TOKENS ---------- */

const themeTokens = {
  light: {
    pageBg: "#f6f7f9",
    sectionTitle: "#0f172a",
    cardBg: "#ffffff",
    cardBorder: "#e5e7eb",
    textPrimary: "#0f172a",
    textMuted: "#64748b",
    hoverBg: "#f1f5f9",
  },
  dark: {
    pageBg: "#0b1220",
    sectionTitle: "#f5f7fa",
    cardBg: "#151c2f",
    cardBorder: "#24304a",
    textPrimary: "#f5f7fa",
    textMuted: "#9aa4b2",
    hoverBg: "#1e293b",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background: ${({ theme }) => theme.pageBg};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 16px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.sectionTitle};
  margin-bottom: 24px;
`;

/* ---------- SECTION ---------- */

const Section = styled.div`
  margin-bottom: 36px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.sectionTitle};
  margin-bottom: 16px;
`;

/* ---------- GRID ---------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

/* ---------- TEAM CARD ---------- */

const TeamCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.hoverBg};
    transform: translateY(-2px);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
`;

const TeamName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const TeamMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 4px;
`;

/* ---------- PAGE ---------- */

const Teams = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? themeTokens.dark : themeTokens.light;
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data.teams || []));
  }, []);

  const groupedTeams = {
    international: teams.filter((t) => t.type === "international"),
    domestic: teams.filter((t) => t.type === "domestic"),
    franchise: teams.filter((t) => t.type === "franchise"),
  };

  const renderSection = (title, list) =>
    list.length > 0 && (
      <Section>
        <SectionTitle theme={theme}>{title}</SectionTitle>
        <Grid>
          {list.map((team) => (
            <TeamCard
              key={team.id}
              theme={theme}
              onClick={() => navigate(`/teams/${team.id}`)}
            >
              <TeamName theme={theme}>
                {team.name} ({team.short_code})
              </TeamName>
              <TeamMeta theme={theme}>
                {team.type.charAt(0).toUpperCase() + team.type.slice(1)}
              </TeamMeta>
            </TeamCard>
          ))}
        </Grid>
      </Section>
    );

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        <PageTitle theme={theme}>Teams</PageTitle>

        {renderSection("International Teams", groupedTeams.international)}
        {renderSection("Domestic Teams", groupedTeams.domestic)}
        {renderSection("Franchise Teams", groupedTeams.franchise)}
      </Container>
    </Page>
  );
};

export default Teams;
