import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { Avatar, ButtonLink, Container, DataTable, Eyebrow, Glass, Page, Segmented, Skeleton, TableScroll, Title } from "../ui/kit";
import { initials } from "../ui/styles";

/* ---------- LAYOUT ---------- */

const Hero = styled(Glass)`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -50% -10% auto auto;
    width: 50%;
    height: 200%;
    background: radial-gradient(closest-side, var(--accent-soft), transparent);
    pointer-events: none;
  }
`;

const Highlights = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const Stat = styled(Glass)`
  padding: 1rem 1.1rem;

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .value {
    margin-top: 0.3rem;
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  .sub {
    font-size: 0.76rem;
    color: var(--muted);
  }
`;

const Panel = styled(Glass)`
  padding: 1.1rem 1.1rem 0.6rem;
  margin-bottom: 1.25rem;
`;

const PanelTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.012em;
  margin-bottom: 0.6rem;
`;

/* ---------- HELPERS ---------- */

const statLabel = (k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const buildRows = (test, odi, t20, ignore = []) => {
  if (!test && !odi && !t20) return null;
  const keys = new Set([...Object.keys(test || {}), ...Object.keys(odi || {}), ...Object.keys(t20 || {})]);
  return [...keys]
    .filter((k) => !["id", "player_id", "span", ...ignore].includes(k))
    .map((k) => (
      <tr key={k}>
        <td>{statLabel(k)}</td>
        <td>{test?.[k] ?? "—"}</td>
        <td>{odi?.[k] ?? "—"}</td>
        <td>{t20?.[k] ?? "—"}</td>
      </tr>
    ));
};

// earliest start and latest end across every format, e.g. "1989-2013"
const careerSpan = (...groups) => {
  const years = groups
    .flatMap((g) => ["test", "odi", "t20"].map((f) => g?.[f]?.span))
    .flatMap((s) => String(s).match(/\d{4}/g) || [])
    .map(Number);
  if (!years.length) return null;
  const from = Math.min(...years);
  const to = Math.max(...years);
  return from === to ? `${from}` : `${from}-${to}`;
};
const sum = (rows, key) =>
  ["test", "odi", "t20"].reduce((s, f) => {
    const v = Number(rows?.[f]?.[key]);
    return Number.isFinite(v) ? s + v : s;
  }, 0);

const SECTIONS = [
  { key: "batting", label: "Batting" },
  { key: "bowling", label: "Bowling" },
  { key: "fielding", label: "Fielding" },
];

/* ---------- PAGE ---------- */

const PlayerProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [section, setSection] = useState("batting");

  useEffect(() => {
    apiGet(`/players/${id}`)
      .then(setData)
      .catch(setError);
  }, [id]);

  if (error) {
    return (
      <Page>
        <Header />
        <Container $max="1000px">
          <EmptyState icon="🧢" title="Player not found" text="We couldn't find this player." actionLabel="All players" actionTo="/players" />
        </Container>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Header />
        <Container $max="1000px">
          <Skeleton $h="120px" $r="22px" />
          <div style={{ height: 16 }} />
          <Skeleton $h="300px" $r="22px" />
        </Container>
      </Page>
    );
  }

  const runs = sum(data.batting, "runs");
  const wickets = sum(data.bowling, "wickets") || sum(data.bowling, "wkts");
  const matches = sum(data.batting, "matches") || sum(data.bowling, "matches");
  const span = careerSpan(data.batting, data.bowling, data.fielding);
  const rows = data[section];

  return (
    <Page>
      <Header />
      <Container $max="1000px">
        <Hero>
          <Avatar $size="72px" style={{ fontSize: "1.3rem" }}>
            {initials(data.player.name)}
          </Avatar>
          <div style={{ position: "relative" }}>
            <Eyebrow>{data.player.nationality || data.player.franchise || "Player profile"}</Eyebrow>
            <Title>{data.player.name}</Title>
            {span && <div style={{ color: "var(--muted)", marginTop: 4 }}>Career span {span}</div>}
          </div>
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <ButtonLink to="/players" $variant="ghost" $size="sm">
              All players
            </ButtonLink>
          </div>
        </Hero>

        <Highlights>
          <Stat>
            <div className="label">Matches</div>
            <div className="value">{matches ? matches.toLocaleString() : "—"}</div>
            <div className="sub">All formats</div>
          </Stat>
          <Stat>
            <div className="label">Runs</div>
            <div className="value">{runs ? runs.toLocaleString() : "—"}</div>
            <div className="sub">All formats</div>
          </Stat>
          <Stat>
            <div className="label">Wickets</div>
            <div className="value">{wickets ? wickets.toLocaleString() : "—"}</div>
            <div className="sub">All formats</div>
          </Stat>
        </Highlights>

        <div style={{ marginBottom: "1rem" }}>
          <Segmented items={SECTIONS} value={section} onChange={setSection} ariaLabel="Career section" />
        </div>

        <Panel>
          <PanelTitle>{SECTIONS.find((s) => s.key === section).label} career summary</PanelTitle>
          <TableScroll>
            <DataTable style={{ minWidth: 520 }}>
              <thead>
                <tr>
                  <th>Stat</th>
                  <th>Test</th>
                  <th>ODI</th>
                  <th>T20</th>
                </tr>
              </thead>
              <tbody>
                {buildRows(rows.test, rows.odi, rows.t20) || (
                  <tr>
                    <td colSpan={4} style={{ color: "var(--muted)" }}>
                      No {section} records.
                    </td>
                  </tr>
                )}
              </tbody>
            </DataTable>
          </TableScroll>
        </Panel>
      </Container>
    </Page>
  );
};

export default PlayerProfile;
