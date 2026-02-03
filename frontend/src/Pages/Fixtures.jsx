import React from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME ---------- */

const tokens = {
  light: {
    bg: "#f6f7f9",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    hover: "#f1f5f9",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    hover: "#1e293b",
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

const StickyTabs = styled.div`
  position: sticky;
  top: 64px;
  z-index: 50;
  background: ${({ theme }) => theme.bg};
  padding: 12px 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
`;

const Tab = styled.button`
  background: ${({ active, theme }) =>
    active ? theme.accent : "transparent"};
  color: ${({ active }) => (active ? "#fff" : "inherit")};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.accent : theme.hover};
  }
`;

/* ---------- SERIES BLOCK ---------- */

const SeriesBlock = styled.div`
  margin-top: 20px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const SeriesHeader = styled.div`
  padding: 14px 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.hover};
`;

/* ---------- MATCH LIST ---------- */

const MatchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hover};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const MatchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Teams = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.muted};
`;

const Status = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.accent};
`;

/* ---------- MOCK DATA ---------- */

const fixturesData = {
 past: [
    {
      series: "India Tour of Australia 2024",
      matches: [
        {
          id: "m1",
          teams: "India vs Australia",
          meta: "T20I • Melbourne",
          status: "India won by 45 runs",
        },
        {
          id: "m2",
          teams: "India vs Australia",
          meta: "ODI • Sydney",
          status: "Australia won by 6 wickets",
        },
      ],
    },
  ],
  current: [
    {
      series: "Pakistan Tour of New Zealand 2025",
      matches: [
        {
          id: "m3",
          teams: "New Zealand vs Pakistan",
          meta: "Test • Wellington",
          status: "Day 3 • NZ lead by 112 runs",
        },
      ],
    },
  ],
  future: [
    {
      series: "England Tour of India 2025",
      matches: [
        {
          id: "m4",
          teams: "India vs England",
          meta: "Test • Ahmedabad",
          status: "Starts Tomorrow",
        },
        {
          id: "m5",
          teams: "India vs England",
          meta: "ODI • Delhi",
          status: "Starts in 3 days",
        },
      ],
    },
    {
      series: "South Africa Tour of Australia 2025",
      matches: [
        {
          id: "m6",
          teams: "Australia vs South Africa",
          meta: "ODI • Perth",
          status: "Starts in 5 days",
        },
      ],
    },
  ],
};

/* ---------- PAGE ---------- */

const Fixtures = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("type") || "current";
  const seriesList = fixturesData[category] || [];

  const isEmpty =
    seriesList.length === 0 ||
    seriesList.every((s) => s.matches.length === 0);

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <Title theme={theme}>Fixtures</Title>

        <StickyTabs theme={theme}>
          <Tabs>
            {[
              { key: "past", label: "Archive" },
              { key: "current", label: "Current" },
              { key: "future", label: "Upcoming" },
            ].map((t) => (
              <Tab
                key={t.key}
                theme={theme}
                active={category === t.key}
                onClick={() => setSearchParams({ type: t.key })}
              >
                {t.label}
              </Tab>
            ))}
          </Tabs>
        </StickyTabs>

        {/* EMPTY STATE */}
        {isEmpty && (
          <EmptyState
            icon="📅"
            title="No matches right now"
            text={
              category === "current"
                ? "There are no live or ongoing matches at the moment."
                : "No matches available in this section."
            }
            actionLabel="View Upcoming Fixtures"
            actionTo="/fixtures?type=future"
          />
        )}

        {/* SERIES LIST */}
        {!isEmpty &&
          seriesList.map((series) => (
            <SeriesBlock key={series.series} theme={theme}>
              <SeriesHeader theme={theme}>{series.series}</SeriesHeader>

              {series.matches.map((m) => (
                <MatchRow
                  key={m.id}
                  theme={theme}
                  onClick={() => navigate(`/match/${m.id}`)}
                >
                  <MatchInfo>
                    <Teams theme={theme}>{m.teams}</Teams>
                    <Meta theme={theme}>{m.meta}</Meta>
                  </MatchInfo>

                  <Status theme={theme}>{m.status}</Status>
                </MatchRow>
              ))}
            </SeriesBlock>
          ))}
      </Container>
    </Page>
  );
};

export default Fixtures;
