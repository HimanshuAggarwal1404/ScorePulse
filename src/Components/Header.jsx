import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../assets/Logo.png";
import { useTheme } from "../context/ThemeContext";

/* ---------- Animations ---------- */

const rotate = keyframes`
  from {
    transform: rotate(0deg) scale(0.85);
  }
  to {
    transform: rotate(180deg) scale(1);
  }
`;

/* ---------- Styled ---------- */

const HeaderContainer = styled.header`
  width: 100%;
  height: 64px;

  background-color: ${({ dark }) => (dark ? "#10172a" : "#ffffff")};
  border-bottom: ${({ dark }) =>
    dark ? "1px solid #1e293b" : "1px solid #e5e7eb"};

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.75rem;

  font-family: "Inter", sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
`;

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
  letter-spacing: -0.3px;
  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.75rem;
`;

const NavItem = styled.a`
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ dark }) => (dark ? "#cbd5e1" : "#334155")};

  transition: color 0.2s ease;

  &:hover {
    color: ${({ dark }) => (dark ? "#ffffff" : "#0f172a")};
  }
`;

const Toggle = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;

  font-size: 1.25rem;
  line-height: 1;
  padding: 4px;

  color: ${({ dark }) => (dark ? "#f5f7fa" : "#0f172a")};

  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }

  &.animate {
    animation: ${rotate} 0.35s ease;
  }
`;

/* ---------- Component ---------- */

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [animate, setAnimate] = useState(false);

  const handleToggle = () => {
    setAnimate(true);
    toggleDarkMode();
    setTimeout(() => setAnimate(false), 350);
  };

  return (
    <HeaderContainer dark={darkMode}>
      <Left>
        <Logo src={logo} alt="ScorePulse logo" />
        <Brand href="/" dark={darkMode}>
          ScorePulse
        </Brand>
      </Left>

      <Nav>
        <NavItem dark={darkMode} href="/">
          Home
        </NavItem>
        <NavItem dark={darkMode} href="/teams">
          Teams
        </NavItem>
        <NavItem dark={darkMode} href="/rankings">
          Rankings
        </NavItem>
        <NavItem dark={darkMode} href="/players">
          Players
        </NavItem>
        <NavItem dark={darkMode} href="/fixtures">
          Fixtures
        </NavItem>
        <NavItem dark={darkMode} href="/tournaments">
          Tournaments
        </NavItem>

        <Toggle
          dark={darkMode}
          className={animate ? "animate" : ""}
          onClick={handleToggle}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </Toggle>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
