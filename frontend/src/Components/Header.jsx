import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/Logo.png";
import { useTheme } from "../context/ThemeContext";

/* ---------- Animations ---------- */

const rotate = keyframes`
  from { transform: rotate(0deg) scale(0.9); }
  to { transform: rotate(180deg) scale(1); }
`;

const smoothOpen = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0.95) translateY(-6px);
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
`;

/* ---------- Layout ---------- */

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${({ dark }) => (dark ? "#10172a" : "#ffffff")};
  border-bottom: ${({ dark }) =>
    dark ? "1px solid #1e293b" : "1px solid #e5e7eb"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  font-family: "Inter", sans-serif;
`;

/* ---------- Left ---------- */

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.img`
  height: 36px;
`;

const Brand = styled.a`
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};
`;

/* ---------- Right Cluster ---------- */

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

/* ---------- Desktop Nav ---------- */

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled.a`
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ dark }) => (dark ? "#cbd5e1" : "#334155")};

  &:hover {
    color: ${({ dark }) => (dark ? "#ffffff" : "#0f172a")};
  }
`;

/* ---------- Controls ---------- */

const Toggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 4px;
  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};

  &.animate {
    animation: ${rotate} 0.35s ease;
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};

  @media (max-width: 900px) {
    display: block;
  }
`;

/* ---------- Mobile Menu ---------- */

const MobileMenu = styled.div`
  background: ${({ dark }) => (dark ? "#10172a" : "#ffffff")};
  border-bottom: ${({ dark }) =>
    dark ? "1px solid #1e293b" : "1px solid #e5e7eb"};
  animation: ${smoothOpen} 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top;
`;

const MobileNavItem = styled.a`
  display: block;
  padding: 14px 20px;
  text-decoration: none;
  font-weight: 600;
  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};

  &:hover {
    background: ${({ dark }) => (dark ? "#1e293b" : "#f1f5f9")};
  }
`;

/* ---------- Component ---------- */

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "Teams", href: "/teams" },
    { label: "Rankings", href: "/rankings" },
    { label: "Players", href: "/players" },
    { label: "Fixtures", href: "/fixtures" },
    { label: "Tournaments", href: "/tournaments" },
  ];

  const handleToggle = () => {
    setAnimate(true);
    toggleDarkMode();
    setTimeout(() => setAnimate(false), 350);
  };

  return (
    <HeaderWrapper>
      <HeaderContainer dark={darkMode}>
        <Left>
          <Logo src={logo} alt="ScorePulse logo" />
          <Brand href="/" dark={darkMode}>
            ScorePulse
          </Brand>
        </Left>

        <Right>
          <Nav>
            {links.map((l) => (
              <NavItem key={l.href} href={l.href} dark={darkMode}>
                {l.label}
              </NavItem>
            ))}
          </Nav>

          <Toggle
            dark={darkMode}
            className={animate ? "animate" : ""}
            onClick={handleToggle}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </Toggle>

          <Hamburger
            dark={darkMode}
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </Hamburger>
        </Right>
      </HeaderContainer>

      {open && (
        <MobileMenu dark={darkMode}>
          {links.map((l) => (
            <MobileNavItem
              key={l.href}
              href={l.href}
              dark={darkMode}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </MobileNavItem>
          ))}
        </MobileMenu>
      )}
    </HeaderWrapper>
  );
};

export default Header;
