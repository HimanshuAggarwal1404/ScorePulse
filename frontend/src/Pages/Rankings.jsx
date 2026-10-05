import React from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { Container, DataTable, Glass, Page, PageHeader, Segmented, StickyBar, TableScroll } from "../ui/kit";

/* ---------- STYLES ---------- */

const Filters = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Rank = styled.span`
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  background: ${({ $top }) => ($top ? "var(--accent)" : "var(--solid-2)")};
  color: ${({ $top }) => ($top ? "var(--accent-ink)" : "var(--text)")};
  box-shadow: ${({ $top }) => ($top ? "var(--glow)" : "none")};
`;

const Change = styled.span`
  font-weight: 700;
  color: ${({ $type }) => ($type === "up" ? "var(--win)" : $type === "down" ? "var(--live)" : "var(--muted)")};
`;

const Name = styled.span`
  font-weight: 650;
  letter-spacing: -0.01em;
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
  if (prevRank > rank) return { symbol: "▲", type: "up", label: "Up" };
  if (prevRank < rank) return { symbol: "▼", type: "down", label: "Down" };
  return { symbol: "—", type: "same", label: "No change" };
};

const CATEGORIES = ["Team", "Batsman", "Bowler", "All-rounder"].map((c) => ({ key: c, label: c === "Batsman" ? "Batters" : c === "Bowler" ? "Bowlers" : c === "All-rounder" ? "All-rounders" : "Teams" }));
const FORMATS = ["Test", "ODI", "T20"].map((f) => ({ key: f, label: f }));

/* ---------- PAGE ---------- */

const Rankings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "Team";
  const format = searchParams.get("format") || "Test";
  const rows = mockRankings[category]?.[format] || [];

  return (
    <Page>
      <Header />

      <Container $max="1000px">
        <PageHeader eyebrow="Rankings" title="Standings" subtitle="Team and player rankings by format." />

        <StickyBar>
          <Filters>
            <Segmented items={CATEGORIES} value={category} onChange={(c) => setSearchParams({ category: c, format })} ariaLabel="Ranking type" />
            <Segmented items={FORMATS} value={format} onChange={(f) => setSearchParams({ category, format: f })} ariaLabel="Format" />
          </Filters>
        </StickyBar>

        {rows.length === 0 ? (
          <EmptyState icon="📊" title="Rankings coming soon" text={`${CATEGORIES.find((c) => c.key === category).label} rankings for ${format} aren't available yet.`} />
        ) : (
          <Glass $pad="0.5rem 0.75rem">
            <TableScroll>
              <DataTable>
                <thead>
                  <tr>
                    <th>{category === "Team" ? "Team" : "Player"}</th>
                    <th>Change</th>
                    <th>Rating</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const change = getChange(row.rank, row.prevRank);
                    return (
                      <tr key={row.rank}>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                            <Rank $top={row.rank === 1}>{row.rank}</Rank>
                            <Name>{row.name}</Name>
                          </span>
                        </td>
                        <td>
                          <Change $type={change.type} aria-label={change.label}>
                            {change.symbol}
                          </Change>
                        </td>
                        <td style={{ fontWeight: 700 }}>{row.rating}</td>
                        <td>{row.points.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
            </TableScroll>
          </Glass>
        )}
      </Container>
    </Page>
  );
};

export default Rankings;
