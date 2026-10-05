import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const initialDark = () => {
  const stored = localStorage.getItem("theme");
  // 1️⃣ User preference (highest priority)
  if (stored === "dark") return true;
  if (stored === "light") return false;
  // 2️⃣ System preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(initialDark);

  // Colours live in CSS variables keyed off <html data-theme>, see index.scss
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkMode ? "#050806" : "#f3f6f4");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
