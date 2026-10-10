import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { apiGet } from "../api";
import { useMatchList } from "../hooks/useMatchList";
import { formatDate, scoreText } from "../Components/match/theme";
import { Button, Container, LiveDot, Muted, Page, PageHeader, Segmented, Skeleton, StickyBar } from "../ui/kit";
import { glass, pressable } from "../ui/styles";
import { TeamLogo } from "../ui/players";

/* ---------- STYLES ---------- */

const Block = styled.section`
  ${glass}
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1rem;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.2rem;
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

const rowStyles = `
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.2rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: background-color var(--quick) var(--ease);

  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`;

const Row = styled.div`
  ${rowStyles}
`;

const RowLink = styled(Link)`
  ${rowStyles}
  @media (hover: hover) {
    &:hover {
      background: var(--hover);
    }
  }
`;

const Sides = styled.div`
  display: grid;
  gap: 0.4rem;
  min-width: 0;
`;

const Side = styled.div`
  display: grid;
  grid-template-columns: 2.2rem 1fr auto;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.95rem;
  font-weight: ${({ $strong }) => ($strong ? 700 : 550)};
  opacity: ${({ $dim }) => ($dim ? 0.6 : 1)};

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .score {
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: -0.015em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .score small {
    margin-left: 0.3rem;
    font-family: var(--font);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--muted);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  text-align: right;
  min-width: 230px;
  max-width: 340px;

  @media (max-width: 720px) {
    align-items: flex-start;
    text-align: left;
    min-width: 0;
    max-width: none;
  }
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--muted);
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 650;
  color: ${({ $tone }) => ($tone === "live" ? "var(--live)" : $tone === "muted" ? "var(--text-2)" : "var(--accent)")};
`;

const When = styled.div`
  font-family: var(--font-display);
  font-weight: 750;
  font-size: 1.05rem;
  letter-spacing: -0.015em;

  small {
    margin-left: 0.4rem;
    font-family: var(--font);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--accent);
  }
`;

const OnSP = styled(Link)`
  ${pressable}
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-ink);
  background: var(--accent);
  box-shadow: var(--glow);
  text-decoration: none;
`;

const Chips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
`;

const Chip = styled.button`
  ${pressable}
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "var(--border)")};
  background: ${({ $active }) => ($active ? "var(--accent)" : "var(--hover)")};
  color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text-2)")};
  padding: 0.38rem 0.85rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 650;

  span {
    opacity: 0.65;
    margin-left: 0.3rem;
  }
`;

/* ---------- HELPERS ---------- */

const VIEWS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "results", label: "Results" },
  { key: "scorepulse", label: "On ScorePulse" },
];

const CATEGORIES = [
  { key: "International", label: "International" },
  { key: "League", label: "T20 leagues" },
  { key: "Domestic", label: "Domestic" },
  { key: "Women", label: "Women" },
  { key: "all", label: "All" },
];

const dayKey = (iso) => new Date(iso).toDateString();
const dayLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" });
};
const timeLabel = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const countdown = (iso, now) => {
  const mins = Math.round((new Date(iso) - now) / 60000);
  if (mins <= 0) return "starting";
  if (mins < 60) return `in ${mins}m`;
  if (mins < 24 * 60) return `in ${Math.floor(mins / 60)}h ${mins % 60}m`;
  return null;
};

const groupBy = (list, keyOf, labelOf) => {
  const groups = new Map();
  for (const m of list) {
    const key = keyOf(m);
    if (!groups.has(key)) groups.set(key, { key, label: labelOf(m), matches: [] });
    groups.get(key).matches.push(m);
  }
  return [...groups.values()];
};

/* ---------- REAL CALENDAR ---------- */

// "Score this match" opens the scorer console with the fixture filled in.
const ScoreIt = ({ prefill }) => {
  const navigate = useNavigate();
  return (
    <Button $variant="ghost" $size="sm" onClick={() => navigate(`/scorer?${new URLSearchParams(prefill)}`)}>
      Score this match
    </Button>
  );
};

const Fixture = ({ m, now }) => {
  const sp = m.scorePulse;
  const scored = m.teams.some((t) => t.score);
  const winner = m.isDone ? m.teams.find((t) => m.status?.startsWith(t.name)) : null;
  const meta = [m.title, m.format, m.venue?.ground && `${m.venue.ground}${m.venue.city ? `, ${m.venue.city}` : ""}`].filter(Boolean).join(" · ");
  const soon = !scored && !m.isLive && m.start ? countdown(m.start, now) : null;

  const body = (
    <>
      <Sides>
        {m.teams.map((t) => (
          <Side key={t.name} $strong={winner === t} $dim={winner && winner !== t}>
            <TeamLogo src={t.image} code={t.short} size={22} label={t.name} />
            <span className="name">{t.name}</span>
            <span className="score">
              {t.score?.text}
              {t.score?.overs && m.format !== "TEST" ? <small>({t.score.overs})</small> : null}
            </span>
          </Side>
        ))}
      </Sides>
      <Info>
        {!scored && !m.isLive && m.start && (
          <When>
            {timeLabel(m.start)}
            {soon && <small>{soon}</small>}
          </When>
        )}
        <Meta>{meta}</Meta>
        {m.status && (
          <Status $tone={m.isLive ? "live" : m.isDone ? "accent" : "muted"}>
            {m.isLive && <LiveDot />}
            {m.status}
          </Status>
        )}
        {sp ? (
          <OnSP to={`/match/${sp.matchId}`}>
            {["live", "innings_break", "toss", "stumps", "delayed"].includes(sp.status) && <LiveDot style={{ background: "var(--accent-ink)" }} />}
            {sp.status === "completed" ? "Scorecard on ScorePulse →" : "On ScorePulse →"}
          </OnSP>
        ) : (
          m.prefill && <ScoreIt prefill={m.prefill} />
        )}
      </Info>
    </>
  );
  // fixtures ScorePulse has scored open our own ball-by-ball page; others don't link out
  return sp ? <RowLink to={`/match/${sp.matchId}`}>{body}</RowLink> : <Row>{body}</Row>;
};

const Calendar = ({ type, category, setCategory }) => {
  const [state, setState] = useState({ type: null, matches: null, updatedAt: null, failed: false });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    const load = () =>
      apiGet(`/fixtures?type=${type}`)
        .then((d) => alive && setState({ type, matches: d.matches || [], updatedAt: d.updatedAt, failed: false }))
        .catch(() => alive && setState((s) => ({ ...s, type, failed: true })));
    load();
    // results move while matches are live; the schedule barely changes
    const timer = setInterval(() => {
      setNow(Date.now());
      if (type === "results") load();
    }, 60000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [type]);

  const loading = state.type !== type;
  const all = useMemo(() => (loading ? [] : state.matches || []), [loading, state.matches]);
  const counts = useMemo(() => {
    const c = { all: all.length };
    for (const m of all) c[m.category] = (c[m.category] || 0) + 1;
    return c;
  }, [all]);
  const list = all.filter((m) => category === "all" || m.category === category);
  const groups =
    type === "upcoming"
      ? groupBy(list, (m) => dayKey(m.start), (m) => dayLabel(m.start))
      : groupBy(list, (m) => m.series || "Other matches", (m) => m.series || "Other matches");

  return (
    <>
      <Chips>
        {CATEGORIES.map((c) => (
          <Chip key={c.key} $active={category === c.key} onClick={() => setCategory(c.key)}>
            {c.label}
            {!loading && <span>{counts[c.key] || 0}</span>}
          </Chip>
        ))}
      </Chips>

      <div style={{ height: "1rem" }} />

      {loading && !state.failed ? (
        <>
          <Skeleton $h="200px" $r="22px" />
          <div style={{ height: 16 }} />
          <Skeleton $h="140px" $r="22px" />
        </>
      ) : state.failed && !state.matches ? (
        <EmptyState icon="📅" title="Fixtures unavailable" text="We couldn't load the cricket calendar. Try again in a little while." />
      ) : list.length === 0 ? (
        <EmptyState
          icon="📅"
          title={type === "upcoming" ? "Nothing scheduled" : "No results"}
          text={`No ${CATEGORIES.find((c) => c.key === category).label.toLowerCase()} matches ${type === "upcoming" ? "in the next few days" : "recently"}.`}
        />
      ) : (
        groups.map((g) => (
          <Block key={g.key}>
            <BlockHeader>
              {g.label}
              <span>
                {g.matches.length} match{g.matches.length === 1 ? "" : "es"}
              </span>
            </BlockHeader>
            {g.matches.map((m) => (
              <Fixture key={m.id} m={type === "upcoming" ? { ...m, title: [m.series, m.title].filter(Boolean).join(" · ") } : m} now={now} />
            ))}
          </Block>
        ))
      )}

      {!loading && state.updatedAt && (
        <Muted $size="0.74rem" style={{ display: "block", textAlign: "center", marginTop: "0.5rem" }}>
          Schedule and results from Cricbuzz · matches ScorePulse covers open here, ball by ball
        </Muted>
      )}
    </>
  );
};

/* ---------- SCOREPULSE MATCHES ---------- */

const OUR_TABS = [
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Results" },
];

const EMPTY = {
  live: { title: "Nothing live right now", text: "There are no matches in play on ScorePulse at the moment." },
  upcoming: { title: "No fixtures yet", text: "Pick one from the Upcoming tab and score it." },
  completed: { title: "No results yet", text: "Finished matches will appear here." },
};

const sideScore = (side) =>
  side.innings.length
    ? side.innings.map((i) => `${scoreText(i)}${side.innings.length === 1 ? ` (${i.overs})` : ""}`).join(" & ")
    : "";

const OurMatches = ({ status, setStatus, logos }) => {
  const { matches } = useMatchList(`/matches?status=${status}&limit=100`);
  const groups = groupBy(matches || [], (m) => m.series || "Other matches", (m) => m.series || "Other matches");

  return (
    <>
      <Chips>
        {OUR_TABS.map((t) => (
          <Chip key={t.key} $active={status === t.key} onClick={() => setStatus(t.key)}>
            {t.label}
          </Chip>
        ))}
      </Chips>
      <div style={{ height: "1rem" }} />

      {matches === null && <Skeleton $h="180px" $r="22px" />}

      {matches?.length === 0 && (
        <EmptyState
          icon="🏏"
          title={EMPTY[status].title}
          text={EMPTY[status].text}
          actionLabel={status === "upcoming" ? "See the calendar" : undefined}
          actionTo={status === "upcoming" ? "/fixtures?view=upcoming" : undefined}
        />
      )}

      {groups.map((g) => (
        <Block key={g.key}>
          <BlockHeader>
            {g.label}
            <span>
              {g.matches.length} match{g.matches.length === 1 ? "" : "es"}
            </span>
          </BlockHeader>
          {g.matches.map((m) => {
            const batting = [m.team1, m.team2].find((s) => s.innings.some((i) => i.batting));
            return (
              <RowLink key={m.id} to={`/match/${m.id}`}>
                <Sides>
                  {[m.team1, m.team2].map((side) => (
                    <Side
                      key={side.id}
                      $strong={m.winnerId === side.id || batting?.id === side.id}
                      $dim={(m.winnerId && m.winnerId !== side.id) || (batting && batting.id !== side.id)}
                    >
                      <TeamLogo src={logos[side.id]?.logo} code={side.short} size={22} crest={logos[side.id]?.type === "franchise"} label={side.name} />
                      <span className="name">{side.name}</span>
                      <span className="score">{sideScore(side)}</span>
                    </Side>
                  ))}
                </Sides>
                <Info>
                  <Meta>
                    {[m.title, m.title?.includes(m.formatLabel) ? null : m.formatLabel, m.venue?.name, formatDate(m.startDate)].filter(Boolean).join(" · ")}
                  </Meta>
                  <Status $tone={m.isLive ? "live" : "accent"}>
                    {m.isLive && <LiveDot />}
                    {m.statusText}
                  </Status>
                </Info>
              </RowLink>
            );
          })}
        </Block>
      ))}
    </>
  );
};

/* ---------- PAGE ---------- */

// old links: ?type=live|upcoming|completed (and past/current/future) meant ScorePulse's own matches
const LEGACY_STATUS = { past: "completed", current: "live", future: "upcoming", live: "live", upcoming: "upcoming", completed: "completed" };

const Fixtures = () => {
  const [params, setParams] = useSearchParams();
  const legacy = LEGACY_STATUS[params.get("type")];
  const view = params.get("view") || (legacy ? "scorepulse" : "upcoming");
  const status = params.get("status") || legacy || "live";
  const category = params.get("category") || "International";
  const [logos, setLogos] = useState({});

  useEffect(() => {
    apiGet("/teams")
      .then((d) => setLogos(Object.fromEntries((d.teams || []).map((t) => [t.id, t]))))
      .catch(() => {});
  }, []);

  const set = (next) => setParams({ view, ...(view === "scorepulse" ? { status } : { category }), ...next }, { replace: true });

  return (
    <Page>
      <Header />

      <Container $max="1080px">
        <PageHeader
          eyebrow="Matches"
          title="Fixtures & results"
          subtitle="The cricket calendar, with every match ScorePulse covers scored ball by ball. See a fixture you want? Score it."
        />

        <StickyBar>
          <Segmented items={VIEWS} value={view} onChange={(v) => setParams({ view: v }, { replace: true })} ariaLabel="Matches" />
        </StickyBar>

        {view === "scorepulse" ? (
          <OurMatches status={status} setStatus={(s) => set({ status: s })} logos={logos} />
        ) : (
          <Calendar type={view} category={category} setCategory={(c) => set({ category: c })} />
        )}
      </Container>
    </Page>
  );
};

export default Fixtures;
