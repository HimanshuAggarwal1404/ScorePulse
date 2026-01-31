import React from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

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
`;

const TeamName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const TeamMeta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 4px;
`;

/* ---------- DATA (TEMP) ---------- */

const teamsData = {
  international: [
    { name: "India", code: "IND", type: "Full Member" },
    { name: "Australia", code: "AUS", type: "Full Member" },
    { name: "England", code: "ENG", type: "Full Member" },
    { name: "South Africa", code: "SA", type: "Full Member" },
    { name: "Pakistan", code: "PAK", type: "Full Member" },
  ],
  domestic: [
    { name: "Mumbai", code: "MUM", type: "Ranji Trophy" },
    { name: "Delhi", code: "DEL", type: "Ranji Trophy" },
    { name: "Tamil Nadu", code: "TN", type: "Ranji Trophy" },
  ],
  franchise: [
    { name: "Chennai Super Kings", code: "CSK", type: "IPL" },
    { name: "Mumbai Indians", code: "MI", type: "IPL" },
    { name: "Royal Challengers Bengaluru", code: "RCB", type: "IPL" },
  ],
};

/* ---------- PAGE ---------- */

const Teams = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? themeTokens.dark : themeTokens.light;

  const handleTeamClick = (team) => {
    // later: navigate(`/teams/${team.code}`)
    console.log("Open team:", team.name);
  };

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <PageTitle theme={theme}>Teams</PageTitle>

        {/* International */}
        <Section>
          <SectionTitle theme={theme}>International Teams</SectionTitle>
          <Grid>
            {teamsData.international.map((team) => (
              <TeamCard
                key={team.code}
                theme={theme}
                onClick={() => handleTeamClick(team)}
              >
                <TeamName theme={theme}>{team.name}</TeamName>
                <TeamMeta theme={theme}>{team.type}</TeamMeta>
              </TeamCard>
            ))}
          </Grid>
        </Section>

        {/* Domestic */}
        <Section>
          <SectionTitle theme={theme}>Domestic Teams</SectionTitle>
          <Grid>
            {teamsData.domestic.map((team) => (
              <TeamCard
                key={team.code}
                theme={theme}
                onClick={() => handleTeamClick(team)}
              >
                <TeamName theme={theme}>{team.name}</TeamName>
                <TeamMeta theme={theme}>{team.type}</TeamMeta>
              </TeamCard>
            ))}
          </Grid>
        </Section>

        {/* Franchise */}
        <Section>
          <SectionTitle theme={theme}>Franchise Teams</SectionTitle>
          <Grid>
            {teamsData.franchise.map((team) => (
              <TeamCard
                key={team.code}
                theme={theme}
                onClick={() => handleTeamClick(team)}
              >
                <TeamName theme={theme}>{team.name}</TeamName>
                <TeamMeta theme={theme}>{team.type}</TeamMeta>
              </TeamCard>
            ))}
          </Grid>
        </Section>
      </Container>
    </Page>
  );
};

export default Teams;
