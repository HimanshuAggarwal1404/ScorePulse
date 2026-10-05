import React from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { useMatchList } from "../hooks/useMatchList";
import { formatDate, scoreText } from "../Components/match/theme";
import { Container, LiveDot, Page, PageHeader, Segmented, Skeleton, StickyBar } from "../ui/kit";
import { glass } from "../ui/styles";

/* ---------- STYLES ---------- */

const SeriesBlock = styled.section`
  ${glass}
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1rem;
`;

const SeriesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  border-bottom: 1px solid var(--border);

  span {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
  }
`;

const MatchRow = styled(Link)`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: background-color var(--quick) var(--ease);

  &:last-child {
    border-bottom: none;
  }
  &:active {
    background: var(--hover);
  }
  @media (hover: hover) {
    &:hover {
      background: var(--hover);
    }
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`;

const Sides = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const Side = styled.div`
  display: grid;
  grid-template-columns: 2.4rem 1fr auto;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: ${({ $strong }) => ($strong ? 700 : 550)};
  opacity: ${({ $dim }) => ($dim ? 0.6 : 1)};

  .short {
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-align: center;
    padding: 0.2rem 0;
    border-radius: 7px;
    background: var(--solid-2);
    color: var(--text-2);
  }
  .score {
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: -0.015em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  text-align: right;
  min-width: 220px;

  @media (max-width: 720px) {
    align-items: flex-start;
    text-align: left;
    min-width: 0;
  }
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 650;
  color: ${({ $live }) => ($live ? "var(--live)" : "var(--accent)")};
`;

/* ---------- HELPERS ---------- */

// old links used past / current / future
const CATEGORY_ALIASES = { past: "completed", current: "live", future: "upcoming" };

const TABS = [
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Results" },
];

const EMPTY = {
  live: { title: "Nothing live right now", text: "There are no matches in play at the moment." },
  upcoming: { title: "No fixtures yet", text: "No upcoming matches have been scheduled." },
  completed: { title: "No results yet", text: "Finished matches will appear here." },
};

const groupBySeries = (matches) => {
  const groups = new Map();
  for (const m of matches) {
    const key = m.series || "Other matches";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  return [...groups.entries()].map(([series, list]) => ({ series, matches: list }));
};

const sideScore = (side) =>
  side.innings.length
    ? side.innings.map((i) => `${scoreText(i)}${side.innings.length === 1 ? ` (${i.overs})` : ""}`).join(" & ")
    : "";

/* ---------- PAGE ---------- */

const Fixtures = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("type") || "live";
  const category = CATEGORY_ALIASES[raw] || raw;
  const { matches } = useMatchList(`/matches?status=${category}&limit=100`);
  const seriesList = groupBySeries(matches || []);
  const isEmpty = matches !== null && seriesList.length === 0;

  return (
    <Page>
      <Header />

      <Container $max="1080px">
        <PageHeader eyebrow="Matches" title="Fixtures & results" subtitle="Every match, grouped by series. Live scores update by themselves." />

        <StickyBar>
          <Segmented items={TABS} value={category} onChange={(key) => setSearchParams({ type: key })} ariaLabel="Match status" />
        </StickyBar>

        {matches === null && (
          <>
            <Skeleton $h="180px" $r="22px" />
            <div style={{ height: 16 }} />
            <Skeleton $h="120px" $r="22px" />
          </>
        )}

        {isEmpty && (
          <EmptyState
            icon="📅"
            title={EMPTY[category].title}
            text={EMPTY[category].text}
            actionLabel={category === "completed" ? "See live matches" : "See results"}
            actionTo={category === "completed" ? "/fixtures?type=live" : "/fixtures?type=completed"}
          />
        )}

        {seriesList.map((series) => (
          <SeriesBlock key={series.series}>
            <SeriesHeader>
              {series.series}
              <span>
                {series.matches.length} match{series.matches.length === 1 ? "" : "es"}
              </span>
            </SeriesHeader>

            {series.matches.map((m) => {
              const batting = [m.team1, m.team2].find((s) => s.innings.some((i) => i.batting));
              return (
                <MatchRow key={m.id} to={`/match/${m.id}`}>
                  <Sides>
                    {[m.team1, m.team2].map((side) => (
                      <Side
                        key={side.id}
                        $strong={m.winnerId === side.id || batting?.id === side.id}
                        $dim={(m.winnerId && m.winnerId !== side.id) || (batting && batting.id !== side.id)}
                      >
                        <span className="short">{side.short}</span>
                        <span>{side.name}</span>
                        <span className="score">{sideScore(side)}</span>
                      </Side>
                    ))}
                  </Sides>

                  <Info>
                    <Meta>
                      {[m.title, m.title?.includes(m.formatLabel) ? null : m.formatLabel, m.venue?.name, formatDate(m.startDate)]
                        .filter(Boolean)
                        .join(" · ")}
                    </Meta>
                    <Status $live={m.isLive}>
                      {m.isLive && <LiveDot style={{ marginRight: 6 }} />}
                      {m.statusText}
                    </Status>
                  </Info>
                </MatchRow>
              );
            })}
          </SeriesBlock>
        ))}
      </Container>
    </Page>
  );
};

export default Fixtures;
