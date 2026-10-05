import React from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { Container, Page, PageHeader, Segmented, StickyBar, Tag } from "../ui/kit";
import { glass, pressable } from "../ui/styles";

/* ---------- STYLES ---------- */

const List = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Card = styled(Link)`
  ${glass}
  ${pressable}
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
    }
  }
`;

const Icon = styled.span`
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 1.3rem;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.012em;
`;

const Meta = styled.div`
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 2px;
`;

const Result = styled.div`
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--accent);
  margin-top: 4px;
`;

const Chevron = styled.span`
  margin-left: auto;
  color: var(--muted);
  font-size: 1.2rem;
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

const TABS = [
  { key: "active", label: "Active" },
  { key: "future", label: "Upcoming" },
  { key: "past", label: "Archive" },
];

/* ---------- PAGE ---------- */

const Tournaments = () => {
  const [params, setParams] = useSearchParams();
  const tab = params.get("type") || "active";
  const list = tournamentsData[tab] || [];

  const linkFor = (item) => (item.type === "TOURNAMENT" ? `/tournament/${item.id}/points` : `/series/${item.id}`);

  return (
    <Page>
      <Header />

      <Container $max="1000px">
        <PageHeader eyebrow="Competitions" title="Tournaments & series" />

        <StickyBar>
          <Segmented items={TABS} value={tab} onChange={(key) => setParams({ type: key })} ariaLabel="Competition status" />
        </StickyBar>

        {list.length === 0 ? (
          <EmptyState icon="🏆" title="Nothing here yet" text="No competitions in this section." />
        ) : (
          <List>
            {list.map((item) => (
              <Card key={item.id} to={linkFor(item)}>
                <Icon aria-hidden>{item.type === "TOURNAMENT" ? "🏆" : "🏏"}</Icon>
                <div>
                  <Name>{item.name}</Name>
                  <Meta>{item.date}</Meta>
                  {item.result && <Result>{item.result}</Result>}
                </div>
                <Tag $tone={item.type === "TOURNAMENT" ? undefined : "muted"} style={{ marginLeft: "auto" }}>
                  {item.type === "TOURNAMENT" ? "Tournament" : "Series"}
                </Tag>
                <Chevron aria-hidden>›</Chevron>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </Page>
  );
};

export default Tournaments;
