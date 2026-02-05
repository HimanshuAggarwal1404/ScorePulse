import React, { useState, useEffect } from "react";
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

/* ---------- Components ---------- */

import EntryAnimation from "./Components/EntryAnimation";

/* ---------- App ---------- */

const App = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("introPlayed");
    if (!seen) {
      setShowIntro(true);
    }
  }, []);

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
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/fixtures" element={<Fixtures />} />

        {/* Tournaments */}
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournament/:id" element={<PointsTable />} />
        <Route path="/tournament/:id/points" element={<PointsTable />} />
        <Route path="/match/:id" element={<MatchDetails />} />


        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
