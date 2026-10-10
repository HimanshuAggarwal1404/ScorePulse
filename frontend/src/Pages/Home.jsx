import React from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import MatchCarousel from "../Components/MatchCarousel";
import MatchCarouselSkeleton from "../Components/MatchCarouselSkeleton";
import MatchCard from "../Components/MatchCard";
import EmptyState from "../Components/EmptyState";
import NewsSection from "../Components/NewsSection";
import { useMatchList } from "../hooks/useMatchList";
import { ButtonLink, Container, Eyebrow, LiveDot, Page, SectionTitle, Skeleton } from "../ui/kit";

/* ---------- HERO ---------- */

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem 0 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding-top: 0.5rem;
  }
`;

const Display = styled.h1`
  text-wrap: balance;
  font-size: clamp(2.3rem, 5.4vw, 4rem);
  font-weight: 750;
  line-height: 1.02;
  letter-spacing: -0.035em;

  em {
    font-style: normal;
    color: var(--accent);
    text-shadow: 0 0 32px var(--accent-soft);
  }
`;

const Lede = styled.p`
  margin: 1rem 0 1.5rem;
  max-width: 46ch;
  color: var(--text-2);
  font-size: 1.05rem;
  line-height: 1.55;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Featured = styled.div`
  position: relative;

  /* soft neon halo behind the featured card */
  &::before {
    content: "";
    position: absolute;
    inset: 8% 6%;
    background: radial-gradient(closest-side, var(--accent-soft), transparent);
    filter: blur(24px);
    z-index: -1;
  }
`;

const FeaturedLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
`;

const SeeAll = styled(ButtonLink).attrs({ $variant: "ghost", $size: "sm" })``;

/* ---------- PAGE ---------- */

const Home = () => {
  // live matches first, then the latest results; refreshed whenever a match changes
  const { matches } = useMatchList("/matches/recent?limit=10");
  const matchesData = matches || [];
  const loading = matches === null;
  const anyLive = matchesData.some((m) => m.isLive);
  const [featured, ...rest] = matchesData;

  return (
    <Page>
      <Header />

      <Container>
        <Hero>
          <div>
            <Eyebrow>Live cricket, ball by ball</Eyebrow>
            <Display>
              Every ball.
              <br />
              <em>The moment</em> it's bowled.
            </Display>
            <Lede>
              Live scores, full scorecards and commentary that update instantly - from the first ball to the last.
            </Lede>
            <Actions>
              <ButtonLink to="/fixtures?type=live">
                {anyLive && <LiveDot style={{ background: "var(--accent-ink)" }} />}
                Live scores
              </ButtonLink>
              <ButtonLink to="/fixtures?type=completed" $variant="ghost">
                Results
              </ButtonLink>
            </Actions>
          </div>

          <Featured>
            <FeaturedLabel>
              {featured?.isLive ? (
                <>
                  <LiveDot /> Happening now
                </>
              ) : (
                "Latest result"
              )}
            </FeaturedLabel>
            {loading ? <Skeleton $h="178px" $r="22px" /> : featured ? <MatchCard matchData={featured} /> : null}
          </Featured>
        </Hero>

        <SectionHead>
          <SectionTitle>{anyLive ? "Live & recent" : "Recent matches"}</SectionTitle>
          <SeeAll to="/fixtures?type=completed">All results</SeeAll>
        </SectionHead>

        {loading ? (
          <MatchCarouselSkeleton />
        ) : matchesData.length === 0 ? (
          <EmptyState
            icon="🏏"
            title="No matches right now"
            text="Check upcoming fixtures or recent results."
            actionLabel="View fixtures"
            actionTo="/fixtures?type=upcoming"
          />
        ) : (
          <MatchCarousel matches={rest.length ? rest : matchesData} cardsPerView={3} scrollBy={2} />
        )}

        <NewsSection />
      </Container>
    </Page>
  );
};

export default Home;
