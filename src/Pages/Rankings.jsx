import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
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
    up: "#16a34a",
    down: "#dc2626",
    hover: "#f1f5f9",
    stickyBg: "#f6f7f9",
    shadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    up: "#4ade80",
    down: "#f87171",
    hover: "#1e293b",
    stickyBg: "#0b1220",
    shadow: "0 4px 12px rgba(0,0,0,0.35)",
  },
};

/* ---------- PAGE ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 16px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  margin-bottom: 16px;
`;

/* ---------- STICKY TABS WRAPPER ---------- */

const StickyTabs = styled.div`
  position: sticky;
  top: 64px; /* header height */
  z-index: 50;

  background: ${({ theme }) => theme.stickyBg};
  padding-top: 12px;
  padding-bottom: 12px;

  box-shadow: ${({ stuck, theme }) =>
    stuck ? theme.shadow : "none"};
  transition: box-shadow 0.2s ease;
`;

/* ---------- TABS ---------- */

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: ${({ noMargin }) => (noMargin ? "0" : "12px")};
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${({ active, theme }) =>
    active ? theme.accent : "transparent"};
  color: ${({ active, theme }) =>
    active ? "#fff" : theme.text};

  border: 1px solid ${({ theme }) => theme.border};
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.accent : theme.hover};
  }
`;

/* ---------- TABLE ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
  margin-top: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

/* ---------- CHANGE INDICATOR ---------- */

const Change = styled.span`
  font-weight: 700;
  color: ${({ type, theme }) =>
    type === "up"
      ? theme.up
      : type === "down"
      ? theme.down
      : theme.muted};
`;

/* ---------- MOCK DATA ---------- */

const mockRankings = {
  Team: {
    Test: [
      { rank: 1, prevRank: 2, name: "Australia", rating: 124, points: 4604 },
      { rank: 2, prevRank: 1, name: "South Africa", rating: 116, points: 3581 },
      { rank: 3, prevRank: 3, name: "England", rating: 111, points: 5013 },
    ],
    ODI: [
      { rank: 1, prevRank: 1, name: "India", rating: 121, points: 4604 },
      { rank: 2, prevRank: 3, name: "New Zealand", rating: 116, points: 3545 },
    ],
    T20: [
      { rank: 1, prevRank: 2, name: "India", rating: 266, points: 10000 },
      { rank: 2, prevRank: 1, name: "England", rating: 258, points: 9800 },
    ],
  },
};

/* ---------- HELPERS ---------- */

const getChange = (rank, prevRank) => {
  if (prevRank > rank) return { symbol: "↑", type: "up" };
  if (prevRank < rank) return { symbol: "↓", type: "down" };
  return { symbol: "—", type: "same" };
};

/* ---------- PAGE ---------- */

const Rankings = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "Team";
  const format = searchParams.get("format") || "Test";

  const [rows, setRows] = useState([]);
  const [stuck, setStuck] = useState(false);

  /* Detect stickiness (no scroll listener) */
  const stickyRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setStuck(!e.isIntersecting),
      { threshold: [1] }
    );

    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const data = mockRankings[category]?.[format] || [];
    setRows(data);
  }, [category, format]);

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <Title theme={theme}>Standings</Title>

        {/* Sentinel for sticky detection */}
        <div ref={stickyRef} />

        {/* STICKY FILTERS */}
        <StickyTabs theme={theme} stuck={stuck}>
          <Tabs>
            {["Team", "Batsman", "Bowler", "All-rounder"].map((c) => (
              <Tab
                key={c}
                theme={theme}
                active={category === c}
                onClick={() =>
                  setSearchParams({ category: c, format })
                }
              >
                {c}
              </Tab>
            ))}
          </Tabs>

          <Tabs noMargin>
            {["Test", "ODI", "T20"].map((f) => (
              <Tab
                key={f}
                theme={theme}
                active={format === f}
                onClick={() =>
                  setSearchParams({ category, format: f })
                }
              >
                {f}
              </Tab>
            ))}
          </Tabs>
        </StickyTabs>

        {/* TABLE */}
        <Card theme={theme}>
          <Table>
            <thead>
              <tr>
                <Th theme={theme}>Rank</Th>
                <Th theme={theme}>Change</Th>
                <Th theme={theme}>
                  {category === "Team" ? "Team" : "Player"}
                </Th>
                <Th theme={theme}>Rating</Th>
                <Th theme={theme}>Points</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const change = getChange(row.rank, row.prevRank);
                return (
                  <Tr key={row.rank} theme={theme}>
                    <Td theme={theme}>{row.rank}</Td>
                    <Td theme={theme}>
                      <Change type={change.type} theme={theme}>
                        {change.symbol}
                      </Change>
                    </Td>
                    <Td theme={theme}>{row.name}</Td>
                    <Td theme={theme}>{row.rating}</Td>
                    <Td theme={theme}>{row.points}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </Container>
    </Page>
  );
};

export default Rankings;
