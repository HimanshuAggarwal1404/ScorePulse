import React from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import MatchCarousel from "../Components/MatchCarousel";
import { useTheme } from "../context/ThemeContext";

/* ---------- MATCH DATA ---------- */

const matchesData = [
  {
    type: "ODI",
    live: true,
    team1: { name: "England", code: "ENG", score: "268", wickets: "6", overs: "47.3" },
    team2: { name: "South Africa", code: "SA", score: "198", wickets: "5", overs: "39.1" },
    status: "South Africa need 71 runs in 65 balls",
  },
  {
    type: "T20 International",
    live: true,
    team1: { name: "India", code: "IND", score: "154", wickets: "3", overs: "16.2" },
    team2: { name: "New Zealand", code: "NZ", score: "—", wickets: "—", overs: "—" },
    status: "New Zealand need 42 runs in 22 balls",
  },
  {
    type: "Test Match",
    live: false,
    team1: { name: "Australia", code: "AUS", score: "412", wickets: "9", overs: "132.0" },
    team2: { name: "Pakistan", code: "PAK", score: "311", wickets: "10", overs: "101.4" },
    status: "Australia lead by 101 runs",
  },
  {
    type: "T20 League",
    live: false,
    team1: { name: "Chennai Super Kings", code: "CSK", score: "187", wickets: "5", overs: "20.0" },
    team2: { name: "Mumbai Indians", code: "MI", score: "176", wickets: "8", overs: "20.0" },
    status: "CSK won by 11 runs",
  },
  {
    type: "ODI",
    live: false,
    team1: { name: "India", code: "IND", score: "302", wickets: "7", overs: "50.0" },
    team2: { name: "Sri Lanka", code: "SL", score: "246", wickets: "10", overs: "48.1" },
    status: "India won by 56 runs",
  },
];

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
  {
    title: "Young talents to watch in upcoming IPL season",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
    meta: "IPL • Yesterday",
  },
];

/* ---------- STYLED ---------- */

const Page = styled.div`
  font-family: "Inter", sans-serif;
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

const TopStoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
`;

const StoryCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
`;

const StoryImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const StoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StoryTitle = styled.div`
  padding: 14px;
  font-weight: 600;
  line-height: 1.3;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
`;

const NewsImageWrapper = styled.div`
  height: 140px;
  overflow: hidden;
`;

const NewsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 12px 14px;
`;

const NewsTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 6px;
`;

const NewsMeta = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- PAGE ---------- */

const Home = () => {
  const { darkMode } = useTheme();

  const theme = {
    cardBg: darkMode ? "#151c2f" : "#ffffff",
    border: darkMode ? "#24304a" : "#e5e7eb",
    muted: darkMode ? "#9aa4b2" : "#64748b",
  };

  return (
    <Page>
      <Header />

      <Container>
        {/* LIVE NOW */}
        <SectionTitle>LIVE NOW</SectionTitle>
        <MatchCarousel matches={matchesData} cardsPerView={3} scrollBy={2} />

        {/* TOP STORIES */}
        <SectionTitle>TOP STORIES</SectionTitle>
        <TopStoriesGrid>
          {topStories.map((story, i) => (
            <StoryCard key={i} theme={theme}>
              <StoryImageWrapper>
                <StoryImage src={story.image} alt={story.title} />
              </StoryImageWrapper>
              <StoryTitle>{story.title}</StoryTitle>
            </StoryCard>
          ))}
        </TopStoriesGrid>

        {/* LATEST NEWS */}
        <SectionTitle>LATEST NEWS</SectionTitle>
        <NewsGrid>
          {latestNews.map((news, i) => (
            <NewsCard key={i} theme={theme}>
              <NewsImageWrapper>
                <NewsImage src={news.image} alt={news.title} />
              </NewsImageWrapper>
              <NewsContent>
                <NewsTitle>{news.title}</NewsTitle>
                <NewsMeta theme={theme}>{news.meta}</NewsMeta>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      </Container>
    </Page>
  );
};

export default Home;
