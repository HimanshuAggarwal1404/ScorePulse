import React from "react";
import styled from "styled-components";
import logo from "../assets/Logo.png";
import { useTheme } from "../context/ThemeContext";

/* ---------- Styled ---------- */

const HeaderContainer = styled.div`
  background-color: ${({ dark }) => (dark ? "#10172a" : "#1a2433")};
  width: 100vw;
  height: 12vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  font-family: "Inter", sans-serif;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  a {
    text-decoration: none;
    color: white;
    font-size: 1.7rem;
    font-weight: 700;
  }
`;

const Navbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const Logo = styled.img`
  height: 40px;
`;

const Toggle = styled.button`
  margin-left: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

/* ---------- Component ---------- */

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <HeaderContainer dark={darkMode}>
      <Title>
        <Logo src={logo} alt="ScorePulse" />
        <a href="/">ScorePulse</a>
      </Title>

      <Navbar>
        <NavItem href="/">Home</NavItem>
        <NavItem href="/teams">Teams</NavItem>
        <NavItem href="/rankings">Standings</NavItem>
        <NavItem href="/players">Players</NavItem>
        <NavItem href="/fixtures">Fixtures</NavItem>

        <Toggle onClick={toggleDarkMode}>{darkMode ? "☀️" : "🌙"}</Toggle>
      </Navbar>
    </HeaderContainer>
  );
};

export default Header;
