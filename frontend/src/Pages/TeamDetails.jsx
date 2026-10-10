import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import PlayerCard from "../Components/PlayerCard";
import { apiGet } from "../api";
import { ButtonLink, Container, Glass, Grid, Page, SectionTitle, Skeleton, Tag, Title, Eyebrow } from "../ui/kit";
import { TeamLogo } from "../ui/players";
import { ROLES, caps, fmtNum, teamColor, topRanking, total } from "../ui/playerStats";

const Banner = styled(Glass)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  margin-bottom: 0.5rem;

  &::before {
    content: "";
    position: absolute;
    inset: -60% -10% auto auto;
    width: 55%;
    height: 220%;
    background: radial-gradient(closest-side, ${({ $color }) => `color-mix(in srgb, ${$color} 24%, transparent)`}, transparent);
    pointer-events: none;
  }
  > * {
    position: relative;
  }
`;

const Numbers = styled.div`
  display: flex;
  gap: 1.75rem;
  margin-left: auto;
  flex-wrap: wrap;

  b {
    display: block;
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  small {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
`;

const Squad = ({ teamId }) => {
  const [players, setPlayers] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    apiGet(`/players?team=${teamId}`)
      .then((data) => setPlayers(data.players || []))
      .catch(() => setPlayers([]));
    apiGet("/teams")
      .then((data) => setTeams(data.teams || []))
      .catch(() => {});
  }, [teamId]);

  const teamsById = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);
  const team = teamsById[teamId];
  const isIpl = team?.type === "franchise";
  const formats = isIpl ? ["IPL"] : ["TEST", "ODI", "T20I"];

  const groups = ROLES.map((r) => ({
    ...r,
    list: (players || []).filter((p) => p.role === r.key).sort((a, b) => caps(b, formats) - caps(a, formats)),
  }));
  const unknown = (players || []).filter((p) => !ROLES.some((r) => r.key === p.role));
  if (unknown.length) groups.push({ key: "other", label: "Squad", list: unknown });

  const overseas = isIpl ? (players || []).filter((p) => p.country && p.country !== "India").length : null;

  return (
    <Page>
      <Header />
      <Container $max="1180px">
        <Banner $color={teamColor(team?.short_code)}>
          {team && <TeamLogo src={team.logo} code={team.short_code} size={team.type === "franchise" ? 72 : 52} crest={team.type === "franchise"} label={team.name} />}
          <div>
            <Eyebrow>{team ? `${team.type === "franchise" ? "IPL franchise" : team.type} squad` : "Squad"}</Eyebrow>
            <Title>{team ? team.name : "Squad"}</Title>
          </div>
          {players?.length > 0 && (
            <Numbers>
              <div>
                <b>{players.length}</b>
                <small>Players</small>
              </div>
              {isIpl ? (
                <div>
                  <b>{overseas}</b>
                  <small>Overseas</small>
                </div>
              ) : (
                <div>
                  <b>{fmtNum(players.reduce((s, p) => s + caps(p), 0))}</b>
                  <small>Combined caps</small>
                </div>
              )}
              <div>
                <b>{fmtNum(players.reduce((s, p) => s + total(p.bat, "r", formats), 0))}</b>
                <small>{isIpl ? "IPL runs" : "Intl runs"}</small>
              </div>
              <div>
                <b>{fmtNum(players.reduce((s, p) => s + total(p.bowl, "w", formats), 0))}</b>
                <small>{isIpl ? "IPL wickets" : "Intl wickets"}</small>
              </div>
            </Numbers>
          )}
        </Banner>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", margin: "0.75rem 0 0" }}>
          <ButtonLink to={`/players?team=${teamId}`} $variant="ghost" $size="sm">
            Filter in players
          </ButtonLink>
          <ButtonLink to="/teams" $variant="ghost" $size="sm">
            All teams
          </ButtonLink>
        </div>

        {players === null && (
          <Grid $min="290px" style={{ marginTop: "2rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} $h="150px" $r="22px" />
            ))}
          </Grid>
        )}

        {players?.length === 0 && (
          <EmptyState icon="👥" title="No squad yet" text="This team's squad hasn't been added." actionLabel="All teams" actionTo="/teams" />
        )}

        {groups
          .filter((g) => g.list.length)
          .map(({ key, label, list }) => (
            <section key={key}>
              <SectionTitle>
                {label} <Tag $tone="muted">{list.length}</Tag>
              </SectionTitle>
              <Grid $min="290px">
                {list.map((p) => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    teamsById={teamsById}
                    ipl={isIpl}
                    rank={topRanking(p.rankings)?.rank <= 10 ? topRanking(p.rankings) : null}
                  />
                ))}
              </Grid>
            </section>
          ))}
      </Container>
    </Page>
  );
};

const TeamDetails = () => {
  const { teamId } = useParams();
  return <Squad key={teamId} teamId={teamId} />;
};

export default TeamDetails;
