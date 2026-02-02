import React from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME TOKENS ---------- */

const tokens = {
  light: {
    bg: "#f6f7f9",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    hover: "#f1f5f9",
    badge: "#eef2ff",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    hover: "#1e293b",
    badge: "#1e293b",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 16px;
`;

/* ---------- STICKY TABS ---------- */

const TabsWrapper = styled.div`
  position: sticky;
  top: 64px;
  z-index: 20;
  background: ${({ theme }) => theme.bg};
  padding: 12px 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
`;

const Tab = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  background: ${({ active, theme }) => (active ? theme.accent : "transparent")};
  color: ${({ active, theme }) => (active ? "#fff" : theme.text)};

  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background: ${({ active, theme }) => (active ? theme.accent : theme.hover)};
  }
`;

/* ---------- CARD ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Badge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.badge};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.muted};
  margin-top: 6px;
`;

const Result = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

/* ---------- MOCK DATA ---------- */

const tournamentsData = {
  active: [
    {
      id: "ipl_2025",
      name: "Indian Premier League 2025",
      type: "TOURNAMENT",
      date: "Mar – May 2025",
    },
  ],
  future: [
    {
      id: "ind_eng_test",
      name: "England Tour of India 2025",
      type: "SERIES",
      date: "Jan – Feb 2025",
    },
  ],
  past: [
    {
      id: "wc_2023",
      name: "ICC Cricket World Cup 2023",
      type: "TOURNAMENT",
      date: "Oct – Nov 2023",
      result: "Australia won the final",
    },
    {
      id: "ind_aus_t20",
      name: "India vs Australia T20I Series",
      type: "SERIES",
      date: "Dec 2024",
      result: "India won 3–2",
    },
  ],
};

/* ---------- PAGE ---------- */

const Tournaments = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const tab = params.get("type") || "active";
  const list = tournamentsData[tab];

  const openCompetition = (item) => {
    if (item.type === "TOURNAMENT") {
      navigate(`/tournament/${item.id}/points`);
    } else {
      navigate(`/series/${item.id}`);
    }
  };

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <Title theme={theme}>Tournaments & Series</Title>

        <TabsWrapper theme={theme}>
          <Tabs>
            {[
              { key: "active", label: "Active" },
              { key: "future", label: "Upcoming" },
              { key: "past", label: "Archive" },
            ].map((t) => (
              <Tab
                key={t.key}
                theme={theme}
                active={tab === t.key}
                onClick={() => setParams({ type: t.key })}
              >
                {t.label}
              </Tab>
            ))}
          </Tabs>
        </TabsWrapper>

        {list.map((item) => (
          <Card
            key={item.id}
            theme={theme}
            onClick={() => openCompetition(item)}
          >
            <CardHeader>
              <Name theme={theme}>{item.name}</Name>
              <Badge theme={theme}>{item.type}</Badge>
            </CardHeader>

            <Meta theme={theme}>{item.date}</Meta>

            {item.result && <Result theme={theme}>{item.result}</Result>}
          </Card>
        ))}
      </Container>
    </Page>
  );
};

export default Tournaments;
