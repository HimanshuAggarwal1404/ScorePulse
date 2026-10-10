import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { Container, Grid, Page, PageHeader, SearchField, SectionTitle, Skeleton, Tag } from "../ui/kit";
import { glass, pressable } from "../ui/styles";
import { PlayerPhoto, TeamLogo } from "../ui/players";
import { teamColor } from "../ui/playerStats";

/* ---------- SHARED ---------- */

const tint = (code, pct) => `color-mix(in srgb, ${teamColor(code)} ${pct}%, transparent)`;

const CardLink = styled(Link)`
  ${glass}
  ${pressable}
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  color: var(--text);
  text-decoration: none;

  @media (hover: hover) {
    &:hover {
      border-color: ${({ $code }) => tint($code, 50)};
      box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow), 0 0 0 1px ${({ $code }) => tint($code, 25)};
    }
    &:hover .arrow {
      transform: translateX(3px);
      color: ${({ $code }) => teamColor($code)};
    }
  }
`;

const Arrow = styled.span.attrs({ className: "arrow", "aria-hidden": true, children: "→" })`
  margin-left: auto;
  color: var(--muted);
  font-weight: 700;
  transition: transform var(--quick) var(--ease), color var(--quick) var(--ease);
`;

const Name = styled.div`
  font-weight: 750;
  font-size: 1.08rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const Sub = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 3px;
`;

const FacesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.76rem;
  color: var(--muted);

  .stack {
    display: flex;
  }
  .stack > * + * {
    margin-left: -10px;
  }
`;

// A few familiar faces from the squad, overlapping.
const Faces = ({ team }) => {
  if (!team.faces?.length) return <FacesRow>{team.player_count ? `${team.player_count} players` : "Squad not added yet"}</FacesRow>;
  const names = team.faces.slice(0, 2).map((f) => f.name.split(" ").pop());
  const others = team.player_count - names.length;
  return (
    <FacesRow>
      <span className="stack">
        {team.faces.map((f) => (
          <PlayerPhoto key={f.id} src={f.image_url} name={f.name} code={team.short_code} size={30} />
        ))}
      </span>
      <span>
        {names.join(", ")}
        {others > 0 && ` & ${others} more`}
      </span>
    </FacesRow>
  );
};

/* ---------- INTERNATIONAL ---------- */

const NationCard = styled(CardLink)`
  padding: 1.15rem 1.15rem 1rem;
  gap: 1rem;

  &::before {
    content: "";
    position: absolute;
    inset: -50% -20% auto auto;
    width: 70%;
    height: 160%;
    background: radial-gradient(closest-side, ${({ $code }) => tint($code, 18)}, transparent);
    pointer-events: none;
  }
  > * {
    position: relative;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 0.95rem;
`;

const Ranks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem;
`;

const RankPill = styled.div`
  padding: 0.45rem 0.55rem;
  border-radius: 12px;
  background: var(--hover);
  border: 1px solid ${({ $top }) => ($top ? "var(--accent-line)" : "var(--border)")};
  text-align: center;

  small {
    display: block;
    font-size: 0.6rem;
    font-weight: 750;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  b {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${({ $top }) => ($top ? "var(--accent)" : "var(--text)")};
  }
`;

const RANK_FORMATS = [
  ["TEST", "Test"],
  ["ODI", "ODI"],
  ["T20I", "T20I"],
];

/* ---------- FRANCHISE ---------- */

const FranchiseCard = styled(CardLink)``;

const Band = styled.div`
  position: relative;
  height: 108px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(closest-side at 50% 60%, ${({ $code }) => tint($code, 45)}, transparent 85%),
    linear-gradient(160deg, ${({ $code }) => tint($code, 28)}, ${({ $code }) => tint($code, 6)});
  border-bottom: 1px solid ${({ $code }) => tint($code, 30)};

  .code {
    position: absolute;
    top: 0.65rem;
    left: 0.8rem;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: ${({ $code }) => teamColor($code)};
  }
`;

const FranchiseBody = styled.div`
  padding: 0.9rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

/* ---------- DOMESTIC ---------- */

const DomesticRow = styled(CardLink)`
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 0.95rem;
`;

/* ---------- PAGE ---------- */

const SECTIONS = [
  { key: "international", title: "International", sub: "Full members and associates with squads on ScorePulse" },
  { key: "franchise", title: "IPL franchises", sub: "2026 squads" },
  { key: "domestic", title: "Domestic", sub: "State, provincial and club sides from scored matches" },
];

const Teams = () => {
  const [teams, setTeams] = useState(null);
  const [ranks, setRanks] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiGet("/teams")
      .then((data) => setTeams(data.teams || []))
      .catch(() => setTeams([]));
    // current ICC positions for the international cards: { teamId: { TEST: 1, ODI: 4 } }
    apiGet("/rankings")
      .then((d) => {
        const out = {};
        for (const [format, list] of Object.entries(d.rankings?.teams || {})) {
          for (const r of list) if (r.teamId) (out[r.teamId] ||= {})[format] = r.rank;
        }
        setRanks(out);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (teams || []).filter((t) => !q || t.name.toLowerCase().includes(q) || t.short_code.toLowerCase().includes(q));
  }, [teams, query]);

  // best-ranked sides first, then alphabetical
  const order = (t) => Math.min(...RANK_FORMATS.map(([f]) => ranks[t.id]?.[f] ?? 99));

  return (
    <Page>
      <Header />
      <Container>
        <PageHeader
          eyebrow="Teams"
          title="Teams"
          subtitle={
            teams
              ? `${teams.filter((t) => t.type === "international").length} international sides, ${teams.filter((t) => t.type === "franchise").length} IPL franchises and ${teams.filter((t) => t.type === "domestic").length} domestic teams.`
              : " "
          }
        >
          <SearchField placeholder="Search teams" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search teams" />
        </PageHeader>

        {teams === null && (
          <Grid $min="300px">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} $h="190px" $r="22px" />
            ))}
          </Grid>
        )}

        {teams && filtered.length === 0 && <EmptyState icon="🔎" title="No teams found" text={`Nothing matches “${query}”.`} />}

        {SECTIONS.map(({ key, title, sub }) => {
          const list = filtered.filter((t) => t.type === key);
          if (!list.length) return null;
          return (
            <section key={key}>
              <SectionTitle>
                {title} <Tag $tone="muted">{list.length}</Tag>
                <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", marginLeft: "0.25rem" }}>{sub}</span>
              </SectionTitle>

              {key === "international" && (
                <Grid $min="300px">
                  {[...list]
                    .sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name))
                    .map((t) => (
                      <NationCard key={t.id} to={`/teams/${t.id}`} $code={t.short_code}>
                        <Top>
                          <TeamLogo src={t.logo} code={t.short_code} size={46} label={t.name} />
                          <div>
                            <Name>{t.name}</Name>
                            <Sub>
                              {t.short_code} · {t.player_count} players
                            </Sub>
                          </div>
                          <Arrow />
                        </Top>
                        <Ranks aria-label="ICC rankings">
                          {RANK_FORMATS.map(([f, label]) => {
                            const r = ranks[t.id]?.[f];
                            return (
                              <RankPill key={f} $top={r && r <= 3}>
                                <small>{label}</small>
                                <b>{r ? `#${r}` : "—"}</b>
                              </RankPill>
                            );
                          })}
                        </Ranks>
                        <Faces team={t} />
                      </NationCard>
                    ))}
                </Grid>
              )}

              {key === "franchise" && (
                <Grid $min="250px">
                  {list.map((t) => (
                    <FranchiseCard key={t.id} to={`/teams/${t.id}`} $code={t.short_code}>
                      <Band $code={t.short_code}>
                        <span className="code">{t.short_code}</span>
                        <TeamLogo src={t.logo} code={t.short_code} size={78} crest label={t.name} />
                      </Band>
                      <FranchiseBody>
                        <Top>
                          <div>
                            <Name>{t.name}</Name>
                            <Sub>{t.player_count} players</Sub>
                          </div>
                          <Arrow />
                        </Top>
                        <Faces team={t} />
                      </FranchiseBody>
                    </FranchiseCard>
                  ))}
                </Grid>
              )}

              {key === "domestic" && (
                <Grid $min="280px" $gap="0.75rem">
                  {list.map((t) => (
                    <DomesticRow key={t.id} to={`/teams/${t.id}`} $code={t.short_code}>
                      <TeamLogo src={t.logo} code={t.short_code} size={34} label={t.name} />
                      <div style={{ minWidth: 0 }}>
                        <Name style={{ fontSize: "0.92rem" }}>{t.name}</Name>
                        <Sub>{t.player_count ? `${t.player_count} players` : "No squad yet"}</Sub>
                      </div>
                      <Arrow />
                    </DomesticRow>
                  ))}
                </Grid>
              )}
            </section>
          );
        })}
      </Container>
    </Page>
  );
};

export default Teams;
