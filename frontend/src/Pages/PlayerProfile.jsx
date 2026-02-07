import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    header: "#f1f5f9",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    header: "#1e293b",
  },
};

/* ---------- LAYOUT ---------- */

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

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
`;

/* ---------- HEADER ---------- */

const Name = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const Meta = styled.div`
  margin-top: 6px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- TABLE ---------- */

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;

  th {
    background: ${({ theme }) => theme.header};
    font-weight: 600;
    text-align: left;
    padding: 10px;
    font-size: 0.85rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }

  td {
    padding: 10px;
    font-size: 0.9rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 14px;
  color: ${({ theme }) => theme.text};
`;

/* ---------- HELPERS ---------- */

const statLabel = (k) =>
  k
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const renderStatRow = (label, test, odi, t20) => (
  <tr>
    <td>{label}</td>
    <td>{test ?? "—"}</td>
    <td>{odi ?? "—"}</td>
    <td>{t20 ?? "—"}</td>
  </tr>
);

const buildRows = (test, odi, t20, ignore = []) => {
  if (!test && !odi && !t20) return null;

  const keys = new Set([
    ...Object.keys(test || {}),
    ...Object.keys(odi || {}),
    ...Object.keys(t20 || {}),
  ]);

  return [...keys]
    .filter((k) => !["id", "player_id", "span", ...ignore].includes(k))
    .map((k) =>
      renderStatRow(
        statLabel(k),
        test?.[k],
        odi?.[k],
        t20?.[k]
      )
    );
};

/* ---------- PAGE ---------- */

const PlayerProfile = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/players/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [id]);

  if (!data) return null;

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        {/* ---------- BASIC INFO ---------- */}
        <Card theme={theme}>
          <Name theme={theme}>{data.player.name}</Name>
          <Meta theme={theme}>
            {data.player.nationality || " "}
          </Meta>
        </Card>

        {/* ---------- BATTING ---------- */}
        <Card theme={theme}>
          <SectionTitle theme={theme}>Batting Career Summary</SectionTitle>
          <TableWrapper>
            <Table theme={theme}>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Test</th>
                  <th>ODI</th>
                  <th>T20</th>
                </tr>
              </thead>
              <tbody>
                {buildRows(
                  data.batting.test,
                  data.batting.odi,
                  data.batting.t20
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>

        {/* ---------- BOWLING ---------- */}
        <Card theme={theme}>
          <SectionTitle theme={theme}>Bowling Career Summary</SectionTitle>
          <TableWrapper>
            <Table theme={theme}>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Test</th>
                  <th>ODI</th>
                  <th>T20</th>
                </tr>
              </thead>
              <tbody>
                {buildRows(
                  data.bowling.test,
                  data.bowling.odi,
                  data.bowling.t20
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>

        {/* ---------- FIELDING ---------- */}
        <Card theme={theme}>
          <SectionTitle theme={theme}>Fielding Career Summary</SectionTitle>
          <TableWrapper>
            <Table theme={theme}>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Test</th>
                  <th>ODI</th>
                  <th>T20</th>
                </tr>
              </thead>
              <tbody>
                {buildRows(
                  data.fielding.test,
                  data.fielding.odi,
                  data.fielding.t20
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Card>
      </Container>
    </Page>
  );
};

export default PlayerProfile;
