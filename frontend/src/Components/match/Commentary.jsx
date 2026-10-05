import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { apiGet } from "../../api";
import { chipColor } from "./theme";
import { BallChip, Card, Chips, Muted, Pill, Row } from "./ui";

const BallRow = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  align-items: start;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
`;

const Text = styled.div`
  font-size: 0.93rem;
  line-height: 1.5;

  strong {
    color: ${({ $color }) => $color};
  }
`;

const WicketBox = styled.div`
  margin-top: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  background: ${({ $t }) => $t.liveSoft};
  color: ${({ $t }) => $t.wicket};
  font-weight: 600;
  font-size: 0.86rem;
`;

const OverCard = styled.div`
  margin: 14px 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${({ $t }) => $t.cardAlt};
  border: 1px solid ${({ $t }) => $t.border};
  font-size: 0.86rem;
  display: grid;
  gap: 8px;
`;

const Banner = styled.div`
  margin: 14px 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${({ $t }) => $t.accentSoft};
  color: ${({ $t }) => $t.accent};
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
`;

const MoreButton = styled.button`
  margin-top: 14px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ $t }) => $t.border};
  background: transparent;
  color: ${({ $t }) => $t.accent};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const HEADLINE = {
  wicket: "OUT",
  four: "FOUR",
  six: "SIX",
};

// Highlight the key word in "Bumrah to Kohli, FOUR" the way commentary sites do.
const BallText = ({ item, t }) => {
  const word = HEADLINE[item.kind];
  const color = chipColor(item.kind, t);
  if (!word || !item.text.includes(word)) return <Text $color={color}>{item.text}</Text>;
  const [before, ...rest] = item.text.split(word);
  return (
    <Text $color={color}>
      {before}
      <strong>{word}</strong>
      {rest.join(word)}
    </Text>
  );
};

const Item = ({ item, t }) => {
  if (item.type === "over_end") {
    return (
      <OverCard $t={t}>
        <Row $justify="space-between">
          <b>End of over {item.over}</b>
          <span>
            {item.runs} run{item.runs === 1 ? "" : "s"}
            {item.wickets ? `, ${item.wickets} wkt${item.wickets === 1 ? "" : "s"}` : ""} · <b>{item.score}</b>
          </span>
        </Row>
        <Chips>
          {item.balls.map((b, i) => (
            <BallChip key={i} chip={b.chip} kind={b.kind} t={t} size="sm" />
          ))}
        </Chips>
        <Muted $t={t}>
          {item.batters.join("  ·  ")}
          {item.bowlers.length ? `   |   ${item.bowlers.join(", ")}` : ""}
        </Muted>
      </OverCard>
    );
  }
  if (item.type === "innings_end") {
    return <Banner $t={t}>Innings over: {item.text}</Banner>;
  }
  return (
    <BallRow $t={t}>
      <Left>
        {item.label}
        <BallChip chip={item.chip} kind={item.kind} t={t} />
      </Left>
      <div>
        <BallText item={item} t={t} />
        {item.custom && <Text $color={t.text}>{item.custom}</Text>}
        {item.wicket && <WicketBox $t={t}>{item.wicket}</WicketBox>}
      </div>
    </BallRow>
  );
};

const Commentary = ({ matchId, data, t }) => {
  const [filter, setFilter] = useState(null); // innings number or null for all
  const [pages, setPages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const latest = useMemo(
    () => (data.latestCommentary || []).filter((i) => !filter || i.inningsNumber === filter),
    [data.latestCommentary, filter]
  );

  const items = useMemo(() => {
    const seen = new Set(latest.map((i) => i.key));
    return [...latest, ...pages.filter((i) => !seen.has(i.key))];
  }, [latest, pages]);

  const load = async (reset) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "60" });
      if (filter) params.set("innings", filter);
      const cursor = reset ? null : items[items.length - 1]?.key;
      if (cursor) params.set("before", cursor);
      const res = await apiGet(`/matches/${matchId}/commentary?${params}`);
      setPages((p) => (reset ? res.items : [...p, ...res.items]));
      setHasMore(!!res.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  // switching innings: start from that innings' latest balls
  useEffect(() => {
    setPages([]);
    setHasMore(true);
    if (filter) load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, matchId]);

  const inningsTabs = data.innings.map((i) => ({
    n: i.number,
    label: `${i.battingTeam.short} ${i.isSuperOver ? "Super Over" : data.match.rules.inningsPerTeam === 2 ? `${i.number <= 2 ? "1st" : "2nd"} inns` : "inns"}`,
  }));

  return (
    <Card $t={t}>
      {inningsTabs.length > 1 && (
        <Row style={{ marginBottom: 8 }}>
          <Pill $t={t} $active={!filter} onClick={() => setFilter(null)}>
            All
          </Pill>
          {inningsTabs.map((x) => (
            <Pill key={x.n} $t={t} $active={filter === x.n} onClick={() => setFilter(x.n)}>
              {x.label}
            </Pill>
          ))}
        </Row>
      )}

      {items.length === 0 && (
        <Muted $t={t}>{data.match.status === "upcoming" ? "Commentary will appear once play starts." : "No commentary yet."}</Muted>
      )}

      {items.map((item) => (
        <Item key={item.key} item={item} t={t} />
      ))}

      {hasMore && (filter ? items.length >= 60 : items.length >= 30) && (
        <MoreButton $t={t} onClick={() => load(false)} disabled={loading}>
          {loading ? "Loading…" : "Load more commentary"}
        </MoreButton>
      )}
    </Card>
  );
};

export default Commentary;
