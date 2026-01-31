import React from 'react'
import Header from '../Components/Header'
import MatchCarousel from '../Components/MatchCarousel'
const matchesData = [
  {
    type: "T20 International",
    live: true,
    team1: {
      name: "India",
      code: "IND",
      score: "187",
      wickets: "4",
      overs: "20.0",
    },
    team2: {
      name: "Australia",
      code: "AUS",
      score: "142",
      wickets: "7",
      overs: "18.2",
    },
    status: "India won by 45 runs",
  },
  {
    type: "ODI",
    live: true,
    team1: {
      name: "England",
      code: "ENG",
      score: "268",
      wickets: "6",
      overs: "47.3",
    },
    team2: {
      name: "South Africa",
      code: "SA",
      score: "198",
      wickets: "5",
      overs: "39.1",
    },
    status: "South Africa need 71 runs in 65 balls",
  },
  {
    type: "Test Match",
    live: false,
    team1: {
      name: "India",
      code: "IND",
      score: "421",
      wickets: "9",
      overs: "124.0",
    },
    team2: {
      name: "England",
      code: "ENG",
      score: "312",
      wickets: "10",
      overs: "98.4",
    },
    status: "India lead by 109 runs",
  },
  {
    type: "IPL 2025",
    live: true,
    team1: {
      name: "Chennai Super Kings",
      code: "CSK",
      score: "176",
      wickets: "5",
      overs: "19.2",
    },
    team2: {
      name: "Mumbai Indians",
      code: "MI",
      score: "168",
      wickets: "7",
      overs: "18.4",
    },
    status: "CSK need 9 runs in 8 balls",
  },
  {
    type: "Big Bash League",
    live: false,
    team1: {
      name: "Sydney Sixers",
      code: "SIX",
      score: "162",
      wickets: "8",
      overs: "20.0",
    },
    team2: {
      name: "Melbourne Stars",
      code: "STA",
      score: "154",
      wickets: "10",
      overs: "19.1",
    },
    status: "Sixers won by 8 runs",
  },
  {
    type: "Asia Cup",
    live: true,
    team1: {
      name: "Pakistan",
      code: "PAK",
      score: "214",
      wickets: "6",
      overs: "44.0",
    },
    team2: {
      name: "Sri Lanka",
      code: "SL",
      score: "180",
      wickets: "4",
      overs: "38.2",
    },
    status: "Sri Lanka need 35 runs in 34 balls",
  },
];


const Home = () => {
  return (
    <>
      <Header />
<MatchCarousel
  matches={matchesData}
  cardsPerView={3}
  scrollBy={2}
  // darkMode
/>
    </>
  )
}

export default Home