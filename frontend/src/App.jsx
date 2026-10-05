import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ---------- Pages ---------- */

import Home from "./Pages/Home";
import Teams from "./Pages/Teams";
import Players from "./Pages/Players";
import Rankings from "./Pages/Rankings";
import Fixtures from "./Pages/Fixtures";
import Tournaments from "./Pages/Tournaments";
import PointsTable from "./Pages/PointsTable";
import ErrorPage from "./Pages/ErrorPage";
import NetworkBanner from "./Components/NetworkBanner";
import MatchDetails from "./Pages/MatchDetails";
import TeamDetails from "./Pages/TeamDetails";
import PlayerProfile from "./Pages/PlayerProfile";
import Scorer from "./Pages/Scorer";
import ScorerConsole from "./Pages/ScorerConsole";
/* ---------- Components ---------- */

import EntryAnimation from "./Components/EntryAnimation";

/* ---------- App ---------- */

const App = () => {
  // play the intro once per browser session
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("introPlayed"));

  const handleFinish = () => {
    sessionStorage.setItem("introPlayed", "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <EntryAnimation onFinish={handleFinish} />;
  }

  return (
    <BrowserRouter>
            <NetworkBanner />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Core Pages */}
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/:id" element={<PlayerProfile />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/fixtures" element={<Fixtures />} />

        {/* Tournaments */}
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournament/:id" element={<PointsTable />} />
        <Route path="/tournament/:id/points" element={<PointsTable />} />
        <Route path="/match/:id" element={<MatchDetails />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />

        {/* Live scoring */}
        <Route path="/scorer" element={<Scorer />} />
        <Route path="/scorer/:id" element={<ScorerConsole />} />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
