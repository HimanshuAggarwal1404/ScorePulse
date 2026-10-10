import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import PlayerCard from "../Components/PlayerCard";
import { apiGet } from "../api";
import { Button, Container, Glass, Grid, Muted, Page, PageHeader, SearchField, Segmented, SectionTitle, Skeleton, Tag } from "../ui/kit";
import { glass, pressable } from "../ui/styles";
import { PlayerPhoto, TeamMono } from "../ui/players";
import { ROLES, caps, fmtNum, topRanking, total } from "../ui/playerStats";

const PAGE_SIZE = 48;

/* ---------- SPOTLIGHT ---------- */

const Spotlight = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Board = styled(Glass)`
  padding: 1rem 1rem 0.5rem;

  h3 {
    font-size: 0.72rem;
    font-weight: 750;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.6rem;
  }
`;

const BoardRow = styled(Link)`
  display: grid;
  grid-template-columns: 1.1rem auto 1fr auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.35rem;
  margin: 0 -0.35rem;
  border-radius: 12px;
  color: var(--text);
  text-decoration: none;
  transition: background-color var(--quick) var(--ease);

  @media (hover: hover) {
    &:hover {
      background: var(--hover);
    }
  }
  .pos {
    font-size: 0.75rem;
    font-weight: 750;
    color: var(--muted);
    text-align: center;
  }
  .name {
    font-weight: 650;
    font-size: 0.88rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub {
    font-size: 0.72rem;
    color: var(--muted);
  }
  .val {
    font-family: var(--font-display);
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }
  &:first-of-type .val {
    color: var(--accent);
  }
`;

/* ---------- FILTERS ---------- */

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Line = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
`;

const TeamStrip = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: thin;
`;

const TeamChip = styled.button`
  ${glass}
  ${pressable}
  box-shadow: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex: none;
  padding: 0.3rem 0.8rem 0.3rem 0.3rem;
  border-radius: var(--radius-pill);
  font-size: 0.84rem;
  font-weight: 650;
  color: var(--text);
  border-color: ${({ $active }) => ($active ? "var(--accent-line)" : "var(--border)")};
  background: ${({ $active }) => ($active ? "var(--accent-soft)" : "var(--glass)")};
`;

const Chip = styled.button`
  ${pressable}
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "var(--border)")};
  background: ${({ $active }) => ($active ? "var(--accent)" : "var(--hover)")};
  color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text-2)")};
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-pill);
  font-size: 0.82rem;
  font-weight: 650;

  span {
    opacity: 0.65;
    margin-left: 0.3rem;
  }
`;

const SortSelect = styled.select`
  ${glass}
  box-shadow: none;
  height: 2.6rem;
  padding: 0 0.9rem;
  border-radius: var(--radius-pill);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text);
  outline: none;
  cursor: pointer;

  option {
    background: var(--solid);
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
`;

/* ---------- DATA ---------- */

const GROUPS = [
  { key: "all", label: "All teams" },
  { key: "international", label: "International" },
  { key: "franchise", label: "IPL" },
  { key: "domestic", label: "Domestic" },
];

const SORTS = {
  featured: { label: "Most capped", fn: (a, b) => caps(b) - caps(a) || caps(b, ["IPL"]) - caps(a, ["IPL"]) || a.name.localeCompare(b.name) },
  runs: { label: "Most runs", fn: (a, b) => total(b.bat, "r", ALL) - total(a.bat, "r", ALL) },
  wickets: { label: "Most wickets", fn: (a, b) => total(b.bowl, "w", ALL) - total(a.bowl, "w", ALL) },
  ranking: { label: "ICC ranking", fn: (a, b) => (topRanking(a.rankings)?.rank ?? 999) - (topRanking(b.rankings)?.rank ?? 999) },
  name: { label: "Name (A-Z)", fn: (a, b) => a.name.localeCompare(b.name) },
  youngest: { label: "Youngest", fn: (a, b) => String(b.date_of_birth || "").localeCompare(String(a.date_of_birth || "")) },
};
const ALL = ["TEST", "ODI", "T20I", "IPL"];

const leaders = (players, value, sub) =>
  players
    .map((p) => ({ p, v: value(p) }))
    .filter((x) => x.v)
    .sort((a, b) => b.v - a.v)
    .slice(0, 5)
    .map((x) => ({ ...x, sub: sub?.(x.p) }));

const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/* ---------- PAGE ---------- */

const Players = () => {
  const [players, setPlayers] = useState(null);
  const [teams, setTeams] = useState([]);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [shown, setShown] = useState(PAGE_SIZE);
  const query = useDeferredValue(search);

  const teamId = params.get("team") ? Number(params.get("team")) : null;
  const role = params.get("role") || "all";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "featured";
  const [groupChoice, setGroup] = useState("all");

  useEffect(() => {
    apiGet("/players")
      .then((d) => setPlayers(d.players || []))
      .catch(() => setPlayers([]));
    apiGet("/teams")
      .then((d) => setTeams(d.teams || []))
      .catch(() => {});
  }, []);

  const teamsById = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);
  const team = teamId ? teamsById[teamId] : null;
  // a picked team (also via ?team=) keeps its group's tab open
  const group = team ? team.type : groupChoice;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === null || value === undefined || value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
    setShown(PAGE_SIZE);
  };

  // teams that actually have players, so empty clubs don't clutter the strip
  const squadTeams = useMemo(() => {
    const counts = new Map();
    for (const p of players || []) for (const id of p.team_ids) counts.set(id, (counts.get(id) || 0) + 1);
    return teams.filter((t) => counts.has(t.id)).map((t) => ({ ...t, count: counts.get(t.id) }));
  }, [players, teams]);

  const inTeam = useMemo(() => {
    const list = players || [];
    if (teamId) return list.filter((p) => p.team_ids.includes(teamId));
    if (group === "all") return list;
    const ids = new Set(squadTeams.filter((t) => t.type === group).map((t) => t.id));
    return list.filter((p) => p.team_ids.some((id) => ids.has(id)));
  }, [players, teamId, group, squadTeams]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return inTeam
      .filter((p) => role === "all" || p.role === role)
      .filter((p) => !q || normalize(p.name).includes(q) || normalize(p.country).includes(q))
      .sort(SORTS[sort].fn);
  }, [inTeam, role, query, sort]);

  const roleCounts = useMemo(() => {
    const c = {};
    for (const p of inTeam) c[p.role] = (c[p.role] || 0) + 1;
    return c;
  }, [inTeam]);

  const boards = useMemo(() => {
    const list = players || [];
    const ranked = list
      .map((p) => ({ p, r: topRanking(p.rankings) }))
      .filter((x) => x.r && x.r.rank <= 3)
      .sort((a, b) => a.r.rank - b.r.rank)
      .slice(0, 5);
    return [
      { title: "Most international runs", rows: leaders(list, (p) => total(p.bat, "r"), (p) => `${fmtNum(caps(p))} matches`) },
      { title: "Most international wickets", rows: leaders(list, (p) => total(p.bowl, "w"), (p) => `${fmtNum(caps(p))} matches`) },
      { title: "IPL run machines", rows: leaders(list, (p) => total(p.bat, "r", ["IPL"]), (p) => `SR ${p.bat?.IPL?.sr ?? "—"}`) },
      { title: "ICC top-ranked", rows: ranked.map(({ p, r }) => ({ p, v: `#${r.rank}`, sub: r.label })) },
    ].filter((b) => b.rows.length);
  }, [players]);

  const filtering = teamId || role !== "all" || query.trim() || group !== "all";
  const groupTeams = squadTeams.filter((t) => t.type === group);

  return (
    <Page>
      <Header />
      <Container>
        <PageHeader
          eyebrow="Players"
          title={team ? team.name : "Players"}
          subtitle={
            players
              ? team
                ? `${inTeam.length} players in the current squad.`
                : `${players.length.toLocaleString()} cricketers across ${squadTeams.length} teams, with career records in Tests, ODIs, T20Is and the IPL.`
              : " "
          }
        >
          <SearchField
            placeholder="Search players or countries"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setParam("q", e.target.value);
            }}
            aria-label="Search players"
          />
        </PageHeader>

        {players === null ? (
          <>
            <Spotlight>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} $h="250px" $r="22px" />
              ))}
            </Spotlight>
            <Grid $min="290px">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} $h="150px" $r="22px" />
              ))}
            </Grid>
          </>
        ) : (
          <>
            {!filtering && boards.length > 0 && (
              <Spotlight>
                {boards.map((b) => (
                  <Board key={b.title}>
                    <h3>{b.title}</h3>
                    {b.rows.map(({ p, v, sub }, i) => (
                      <BoardRow key={p.id} to={`/players/${p.id}`}>
                        <span className="pos">{i + 1}</span>
                        <PlayerPhoto src={p.image_url} name={p.name} code={teamsById[p.country_team_id]?.short_code} size={34} />
                        <div style={{ minWidth: 0 }}>
                          <div className="name">{p.name}</div>
                          <div className="sub">{sub}</div>
                        </div>
                        <span className="val">{typeof v === "number" ? v.toLocaleString() : v}</span>
                      </BoardRow>
                    ))}
                  </Board>
                ))}
              </Spotlight>
            )}

            <Filters>
              <Line style={{ justifyContent: "space-between" }}>
                <Segmented
                  items={GROUPS}
                  value={group}
                  onChange={(g) => {
                    setGroup(g);
                    setParam("team", null);
                  }}
                  ariaLabel="Team group"
                />
                <SortSelect value={sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)} aria-label="Sort players">
                  {Object.entries(SORTS).map(([k, s]) => (
                    <option key={k} value={k}>
                      {s.label}
                    </option>
                  ))}
                </SortSelect>
              </Line>

              {group !== "all" && groupTeams.length > 0 && (
                <TeamStrip>
                  {groupTeams.map((t) => (
                    <TeamChip key={t.id} $active={t.id === teamId} onClick={() => setParam("team", t.id === teamId ? null : t.id)}>
                      <TeamMono $code={t.short_code} $size="1.75rem" $small>
                        {t.short_code}
                      </TeamMono>
                      {t.name}
                      <Muted $size="0.76rem">{t.count}</Muted>
                    </TeamChip>
                  ))}
                </TeamStrip>
              )}

              <Line>
                <Chip $active={role === "all"} onClick={() => setParam("role", null)}>
                  All roles<span>{inTeam.length}</span>
                </Chip>
                {ROLES.map((r) => (
                  <Chip key={r.key} $active={role === r.key} onClick={() => setParam("role", r.key)}>
                    {r.label}
                    <span>{roleCounts[r.key] || 0}</span>
                  </Chip>
                ))}
                {team && (
                  <Link to={`/teams/${team.id}`} style={{ marginLeft: "auto", color: "var(--accent)", fontWeight: 650, fontSize: "0.86rem", textDecoration: "none" }}>
                    {team.name} squad page →
                  </Link>
                )}
              </Line>
            </Filters>

            {filtered.length === 0 ? (
              <EmptyState
                icon="🔎"
                title="No players found"
                text={query ? `Nothing matches “${query}”. Try a surname, e.g. “Kohli”.` : "No players match these filters."}
              />
            ) : (
              <>
                {filtering && (
                  <SectionTitle $flush style={{ marginBottom: "1rem" }}>
                    {team ? team.name : GROUPS.find((g) => g.key === group).label}
                    <Tag $tone="muted">{filtered.length}</Tag>
                  </SectionTitle>
                )}
                <Grid $min="290px">
                  {filtered.slice(0, shown).map((p) => (
                    <PlayerCard key={p.id} player={p} teamsById={teamsById} ipl={group === "franchise"} rank={topRanking(p.rankings)?.rank <= 10 ? topRanking(p.rankings) : null} />
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
                  <Muted $size="0.74rem">Profiles and records: Cricbuzz · Fielding: ESPNcricinfo Statsguru</Muted>
                </Footer>
              </>
            )}
          </>
        )}
      </Container>
    </Page>
  );
};

export default Players;
