import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import MatchCarousel from "../Components/MatchCarousel";
import MatchCarouselSkeleton from "../Components/MatchCarouselSkeleton";
import MatchCard from "../Components/MatchCard";
import EmptyState from "../Components/EmptyState";
import { useMatchList } from "../hooks/useMatchList";
import { ButtonLink, Container, Eyebrow, LiveDot, Page, SectionTitle, Skeleton } from "../ui/kit";
import { glass, pressable } from "../ui/styles";

/* ---------- TOP STORIES ---------- */

const topStories = [
  {
    title: "India dominate Australia in series decider",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
  },
  {
    title: "England rethink white-ball strategy",
    image: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
  },
  {
    title: "Why Test cricket still matters",
    image: "https://images.unsplash.com/photo-1593766788306-28561086694b",
  },
];

/* ---------- LATEST NEWS ---------- */

const latestNews = [
  {
    title: "Rohit Sharma set to return for final ODI",
    image: "https://images.unsplash.com/photo-1606907568152-58fcb0a0a61e",
    meta: "India • 2h ago",
  },
  {
    title: "South Africa middle-order concerns deepen",
    image: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
    meta: "South Africa • 4h ago",
  },
  {
    title: "ICC considering changes to WTC points system",
    image: "https://images.unsplash.com/photo-1593766788306-28561086694b",
    meta: "ICC • 6h ago",
  },
];

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

/* ---------- STORIES & NEWS ---------- */

const StoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const Story = styled.article`
  ${glass}
  ${pressable}
  border-radius: var(--radius-lg);
  overflow: hidden;

  @media (hover: hover) {
    &:hover img {
      transform: scale(1.04);
    }
  }
`;

const Media = styled.div`
  height: ${({ $h }) => $h};
  overflow: hidden;
  background:
    radial-gradient(closest-side at 30% 40%, var(--accent-soft), transparent),
    linear-gradient(135deg, var(--solid-2), var(--solid));
  display: grid;
  place-items: center;
  font-size: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms var(--ease);
  }
`;

const StoryBody = styled.div`
  padding: 1rem 1.1rem 1.15rem;
`;

const StoryTitle = styled.h3`
  font-size: ${({ $big }) => ($big ? "1.15rem" : "1rem")};
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.012em;
`;

const StoryMeta = styled.div`
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: var(--muted);
`;

// Falls back to a branded placeholder if the image can't load.
const Cover = ({ src, alt, h }) => {
  const [failed, setFailed] = useState(false);
  return (
    <Media $h={h}>
      {failed ? <span aria-hidden>🏏</span> : <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    </Media>
  );
};

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

        <SectionTitle>Top stories</SectionTitle>
        <StoriesGrid>
          {topStories.map((s, i) => (
            <Story key={s.title}>
              <Cover src={s.image} alt={s.title} h={i === 0 ? "240px" : "160px"} />
              <StoryBody>
                <StoryTitle $big={i === 0}>{s.title}</StoryTitle>
              </StoryBody>
            </Story>
          ))}
        </StoriesGrid>

        <SectionTitle>Latest news</SectionTitle>
        <NewsGrid>
          {latestNews.map((n) => (
            <Story key={n.title}>
              <Cover src={n.image} alt={n.title} h="150px" />
              <StoryBody>
                <StoryTitle>{n.title}</StoryTitle>
                <StoryMeta>{n.meta}</StoryMeta>
              </StoryBody>
            </Story>
          ))}
        </NewsGrid>
      </Container>
    </Page>
  );
};

export default Home;
