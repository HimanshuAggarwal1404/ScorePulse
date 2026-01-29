import React from 'react'
import styled from 'styled-components'
import logo from '../assets/Logo.png'
const HeaderContainer = styled.div`
a{
  text-decoration: none;
  color: white;}
  background-color: #1a2433;
  width: 100vw;
  height:12vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  font-size: 1.7rem;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
`;
const Title = styled.div`
height: 100%;
width: 30%;
display: flex;
align-items: center;
justify-content: left;
gap: 1rem;
`;
const Navbar = styled.div`
height: 100%;
width: 60%;
display: flex;
flex-direction: row;
justify-content: space-around;
align-items: center;`;
const NavItem = styled.div`
a{
color: white;
text-decoration: none;
width: auto;
font-size: 1rem;
transition: color 0.4s ease;
&:hover {
    cursor: pointer;
    color: #f5f5f5cb;}
}`;
const Logo = styled.img`
  height: 60%;
  width: auto;
  object-fit: contain;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <Title><Logo src={logo} alt="ScorePulse" /><a href="/">ScorePulse</a></Title>
            <Navbar>
                <NavItem><a href="/">Home</a></NavItem>
                <NavItem><a href="/live-scores">Live Scores</a></NavItem>
                <NavItem><a href="/Teams">Teams</a></NavItem>
                <NavItem><a href="/Players">Players</a></NavItem>
                <NavItem><a href="/Fixtures">Fixtures</a></NavItem>
                <NavItem><a href="/Standings">Standings</a></NavItem>

            </Navbar>
        </HeaderContainer>
    )
}

export default Header