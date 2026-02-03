import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
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
    hover: "#f1f5f9",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
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

/* ---------- TABLE ---------- */

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.muted};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Td = styled.td`
  padding: 12px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

/* ---------- MOCK BACKEND DATA ---------- */

const pointsTableData = {
  ipl_2025: {
    name: "Indian Premier League 2025",
    table: [
      { team: "CSK", p: 9, w: 7, l: 2, nrr: "+0.82", pts: 14 },
      { team: "RR", p: 9, w: 6, l: 3, nrr: "+0.41", pts: 12 },
      { team: "MI", p: 9, w: 5, l: 4, nrr: "+0.18", pts: 10 },
    ],
  },
  wc_2023: {
    name: "ICC Cricket World Cup 2023",
    table: [
      { team: "India", p: 9, w: 8, l: 1, nrr: "+1.42", pts: 16 },
      { team: "Australia", p: 9, w: 7, l: 2, nrr: "+0.98", pts: 14 },
      { team: "South Africa", p: 9, w: 6, l: 3, nrr: "+0.52", pts: 12 },
    ],
  },
};

/* ---------- PAGE ---------- */

const PointsTable = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const tournament = pointsTableData[id];

  if (!tournament) {
    return (
      <Page theme={theme}>
        <Header />
        <Container>
          <Title theme={theme}>Points Table Not Found</Title>
        </Container>
      </Page>
    );
  }

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        <Title theme={theme}>{tournament.name}</Title>

        <Card theme={theme}>
          <Table>
            <thead>
              <tr>
                <Th theme={theme}>Team</Th>
                <Th theme={theme}>P</Th>
                <Th theme={theme}>W</Th>
                <Th theme={theme}>L</Th>
                <Th theme={theme}>NRR</Th>
                <Th theme={theme}>Pts</Th>
              </tr>
            </thead>
            <tbody>
              {tournament.table.map((row, i) => (
                <Tr key={i} theme={theme}>
                  <Td theme={theme}>{row.team}</Td>
                  <Td theme={theme}>{row.p}</Td>
                  <Td theme={theme}>{row.w}</Td>
                  <Td theme={theme}>{row.l}</Td>
                  <Td theme={theme}>{row.nrr}</Td>
                  <Td theme={theme}>{row.pts}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </Page>
  );
};

export default PointsTable;
