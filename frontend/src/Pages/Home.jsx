import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import MatchCarousel from "../Components/MatchCarousel";
import MatchCarouselSkeleton from "../Components/MatchCarouselSkeleton";
import EmptyState from "../Components/EmptyState";
import { useTheme } from "../context/ThemeContext";
import { use } from "react";

/* ---------- MOCK MATCH DATA ---------- */




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

/* ---------- STYLES ---------- */

const Page = styled.div`
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: ${({ dark }) => (dark ? "#0b1220" : "#f6f7f9")};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 28px auto;
  padding: 0 16px;
`;

const SectionTitle = styled.h2`
  margin: 40px 0 18px;
  font-size: 1.45rem;
  font-weight: 700;
`;

const ViewAllWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

const ViewAllButton = styled.a`
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({ dark }) => (dark ? "#60a5fa" : "#2563eb")};

  &:hover {
    text-decoration: underline;
  }
`;

/* ---------- TOP STORIES ---------- */

const TopStoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StoryCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 14px;
  overflow: hidden;
`;

const StoryImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const StoryTitle = styled.div`
  padding: 14px;
  font-weight: 600;
`;

/* ---------- NEWS ---------- */

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
`;

const NewsImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 12px 14px;
`;

const NewsTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const NewsMeta = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- PAGE ---------- */
const Home = () => {
  const [matchesData, setMatchesData] = useState([]);
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  const theme = {
    cardBg: darkMode ? "#151c2f" : "#ffffff",
    muted: darkMode ? "#9aa4b2" : "#64748b",
  };
  useEffect(() => {
    fetch("http://localhost:8000/api/matches/recent")
      .then((res) => res.json())
      .then(setMatchesData)
      .catch(() => setMatchesData([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Page dark={darkMode}>
      <Header />

      <Container>
        {/* RECENT MATCHES */}
        <SectionTitle>RECENT MATCHES</SectionTitle>

        {loading ? (
          <MatchCarouselSkeleton />
        ) : matchesData.length === 0 ? (
          <EmptyState
            icon="🏏"
            title="No matches right now"
            text="Check upcoming fixtures or recent results"
            actionLabel="View Fixtures"
            actionTo="/fixtures"
          />
        ) : (
          <>
            <MatchCarousel
              matches={matchesData}
              cardsPerView={3}
              scrollBy={2}
            />

            <ViewAllWrapper>
              <ViewAllButton dark={darkMode} href="/fixtures">
                View all matches →
              </ViewAllButton>
            </ViewAllWrapper>
          </>
        )}

        {/* TOP STORIES */}
        <SectionTitle>TOP STORIES</SectionTitle>
        <TopStoriesGrid>
          {topStories.map((s, i) => (
            <StoryCard key={i} theme={theme}>
              <StoryImage src={s.image} alt={s.title} loading="lazy" />
              <StoryTitle>{s.title}</StoryTitle>
            </StoryCard>
          ))}
        </TopStoriesGrid>

        {/* LATEST NEWS */}
        <SectionTitle>LATEST NEWS</SectionTitle>
        <NewsGrid>
          {latestNews.map((n, i) => (
            <NewsCard key={i} theme={theme}>
              <NewsImage src={n.image} alt={n.title} loading="lazy" />
              <NewsContent>
                <NewsTitle>{n.title}</NewsTitle>
                <NewsMeta theme={theme}>{n.meta}</NewsMeta>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      </Container>
    </Page>
  );
};

export default Home;
