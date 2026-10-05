import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useTheme } from "../context/ThemeContext";
import { glass, pressable } from "../ui/styles";

/* ---------- Layout ---------- */

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-h);
  background: var(--glass-strong);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  font-family: var(--font);

  /* scroll edge: a soft fade where content meets the bar, only once content is underneath */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 18px;
    pointer-events: none;
    background: linear-gradient(to bottom, var(--glass-strong), transparent);
    opacity: ${({ $scrolled }) => ($scrolled ? 1 : 0)};
    transition: opacity var(--quick) var(--ease);
  }
`;

const Inner = styled.div`
  height: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: -0.02em;

  img {
    height: 30px;
    width: auto;
    border-radius: 8px;
    /* the logo artwork is blue; shift it onto the neon-green palette */
    filter: hue-rotate(-85deg) saturate(1.35) brightness(1.1);
  }
  span b {
    color: var(--accent);
    font-weight: 750;
  }
`;

/* ---------- Desktop nav ---------- */

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: var(--radius-pill);
  background: var(--hover);
  border: 1px solid var(--border);

  @media (max-width: 960px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  ${pressable}
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-pill);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "var(--text)" : "var(--muted)")};
  background: ${({ $active }) => ($active ? "var(--solid-2)" : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "inset 0 1px 0 var(--glass-highlight), var(--shadow-sm)" : "none")};

  @media (hover: hover) {
    &:hover {
      color: var(--text);
    }
  }
`;

const LiveMark = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--live);
  box-shadow: 0 0 8px var(--live);
`;

/* ---------- Controls ---------- */

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  ${pressable}
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--hover);
  color: var(--text);

  svg {
    width: 18px;
    height: 18px;
  }
  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-line);
      color: var(--accent);
    }
  }
`;

const MenuButton = styled(IconButton)`
  display: none;
  @media (max-width: 960px) {
    display: grid;
  }
`;

/* ---------- Mobile sheet: grows from the menu button, leaves the same way ---------- */

// Rendered outside the bar: a backdrop-filter nested in another one can't see the page behind it.
const Scrim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 98;
  background: rgba(0, 0, 0, 0.35);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition:
    opacity var(--settle) var(--ease),
    visibility var(--settle);

  @media (min-width: 961px) {
    display: none;
  }
`;

const Sheet = styled.div`
  ${glass}
  background: var(--glass-strong);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  position: fixed;
  z-index: 101;
  top: calc(var(--header-h) + 4px);
  right: 1rem;
  width: min(300px, calc(100vw - 2rem));
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  box-shadow:
    inset 0 1px 0 var(--glass-highlight),
    var(--shadow-lg);
  transform-origin: top right;
  transition:
    opacity var(--quick) var(--ease),
    transform var(--settle) var(--ease),
    filter var(--settle) var(--ease),
    visibility var(--settle);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? "scale(1)" : "scale(0.92) translateY(-6px)")};
  filter: ${({ $open }) => ($open ? "blur(0)" : "blur(6px)")};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};

  @media (min-width: 961px) {
    display: none;
  }
`;

const SheetLink = styled(Link)`
  ${pressable}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "var(--accent)" : "var(--text)")};
  background: ${({ $active }) => ($active ? "var(--accent-soft)" : "transparent")};
`;

/* ---------- Icons ---------- */

const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const Burger = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
);

/* ---------- Component ---------- */

const LINKS = [
  { label: "Home", to: "/", match: (p) => p === "/" },
  {
    label: "Live Scores",
    to: "/fixtures?type=live",
    live: true,
    match: (p, q) => p === "/fixtures" && q.get("type") === "live",
  },
  {
    label: "Fixtures",
    to: "/fixtures?type=upcoming",
    match: (p, q) => (p === "/fixtures" && q.get("type") !== "live") || p.startsWith("/match"),
  },
  { label: "Teams", to: "/teams", match: (p) => p.startsWith("/teams") },
  { label: "Players", to: "/players", match: (p) => p.startsWith("/players") },
  { label: "Rankings", to: "/rankings", match: (p) => p.startsWith("/rankings") },
  { label: "Tournaments", to: "/tournaments", match: (p) => p.startsWith("/tournament") },
];

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Bar $scrolled={scrolled}>
        <Inner>
          <Brand to="/" aria-label="ScorePulse home">
            <img src={logo} alt="" />
            <span>
              Score<b>Pulse</b>
            </span>
          </Brand>

          <Nav aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.label} to={l.to} $active={l.match(pathname, query)}>
                {l.live && <LiveMark />}
                {l.label}
              </NavLink>
            ))}
          </Nav>

          <Right>
            <IconButton
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            >
              {darkMode ? <Sun /> : <Moon />}
            </IconButton>
            <MenuButton onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              <Burger open={open} />
            </MenuButton>
          </Right>
        </Inner>
      </Bar>

      <Scrim $open={open} onClick={() => setOpen(false)} aria-hidden />
      <Sheet $open={open} aria-hidden={!open}>
        {LINKS.map((l) => (
          <SheetLink
            key={l.label}
            to={l.to}
            $active={l.match(pathname, query)}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {l.label}
            {l.live && <LiveMark />}
          </SheetLink>
        ))}
      </Sheet>
    </>
  );
};

export default Header;
