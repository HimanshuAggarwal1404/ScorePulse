import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { useLiveMatch } from "../hooks/useLiveMatch";
import { LIVE_STATES, palette } from "../Components/match/theme";
import { Card, Muted, PlayerName } from "../Components/match/ui";
import MatchHeader from "../Components/match/MatchHeader";
import LivePanel from "../Components/match/LivePanel";
import Commentary from "../Components/match/Commentary";
import Scorecard from "../Components/match/Scorecard";
import { InfoTab, OversTab, SquadsTab } from "../Components/match/MatchTabs";
import { Container, Page, Segmented, Skeleton, StickyBar } from "../ui/kit";

const Connection = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $on }) => ($on ? "var(--accent)" : "var(--muted)")};
  margin-left: auto;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Highlight = styled(Card)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }
`;

const TABS = [
  { key: "live", label: "Commentary" },
  { key: "scorecard", label: "Scorecard" },
  { key: "overs", label: "Overs" },
  { key: "squads", label: "Squads" },
  { key: "info", label: "Info" },
];

const MatchDetails = () => {
  const { id } = useParams();
  const t = palette();
  const [params, setParams] = useSearchParams();
  const { data, error, connected } = useLiveMatch(id);
  const [tab, setTab] = useState(params.get("tab"));

  const choose = (key) => {
    setTab(key);
    setParams({ tab: key }, { replace: true });
  };

  if (error?.status === 404 || error?.status === 400) {
    return (
      <Page>
        <Header />
        <Container $max="1080px">
          <EmptyState icon="🏏" title="Match not found" text="This match doesn't exist or was removed." actionLabel="Browse fixtures" actionTo="/fixtures?type=completed" />
        </Container>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <Header />
        <Container $max="1080px">
          {error ? (
            <EmptyState icon="⚠️" title="Couldn't load the match" text={error.message} />
          ) : (
            <>
              <Skeleton $h="230px" $r="22px" />
              <div style={{ height: 16 }} />
              <Skeleton $h="44px" $w="420px" $r="999px" />
              <div style={{ height: 16 }} />
              <Skeleton $h="320px" $r="22px" />
            </>
          )}
        </Container>
      </Page>
    );
  }

  const isLive = LIVE_STATES.includes(data.match.status);
  // until a tab is picked: commentary while live, scorecard once it's over
  const current = tab || (isLive || data.match.status === "upcoming" ? "live" : "scorecard");

  return (
    <Page>
      <Header />
      <Container $max="1080px">
        <MatchHeader data={data} t={t} />

        <StickyBar>
          <BarRow>
            <Segmented items={TABS} value={current} onChange={choose} ariaLabel="Match sections" />
            {isLive && <Connection $on={connected}>{connected ? "Live" : "Reconnecting…"}</Connection>}
          </BarRow>
        </StickyBar>

        {current === "live" && (
          <>
            {data.match.playerOfMatch && (
              <Highlight $t={t}>
                <span className="label">Player of the match</span>
                <PlayerName player={data.match.playerOfMatch} t={t} />
              </Highlight>
            )}
            {data.match.toss && data.match.status !== "completed" && !data.live && (
              <Highlight $t={t}>
                <span className="label">Toss</span>
                <Muted $t={t} $size="0.95rem">
                  {data.match.toss.text}
                </Muted>
              </Highlight>
            )}
            <LivePanel live={data.live} t={t} />
            <Commentary matchId={id} data={data} t={t} />
          </>
        )}
        {current === "scorecard" && <Scorecard data={data} t={t} />}
        {current === "overs" && <OversTab data={data} t={t} />}
        {current === "squads" && <SquadsTab data={data} t={t} />}
        {current === "info" && <InfoTab data={data} t={t} />}
      </Container>
    </Page>
  );
};

export default MatchDetails;
