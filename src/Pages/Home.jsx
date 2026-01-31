import React from "react";
import Header from "../Components/Header";
import MatchCarousel from "../Components/MatchCarousel";

/* ---------- Raw Match Data ---------- */

const matchesData = [
  {
    type: "T20 International",
    live: true,
    team1: { name: "India", code: "IND", score: "187", wickets: "4", overs: "20.0" },
    team2: { name: "Australia", code: "AUS", score: "142", wickets: "7", overs: "18.2" },
    status: "India won by 45 runs",
  },
  {
    type: "ODI",
    live: true,
    team1: { name: "England", code: "ENG", score: "268", wickets: "6", overs: "47.3" },
    team2: { name: "South Africa", code: "SA", score: "198", wickets: "5", overs: "39.1" },
    status: "South Africa need 71 runs in 65 balls",
  },
  {
    type: "Test Match",
    live: false,
    team1: { name: "India", code: "IND", score: "421", wickets: "9", overs: "124.0" },
    team2: { name: "England", code: "ENG", score: "312", wickets: "10", overs: "98.4" },
    status: "India lead by 109 runs",
  },
];

/* ---------- Helper: determine LIVE safely ---------- */

const isLiveMatch = (match) => {
  const status = match.status?.toLowerCase() || "";

  const isCompleted =
    status.includes("won") ||
    status.includes("beat") ||
    status.includes("draw") ||
    status.includes("tie") ||
    status.includes("no result") ||
    status.includes("abandoned");

  return match.live && !isCompleted;
};

/* ---------- Sort: LIVE first ---------- */

const sortedMatches = [...matchesData].sort((a, b) => {
  const aLive = isLiveMatch(a);
  const bLive = isLiveMatch(b);

  if (aLive === bLive) return 0;
  return aLive ? -1 : 1;
});

/* ---------- Page ---------- */

const Home = () => {
  return (
    <>
      <Header />
      <MatchCarousel
        matches={sortedMatches}
        cardsPerView={3}
        scrollBy={2}
      />
    </>
  );
};

export default Home;
