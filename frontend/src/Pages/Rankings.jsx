import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { Button, Container, DataTable, Glass, Muted, Page, PageHeader, Segmented, Skeleton, StickyBar, TableScroll } from "../ui/kit";
import { glass, pressable } from "../ui/styles";
import { PlayerPhoto, TeamLogo } from "../ui/players";
import { formatDate } from "../Components/match/theme";

/* ---------- STYLES ---------- */

const Filters = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Podium = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.12fr 1fr;
  gap: 1rem;
  align-items: end;
  margin: 0.5rem 0 1.25rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    > :nth-child(2) {
      order: -1;
    }
  }
`;

const Step = styled.div`
  ${glass}
  ${({ $link }) => ($link ? pressable : "")}
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.55rem;
  padding: ${({ $first }) => ($first ? "1.6rem 1rem 1.3rem" : "1.2rem 1rem 1.1rem")};
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;
  border-color: ${({ $first }) => ($first ? "var(--accent-line)" : "var(--border)")};

  &::before {
    content: "";
    position: absolute;
    inset: -40% -20% auto;
    height: 120%;
    background: radial-gradient(closest-side, ${({ $first }) => ($first ? "var(--accent-soft)" : "var(--hover)")}, transparent);
    pointer-events: none;
  }
  > * {
    position: relative;
  }
  .badge {
    position: absolute;
    top: 0.75rem;
    left: 0.85rem;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: ${({ $first }) => ($first ? "1.5rem" : "1.2rem")};
    letter-spacing: -0.03em;
    color: ${({ $first }) => ($first ? "var(--accent)" : "var(--muted)")};
  }
  .name {
    font-weight: 750;
    font-size: ${({ $first }) => ($first ? "1.15rem" : "1rem")};
    letter-spacing: -0.015em;
    line-height: 1.2;
  }
  .sub {
    font-size: 0.78rem;
    color: var(--muted);
  }
  .rating {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: ${({ $first }) => ($first ? "2rem" : "1.6rem")};
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .rating small {
    display: block;
    margin-top: 4px;
    font-family: var(--font);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
`;

const Rank = styled.span`
  display: inline-grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex: none;
  border-radius: 10px;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  background: var(--solid-2);
  color: var(--text);
`;

const Who = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;

  a {
    color: var(--text);
    text-decoration: none;
    font-weight: 650;
  }
  a:hover {
    color: var(--accent);
  }
  .plain {
    font-weight: 650;
  }
  .country {
    display: block;
    font-size: 0.74rem;
    color: var(--muted);
    font-weight: 500;
  }
`;

const Trend = styled.span`
  font-weight: 800;
  font-size: 0.8rem;
  color: ${({ $t }) => ($t === "Up" ? "var(--win)" : $t === "Down" ? "var(--live)" : "var(--muted)")};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

/* ---------- DATA ---------- */

const CATEGORIES = [
  { key: "teams", label: "Teams" },
  { key: "batting", label: "Batters" },
  { key: "bowling", label: "Bowlers" },
  { key: "allrounder", label: "All-rounders" },
];
const FORMATS = [
  { key: "TEST", label: "Test" },
  { key: "ODI", label: "ODI" },
  { key: "T20I", label: "T20I" },
];
// old links used ?category=Team&format=T20
const LEGACY = { Team: "teams", Batsman: "batting", Bowler: "bowling", "All-rounder": "allrounder", Test: "TEST", T20: "T20I" };

const TEAM_PAGE = 20;
const TREND = { Up: "▲", Down: "▼", Flat: "—" };

/* ---------- PIECES ---------- */

const Avatar = ({ row, isTeam, size }) =>
  isTeam ? (
    <TeamLogo src={row.image} code={row.name.slice(0, 3).toUpperCase()} size={size} crest={false} label={row.name} />
  ) : (
    <PlayerPhoto src={row.image} name={row.name} size={size} />
  );

const linkFor = (row, isTeam) => (isTeam ? row.teamId && `/teams/${row.teamId}` : row.playerId && `/players/${row.playerId}`);

const PodiumStep = ({ row, isTeam, first }) => {
  const to = linkFor(row, isTeam);
  return (
    <Step as={to ? Link : "div"} to={to || undefined} $first={first} $link={!!to}>
      <span className="badge">#{row.rank}</span>
      <Avatar row={row} isTeam={isTeam} size={first ? 84 : 66} />
      <div>
        <div className="name">{row.name}</div>
        <div className="sub">{isTeam ? `${row.matches} matches · ${row.points.toLocaleString()} pts` : row.country}</div>
      </div>
      <div className="rating">
        {row.rating}
        <small>Rating</small>
      </div>
    </Step>
  );
};

/* ---------- PAGE ---------- */

const Rankings = () => {
  const [params, setParams] = useSearchParams();
  const category = LEGACY[params.get("category")] || params.get("category") || "teams";
  const format = LEGACY[params.get("format")] || params.get("format") || "TEST";
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    apiGet("/rankings")
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const set = (next) => {
    setParams({ category, format, ...next });
    setShowAll(false);
  };

  const isTeam = category === "teams";
  const rows = data?.rankings?.[category]?.[format] || [];
  const [first, second, third, ...rest] = rows;
  const visible = isTeam && !showAll ? rest.slice(0, TEAM_PAGE - 3) : rest;
  const catLabel = CATEGORIES.find((c) => c.key === category)?.label;

  return (
    <Page>
      <Header />

      <Container $max="1000px">
        <PageHeader eyebrow="ICC rankings" title="Rankings" subtitle="The official ICC men's rankings for teams and players, kept up to date." />

        <StickyBar>
          <Filters>
            <Segmented items={CATEGORIES} value={category} onChange={(c) => set({ category: c })} ariaLabel="Ranking type" />
            <Segmented items={FORMATS} value={format} onChange={(f) => set({ format: f })} ariaLabel="Format" />
          </Filters>
        </StickyBar>

        {failed ? (
          <EmptyState icon="📊" title="Rankings unavailable" text="We couldn't load the latest rankings. Try again in a little while." />
        ) : !data ? (
          <>
            <Podium>
              <Skeleton $h="220px" $r="22px" />
              <Skeleton $h="260px" $r="22px" />
              <Skeleton $h="220px" $r="22px" />
            </Podium>
            <Skeleton $h="420px" $r="22px" />
          </>
        ) : rows.length === 0 ? (
          <EmptyState icon="📊" title="No rankings" text={`${catLabel} rankings for ${format} aren't available right now.`} />
        ) : (
          <>
            {third && (
              <Podium>
                <PodiumStep row={second} isTeam={isTeam} />
                <PodiumStep row={first} isTeam={isTeam} first />
                <PodiumStep row={third} isTeam={isTeam} />
              </Podium>
            )}

            {visible.length > 0 && (
              <Glass $pad="0.5rem 0.75rem">
                <TableScroll>
                  <DataTable>
                    <thead>
                      <tr>
                        <th>{isTeam ? "Team" : "Player"}</th>
                        {isTeam ? (
                          <>
                            <th>Matches</th>
                            <th>Points</th>
                          </>
                        ) : (
                          <th>Trend</th>
                        )}
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((row) => {
                        const to = linkFor(row, isTeam);
                        return (
                          <tr key={`${row.rank}-${row.name}`}>
                            <td>
                              <Who>
                                <Rank>{row.rank}</Rank>
                                <Avatar row={row} isTeam={isTeam} size={isTeam ? 24 : 34} />
                                <span>
                                  {to ? <Link to={to}>{row.name}</Link> : <span className="plain">{row.name}</span>}
                                  {!isTeam && row.country && <span className="country">{row.country}</span>}
                                </span>
                              </Who>
                            </td>
                            {isTeam ? (
                              <>
                                <td>{row.matches ?? "—"}</td>
                                <td>{row.points?.toLocaleString() ?? "—"}</td>
                              </>
                            ) : (
                              <td>
                                <Trend $t={row.trend} aria-label={row.trend || "No change"}>
                                  {TREND[row.trend] || "—"}
                                </Trend>
                              </td>
                            )}
                            <td style={{ fontWeight: 750 }}>{row.rating}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </DataTable>
                </TableScroll>
              </Glass>
            )}

            <Footer>
              {isTeam && rest.length > visible.length && (
                <Button $variant="ghost" $size="sm" onClick={() => setShowAll(true)}>
                  Show all {rows.length} teams
                </Button>
              )}
              <Muted $size="0.74rem">
                Source: ICC rankings via Cricbuzz · refreshed {data.updatedAt ? formatDate(data.updatedAt, true) : "regularly"}
              </Muted>
            </Footer>
          </>
        )}
      </Container>
    </Page>
  );
};

export default Rankings;
