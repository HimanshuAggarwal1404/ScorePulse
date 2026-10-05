import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { Avatar, ButtonLink, Container, Grid, Page, PageHeader, SectionTitle, Skeleton, Tag } from "../ui/kit";
import { glass, initials } from "../ui/styles";

const PlayerCard = styled.div`
  ${glass}
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-lg);
`;

const Name = styled.div`
  font-weight: 650;
  letter-spacing: -0.01em;
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 2px;
  line-height: 1.4;
`;

const ROLE_ORDER = ["batsman", "wk", "allrounder", "bowler"];
const ROLE_TITLES = {
  batsman: "Batters",
  wk: "Wicketkeepers",
  allrounder: "All-rounders",
  bowler: "Bowlers",
};

const TeamDetails = () => {
  const { teamId } = useParams();
  const [players, setPlayers] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    apiGet(`/teams/${teamId}/players`)
      .then((data) => setPlayers(data.players || []))
      .catch(() => setPlayers([]));
    apiGet("/teams")
      .then((data) => setTeam((data.teams || []).find((t) => String(t.id) === String(teamId)) || null))
      .catch(() => {});
  }, [teamId]);

  const groups = ROLE_ORDER.map((role) => ({
    role,
    list: (players || []).filter((p) => (p.role || "").toLowerCase() === role),
  })).filter((g) => g.list.length);

  return (
    <Page>
      <Header />
      <Container $max="1000px">
        <PageHeader
          eyebrow={team ? `${team.type} · ${team.short_code}` : "Squad"}
          title={team ? team.name : "Squad"}
          subtitle={players ? `${players.length} players in the current squad` : " "}
        >
          <ButtonLink to="/teams" $variant="ghost" $size="sm">
            All teams
          </ButtonLink>
        </PageHeader>

        {players === null && (
          <Grid $min="260px">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} $h="72px" $r="22px" />
            ))}
          </Grid>
        )}

        {players?.length === 0 && (
          <EmptyState icon="👥" title="No squad yet" text="This team's squad hasn't been added." actionLabel="All teams" actionTo="/teams" />
        )}

        {groups.map(({ role, list }) => (
          <section key={role}>
            <SectionTitle>
              {ROLE_TITLES[role]} <Tag $tone="muted">{list.length}</Tag>
            </SectionTitle>
            <Grid $min="260px">
              {list.map((player) => (
                <PlayerCard key={player.id}>
                  <Avatar $subtle>{initials(player.name)}</Avatar>
                  <div>
                    <Name>{player.name}</Name>
                    <Meta>{[player.batting_style, player.bowling_style].filter(Boolean).join(" · ") || player.country}</Meta>
                  </div>
                </PlayerCard>
              ))}
            </Grid>
          </section>
        ))}
      </Container>
    </Page>
  );
};

export default TeamDetails;
