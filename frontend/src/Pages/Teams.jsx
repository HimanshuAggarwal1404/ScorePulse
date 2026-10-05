import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import { apiGet } from "../api";
import { Container, Grid, Page, PageHeader, SearchField, SectionTitle, Skeleton, Tag } from "../ui/kit";
import { glass, pressable } from "../ui/styles";

const TeamCard = styled(Link)`
  ${glass}
  ${pressable}
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
    }
    &:hover .mono {
      background: var(--accent);
      color: var(--accent-ink);
      box-shadow: var(--glow);
    }
  }
`;

const Mono = styled.span`
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  background: var(--solid-2);
  color: var(--text);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  transition: background-color var(--quick) var(--ease), color var(--quick) var(--ease), box-shadow var(--quick) var(--ease);
`;

const Name = styled.div`
  font-weight: 650;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  line-height: 1.25;
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 2px;
`;

const SECTIONS = [
  { key: "international", title: "International" },
  { key: "franchise", title: "Franchise" },
  { key: "domestic", title: "Domestic" },
];

const Teams = () => {
  const [teams, setTeams] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet("/teams")
      .then((data) => setTeams(data.teams || []))
      .catch(() => setTeams([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (teams || []).filter((t) => !q || t.name.toLowerCase().includes(q) || t.short_code.toLowerCase().includes(q));
  }, [teams, query]);

  return (
    <Page>
      <Header />
      <Container>
        <PageHeader eyebrow="Teams" title="Teams" subtitle="International sides, franchises and domestic teams.">
          <SearchField placeholder="Search teams" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search teams" />
        </PageHeader>

        {teams === null && (
          <Grid $min="230px">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} $h="76px" $r="22px" />
            ))}
          </Grid>
        )}

        {SECTIONS.map(({ key, title }) => {
          const list = filtered.filter((t) => t.type === key);
          if (!list.length) return null;
          return (
            <section key={key}>
              <SectionTitle>
                {title} <Tag $tone="muted">{list.length}</Tag>
              </SectionTitle>
              <Grid $min="230px">
                {list.map((team) => (
                  <TeamCard key={team.id} to={`/teams/${team.id}`}>
                    <Mono className="mono">{team.short_code}</Mono>
                    <div>
                      <Name>{team.name}</Name>
                      <Meta>View squad</Meta>
                    </div>
                  </TeamCard>
                ))}
              </Grid>
            </section>
          );
        })}
      </Container>
    </Page>
  );
};

export default Teams;
