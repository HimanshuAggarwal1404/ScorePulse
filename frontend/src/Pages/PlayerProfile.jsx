import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { ButtonLink, Container, DataTable, Eyebrow, Glass, Page, Segmented, Skeleton, TableScroll, Tag, Title } from "../ui/kit";
import { PlayerPhoto, TeamMono } from "../ui/players";
import { FORMATS, age, fmtDec, fmtNum, longDate, rankingList, roleLabel, teamColor } from "../ui/playerStats";
import { formatDate } from "../Components/match/theme";

/* ---------- LAYOUT ---------- */

const Hero = styled(Glass)`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.75rem;
  margin-bottom: 1.25rem;

  &::before {
    content: "";
    position: absolute;
    inset: -60% auto auto -15%;
    width: 60%;
    height: 220%;
    background: radial-gradient(closest-side, ${({ $color }) => `color-mix(in srgb, ${$color} 22%, transparent)`}, transparent);
    pointer-events: none;
  }

  > * {
    position: relative;
  }

  @media (max-width: 760px) {
    grid-template-columns: auto 1fr;
    .ranks {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 1.25rem;
  }
`;

const Facts = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin-top: 0.9rem;

  div {
    min-width: 0;
  }
  dt {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  dd {
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: 2px;
  }
`;

const Ranks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
  min-width: 170px;

  @media (max-width: 760px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const RankBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.8rem;
  border-radius: 14px;
  background: var(--hover);
  border: 1px solid var(--border);

  b {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${({ $top }) => ($top ? "var(--accent)" : "var(--text)")};
    min-width: 2.2ch;
  }
  span {
    font-size: 0.76rem;
    line-height: 1.25;
    color: var(--text-2);
  }
  small {
    display: block;
    color: var(--muted);
    font-size: 0.68rem;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1rem;
`;

const TeamLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  border-radius: var(--radius-pill);
  background: var(--hover);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.82rem;
  font-weight: 650;
  text-decoration: none;
  transition: border-color var(--quick) var(--ease);

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
    }
  }
`;

const Snapshot = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const FormatCard = styled(Glass)`
  padding: 1rem 1.1rem;

  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.7rem;
  }
  .fmt {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: -0.01em;
  }
  .span {
    font-size: 0.72rem;
    color: var(--muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
  }
  b {
    display: block;
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }
  small {
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  > ${Panel} {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.9rem;
`;

const FormChip = styled.div`
  min-width: 4.2rem;
  padding: 0.45rem 0.6rem;
  border-radius: 12px;
  text-align: center;
  background: ${({ $tone }) => ($tone === "great" ? "var(--accent-soft)" : "var(--hover)")};
  border: 1px solid ${({ $tone }) => ($tone === "great" ? "var(--accent-line)" : "var(--border)")};

  b {
    display: block;
    font-family: var(--font-display);
    font-weight: 750;
    font-size: 1rem;
    color: ${({ $tone }) => ($tone === "great" ? "var(--accent)" : $tone === "dim" ? "var(--muted)" : "var(--text)")};
  }
  small {
    font-size: 0.66rem;
    color: var(--muted);
    white-space: nowrap;
  }
`;

const FormLabel = styled.h3`
  font-size: 0.68rem;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.45rem;
`;

const ListRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.88rem;

  &:last-child {
    border-bottom: 0;
  }
  .muted {
    color: var(--muted);
    font-size: 0.8rem;
  }
`;

const Group = styled.div`
  margin-bottom: 0.9rem;

  h3 {
    font-size: 0.68rem;
    font-weight: 750;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.45rem;
  }
`;

const Plain = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--hover);
  border: 1px solid var(--border);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-2);
`;

const MatchLink = styled(Link)`
  color: var(--text);
  font-weight: 650;
  text-decoration: none;
  @media (hover: hover) {
    &:hover {
      color: var(--accent);
    }
  }
`;

/* ---------- STAT TABLES ---------- */

const ROWS = {
  batting: [
    ["Matches", "matches"],
    ["Innings", "innings"],
    ["Not outs", "not_outs"],
    ["Runs", "runs"],
    ["Highest", "highest"],
    ["Average", "average", fmtDec],
    ["Balls faced", "balls"],
    ["Strike rate", "strike_rate", fmtDec],
    ["Hundreds", "hundreds"],
    ["Double hundreds", "double_hundreds"],
    ["Fifties", "fifties"],
    ["Fours", "fours"],
    ["Sixes", "sixes"],
    ["Ducks", "ducks"],
  ],
  bowling: [
    ["Matches", "matches"],
    ["Innings", "innings"],
    ["Balls", "balls"],
    ["Runs conceded", "runs"],
    ["Wickets", "wickets"],
    ["Best innings", "best_innings"],
    ["Best match", "best_match"],
    ["Average", "average", fmtDec],
    ["Economy", "economy", fmtDec],
    ["Strike rate", "strike_rate", fmtDec],
    ["Maidens", "maidens"],
    ["4 wickets", "four_wickets"],
    ["5 wickets", "five_wickets"],
    ["10 wickets (match)", "ten_wickets"],
  ],
  fielding: [
    ["Matches", "matches"],
    ["Catches", "catches"],
    ["Stumpings", "stumpings"],
    ["Total dismissals", "dismissals"],
    ["Catches as keeper", "catches_keeper"],
    ["Catches in the field", "catches_fielder"],
    ["Most in an innings", "best_innings"],
    ["Dismissals per innings", "per_innings", (v) => fmtDec(v, 3)],
    ["Span", "span"],
  ],
};

const SECTIONS = [
  { key: "batting", label: "Batting" },
  { key: "bowling", label: "Bowling" },
  { key: "fielding", label: "Fielding" },
];

const SKIP_ZERO_ROWS = new Set(["double_hundreds", "stumpings", "catches_keeper", "ten_wickets"]);

const StatTable = ({ records, section }) => {
  const formats = FORMATS.filter((f) => records?.[f.key]);
  if (!formats.length) return <p style={{ color: "var(--muted)", padding: "0.5rem 0 1rem" }}>No {section} records.</p>;
  const rows = ROWS[section].filter(([, key]) => !SKIP_ZERO_ROWS.has(key) || formats.some((f) => Number(records[f.key][key])));
  return (
    <TableScroll>
      <DataTable style={{ minWidth: 120 + formats.length * 110 }}>
        <thead>
          <tr>
            <th />
            {formats.map((f) => (
              <th key={f.key}>{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, key, fmt = fmtNum]) => (
            <tr key={key}>
              <td>{label}</td>
              {formats.map((f) => (
                <td key={f.key}>{fmt(records[f.key][key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTable>
    </TableScroll>
  );
};

/* ---------- HELPERS ---------- */

const battingTone = (score) => {
  const n = parseInt(score, 10);
  if (Number.isNaN(n)) return "dim";
  return n >= 50 ? "great" : "plain";
};
const bowlingTone = (fig) => {
  const w = parseInt(fig, 10);
  if (Number.isNaN(w)) return "dim";
  return w >= 3 ? "great" : "plain";
};

const FORMAT_LABEL = Object.fromEntries(FORMATS.map((f) => [f.key, f.label]));

const groupAffiliations = (list) => {
  const groups = new Map();
  for (const a of list) {
    const title =
      a.kind === "international" ? "International" : a.kind === "franchise" ? a.league || "T20 leagues" : a.kind === "domestic" ? "Domestic & A sides" : "Other";
    if (!groups.has(title)) groups.set(title, []);
    groups.get(title).push(a);
  }
  // international, then IPL, then other leagues, then domestic
  const order = (t) => (t === "International" ? 0 : t === "IPL" ? 1 : t === "Domestic & A sides" ? 8 : t === "Other" ? 9 : 2);
  return [...groups.entries()].sort((a, b) => order(a[0]) - order(b[0]));
};

const figures = (a) => {
  const parts = [];
  if (a.runs !== null) parts.push(`${a.runs}${a.out ? "" : "*"} (${a.balls})`);
  if (a.legal_balls) parts.push(`${a.wickets}/${a.conceded} (${Math.floor(a.legal_balls / 6)}.${a.legal_balls % 6} ov)`);
  return parts.join(" · ") || "Did not bat or bowl";
};

/* ---------- PAGE ---------- */

const Profile = ({ id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [section, setSection] = useState(null);

  useEffect(() => {
    apiGet(`/players/${id}`).then(setData).catch(setError);
  }, [id]);

  if (error) {
    return (
      <Page>
        <Header />
        <Container $max="1080px">
          <EmptyState icon="🧢" title="Player not found" text="We couldn't find this player." actionLabel="All players" actionTo="/players" />
        </Container>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Header />
        <Container $max="1080px">
          <Skeleton $h="200px" $r="22px" />
          <div style={{ height: 16 }} />
          <Skeleton $h="110px" $r="22px" />
          <div style={{ height: 16 }} />
          <Skeleton $h="360px" $r="22px" />
        </Container>
      </Page>
    );
  }

  const { player: p, batting, bowling, fielding, squads, affiliations, appearances } = data;
  const color = teamColor(p.country_code);
  // open on what they're known for
  const active = section || (p.role === "bowler" ? "bowling" : "batting");
  const ranks = rankingList(p.rankings).filter((r) => r.rank).sort((a, b) => a.rank - b.rank);
  const bestEver = rankingList(p.rankings).filter((r) => r.best === 1);
  const formats = FORMATS.filter((f) => batting[f.key] || bowling[f.key]);
  const debutOf = Object.fromEntries((p.debuts || []).map((d) => [d.format, d]));
  const years = age(p.date_of_birth);
  const form = p.recent_form || {};
  const hasForm = form.batting?.length || form.bowling?.length;
  const facts = [
    p.date_of_birth && ["Born", `${longDate(p.date_of_birth)}${years ? ` (${years})` : ""}`],
    p.birth_place && ["Birthplace", p.birth_place],
    p.batting_style && ["Bats", p.batting_style],
    p.bowling_style && ["Bowls", p.bowling_style],
    p.height && ["Height", p.height],
  ].filter(Boolean);

  return (
    <Page>
      <Header />
      <Container $max="1080px">
        <Hero $color={color}>
          <PlayerPhoto src={p.image_url} name={p.name} code={p.country_code} size={116} />
          <div style={{ minWidth: 0 }}>
            <Eyebrow style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {p.country_code && (
                <TeamMono $code={p.country_code} $size="1.4rem" $small>
                  {p.country_code}
                </TeamMono>
              )}
              {[p.country, roleLabel(p)].filter(Boolean).join(" · ")}
            </Eyebrow>
            <Title>{p.name}</Title>
            {p.full_name && <div style={{ color: "var(--muted)", marginTop: 4 }}>{p.full_name}</div>}
            {facts.length > 0 && (
              <Facts>
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </Facts>
            )}
            {squads.length > 0 && (
              <ChipRow>
                {squads.map((t) => (
                  <TeamLink key={t.id} to={`/teams/${t.id}`}>
                    <TeamMono $code={t.short_code} $size="1.5rem" $small>
                      {t.short_code}
                    </TeamMono>
                    {t.name}
                  </TeamLink>
                ))}
              </ChipRow>
            )}
          </div>
          <Ranks className="ranks">
            {ranks.slice(0, 3).map((r) => (
              <RankBadge key={`${r.kind}${r.format}`} $top={r.rank <= 10}>
                <b>#{r.rank}</b>
                <span>
                  ICC {r.format} {r.kind}
                  {r.best && r.best < r.rank && <small>Best #{r.best}</small>}
                </span>
              </RankBadge>
            ))}
            {!ranks.length && bestEver.length > 0 && (
              <RankBadge $top>
                <b>#1</b>
                <span>
                  Former ICC No. 1
                  <small>{bestEver.map((r) => `${r.format} ${r.kind}`).join(", ")}</small>
                </span>
              </RankBadge>
            )}
            <ButtonLink to="/players" $variant="ghost" $size="sm">
              All players
            </ButtonLink>
          </Ranks>
        </Hero>

        {formats.length > 0 && (
          <Snapshot>
            {formats.map((f) => {
              const b = batting[f.key];
              const w = bowling[f.key];
              const span = fielding[f.key]?.span;
              const debut = debutOf[f.key];
              return (
                <FormatCard key={f.key}>
                  <div className="head">
                    <span className="fmt">{f.label}</span>
                    <span className="span" title={debut ? `Debut v ${debut.opponent}, ${debut.venue}` : undefined}>
                      {span || (debut ? `since ${debut.date.slice(0, 4)}` : "")}
                    </span>
                  </div>
                  <div className="grid">
                    <div>
                      <b>{fmtNum(Math.max(b?.matches || 0, w?.matches || 0))}</b>
                      <small>Mat</small>
                    </div>
                    <div>
                      <b>{fmtNum(b?.runs ?? 0)}</b>
                      <small>Runs</small>
                    </div>
                    <div>
                      <b>{fmtNum(w?.wickets ?? 0)}</b>
                      <small>Wkts</small>
                    </div>
                  </div>
                </FormatCard>
              );
            })}
          </Snapshot>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <Segmented items={SECTIONS} value={active} onChange={setSection} ariaLabel="Career section" />
        </div>

        <Panel>
          <PanelTitle>{SECTIONS.find((s) => s.key === active).label} career</PanelTitle>
          <StatTable records={{ batting, bowling, fielding }[active]} section={active} />
        </Panel>

        {(hasForm || p.debuts?.length > 0) && (
          <Columns>
            {hasForm && (
              <Panel>
                <PanelTitle>Recent form</PanelTitle>
                {form.batting?.length > 0 && (
                  <>
                    <FormLabel>Batting</FormLabel>
                    <FormRow>
                      {form.batting.map((r, i) => (
                        <FormChip key={i} $tone={battingTone(r.score)} title={r.date}>
                          <b>{r.score}</b>
                          <small>
                            {r.format} v {r.opponent}
                          </small>
                        </FormChip>
                      ))}
                    </FormRow>
                  </>
                )}
                {form.bowling?.length > 0 && (
                  <>
                    <FormLabel>Bowling</FormLabel>
                    <FormRow>
                      {form.bowling.map((r, i) => (
                        <FormChip key={i} $tone={bowlingTone(r.score)} title={r.date}>
                          <b>{r.score}</b>
                          <small>
                            {r.format} v {r.opponent}
                          </small>
                        </FormChip>
                      ))}
                    </FormRow>
                  </>
                )}
              </Panel>
            )}
            {p.debuts?.length > 0 && (
              <Panel>
                <PanelTitle>Debuts</PanelTitle>
                {p.debuts.map((d) => (
                  <ListRow key={d.format}>
                    <span>
                      <b>{FORMAT_LABEL[d.format]}</b> <span className="muted">v {d.opponent}</span>
                    </span>
                    <span className="muted" style={{ textAlign: "right" }}>
                      {longDate(d.date)}
                      {d.venue && <div>{d.venue}</div>}
                    </span>
                  </ListRow>
                ))}
              </Panel>
            )}
          </Columns>
        )}

        {affiliations.length > 0 && (
          <Panel>
            <PanelTitle>
              Teams played for <Tag $tone="muted">{affiliations.length}</Tag>
            </PanelTitle>
            {groupAffiliations(affiliations).map(([title, list]) => (
              <Group key={title}>
                <h3>{title}</h3>
                <ChipRow style={{ marginTop: 0 }}>
                  {list.map((a) =>
                    a.team_id ? (
                      <TeamLink key={a.name} to={`/teams/${a.team_id}`}>
                        <TeamMono $code={a.short_code} $size="1.4rem" $small>
                          {a.short_code}
                        </TeamMono>
                        {a.name}
                      </TeamLink>
                    ) : (
                      <Plain key={a.name}>{a.name}</Plain>
                    )
                  )}
                </ChipRow>
              </Group>
            ))}
          </Panel>
        )}

        {appearances.length > 0 && (
          <Panel>
            <PanelTitle>
              On ScorePulse <Tag $tone="muted">{appearances.length}</Tag>
            </PanelTitle>
            {appearances.map((a) => (
              <ListRow key={a.match_id}>
                <span>
                  <MatchLink to={`/match/${a.match_id}`}>
                    {a.team} v {a.opponent}
                  </MatchLink>
                  <div className="muted">{[a.match_title, a.series_name, formatDate(a.start_date)].filter(Boolean).join(" · ")}</div>
                </span>
                <span style={{ textAlign: "right" }}>
                  <b style={{ fontVariantNumeric: "tabular-nums" }}>{figures(a)}</b>
                  <div className="muted">{a.result_text || a.status.replace("_", " ")}</div>
                </span>
              </ListRow>
            ))}
          </Panel>
        )}

        <p style={{ color: "var(--muted)", fontSize: "0.74rem", textAlign: "center" }}>
          Profile, batting and bowling records: Cricbuzz · Fielding: ESPNcricinfo Statsguru
          {p.updated_at && ` · updated ${formatDate(p.updated_at.slice(0, 10))}`}
        </p>
      </Container>
    </Page>
  );
};

// keyed by id so moving between players starts from a clean slate
const PlayerProfile = () => {
  const { id } = useParams();
  return <Profile key={id} id={id} />;
};

export default PlayerProfile;
