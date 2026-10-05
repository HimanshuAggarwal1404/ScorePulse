import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { Avatar, Button, Container, Grid, Muted, Page, PageHeader, SearchField, Skeleton } from "../ui/kit";
import { glass, initials, pressable } from "../ui/styles";

const PAGE_SIZE = 60;

const PlayerCard = styled(Link)`
  ${glass}
  ${pressable}
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-lg);
  color: var(--text);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
    }
  }
`;

const Name = styled.div`
  font-weight: 650;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  font-size: 0.76rem;
  color: var(--muted);
  margin-top: 1px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

const Players = () => {
  const [players, setPlayers] = useState(null);
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);
  // keep typing responsive while thousands of names are filtered
  const query = useDeferredValue(search);

  useEffect(() => {
    apiGet("/players")
      .then(setPlayers)
      .catch(() => setPlayers([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (players || []).filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [players, query]);

  return (
    <Page>
      <Header />
      <Container>
        <PageHeader
          eyebrow="Players"
          title="Players"
          subtitle={players ? `${players.length.toLocaleString()} players with career records across Tests, ODIs and T20s.` : " "}
        >
          <SearchField
            placeholder="Search players"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShown(PAGE_SIZE);
            }}
            aria-label="Search players"
          />
        </PageHeader>

        {players === null ? (
          <Grid $min="230px">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} $h="70px" $r="22px" />
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔎" title="No players found" text={`Nothing matches “${query}”. Try a surname, e.g. “Kohli”.`} />
        ) : (
          <>
            <Grid $min="230px">
              {filtered.slice(0, shown).map((p) => (
                <PlayerCard key={p.id} to={`/players/${p.id}`}>
                  <Avatar $subtle>{initials(p.name)}</Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Name>{p.name}</Name>
                    <Meta>{p.nationality || p.franchise || "Career stats"}</Meta>
                  </div>
                </PlayerCard>
              ))}
            </Grid>

            <Footer>
              <Muted>
                Showing {Math.min(shown, filtered.length).toLocaleString()} of {filtered.length.toLocaleString()}
              </Muted>
              {shown < filtered.length && (
                <Button $variant="ghost" onClick={() => setShown((s) => s + PAGE_SIZE * 2)}>
                  Show more
                </Button>
              )}
            </Footer>
          </>
        )}
      </Container>
    </Page>
  );
};

export default Players;
