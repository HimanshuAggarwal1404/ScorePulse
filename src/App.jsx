import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Teams from "./Pages/Teams";
import Players from "./Pages/Players";
import Rankings from "./Pages/Rankings";
import ErrorPage from "./Pages/ErrorPage";
import EntryAnimation from "./Components/EntryAnimation";
import Fixtures from "./Pages/Fixtures";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/fixtures" element={<Fixtures />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
