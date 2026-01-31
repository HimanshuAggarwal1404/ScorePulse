import React, { useState } from "react";
import styled from "styled-components";
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
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
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

/* ---------- TABS ---------- */

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  background: ${({ active, theme }) => (active ? theme.accent : "transparent")};
  color: ${({ active, theme }) => (active ? "#fff" : theme.text)};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ active, theme }) => (active ? theme.accent : theme.hover)};
  }
`;

/* ---------- TABLE ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 0.85rem;
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

/* ---------- MOCK DATA (TEMP) ---------- */

const rankingsData = {
  Team: {
    Test: [
      { rank: 1, name: "Australia", rating: 124, points: 4604 },
      { rank: 2, name: "South Africa", rating: 116, points: 3581 },
      { rank: 3, name: "England", rating: 111, points: 5013 },
    ],
    ODI: [
      { rank: 1, name: "India", rating: 121, points: 4604 },
      { rank: 2, name: "New Zealand", rating: 116, points: 3545 },
    ],
    T20: [
      { rank: 1, name: "India", rating: 266, points: 10000 },
      { rank: 2, name: "England", rating: 258, points: 9800 },
    ],
  },
};

/* ---------- PAGE ---------- */

const Rankings = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [category, setCategory] = useState("Team");
  const [format, setFormat] = useState("Test");

  const rows = rankingsData[category][format] || [];

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <Title theme={theme}>Standings</Title>

        {/* Category Tabs */}
        <Tabs>
          {["Team", "Batsman", "Bowler", "All-rounder"].map((c) => (
            <Tab
              key={c}
              theme={theme}
              active={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </Tab>
          ))}
        </Tabs>

        {/* Format Tabs */}
        <Tabs>
          {["Test", "ODI", "T20"].map((f) => (
            <Tab
              key={f}
              theme={theme}
              active={format === f}
              onClick={() => setFormat(f)}
            >
              {f}
            </Tab>
          ))}
        </Tabs>

        {/* Rankings Table */}
        <Card theme={theme}>
          <Table>
            <thead>
              <tr>
                <Th theme={theme}>Rank</Th>
                <Th theme={theme}>{category === "Team" ? "Team" : "Player"}</Th>
                <Th theme={theme}>Rating</Th>
                <Th theme={theme}>Points</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Tr key={row.rank} theme={theme}>
                  <Td theme={theme}>{row.rank}</Td>
                  <Td theme={theme}>{row.name}</Td>
                  <Td theme={theme}>{row.rating}</Td>
                  <Td theme={theme}>{row.points}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </Page>
  );
};

export default Rankings;
