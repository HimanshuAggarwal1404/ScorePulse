import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME ---------- */

const tokens = {
  light: {
    pageBg: "#f6f7f9",
    cardBg: "#ffffff",
    border: "#e5e7eb",
    text: "#0f172a",
    muted: "#64748b",
    hover: "#f1f5f9",
    chip: "#eef2ff",
  },
  dark: {
    pageBg: "#0b1220",
    cardBg: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    hover: "#1e293b",
    chip: "#1e293b",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.pageBg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 16px;
`;

/* ---------- HEADER ---------- */

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

/* ---------- SEARCH ---------- */

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
  cursor: pointer;
`;

const SearchInput = styled.input`
  position: absolute;
  right: 0;
  width: ${({ open }) => (open ? "260px" : "0")};
  opacity: ${({ open }) => (open ? 1 : 0)};
  padding: ${({ open }) => (open ? "10px 12px" : "0")};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.25s ease;
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
`;

/* ---------- FILTERS ---------- */

const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ active, theme }) =>
    active ? theme.text : theme.chip};
  color: ${({ active, theme }) =>
    active ? theme.pageBg : theme.text};
  cursor: pointer;
`;

/* ---------- GRID ---------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;
`;

/* ---------- CARD ---------- */

const PlayerCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 14px;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-3px);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
`;

const NameBlock = styled.div``;

const PlayerName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const PlayerMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.muted};
`;

const RoleBadge = styled.div`
  margin-top: 10px;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  background: ${({ theme }) => theme.chip};
`;

const TeamLine = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.muted};
  margin-top: 8px;
`;

/* ---------- PAGE ---------- */

const Players = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");

  const inputRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/players")
      .then(res => res.json())
      .then(setPlayers);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const filtered = useMemo(() => {
    return players.filter(p => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.country?.toLowerCase().includes(q) ||
        p.franchise_name?.toLowerCase().includes(q);

      const matchesRole =
        roleFilter === "all" || p.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [players, search, roleFilter]);

  const roleLabel = (role) =>
    role === "wk"
      ? "Wicketkeeper"
      : role === "allrounder"
      ? "All-Rounder"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Page theme={theme}>
      <Header />
      <Container>
        <TitleRow>
          <PageTitle theme={theme}>Players</PageTitle>

          <SearchWrapper>
            <SearchButton theme={theme} onClick={() => setSearchOpen(o => !o)}>
              🔍
            </SearchButton>
            <SearchInput
              ref={inputRef}
              theme={theme}
              open={searchOpen}
              placeholder="Search players..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => !search && setSearchOpen(false)}
            />
          </SearchWrapper>
        </TitleRow>

        <Filters>
          {["all", "batsman", "bowler", "allrounder", "wk"].map(r => (
            <FilterChip
              key={r}
              theme={theme}
              active={roleFilter === r}
              onClick={() => setRoleFilter(r)}
            >
              {r === "all" ? "All" : roleLabel(r)}
            </FilterChip>
          ))}
        </Filters>

        <Grid>
          {filtered.map(p => (
            <PlayerCard key={p.id} theme={theme}>
              <TopRow>
                <Avatar theme={theme}>
                  {p.name.split(" ").map(w => w[0]).join("")}
                </Avatar>
                <NameBlock>
                  <PlayerName theme={theme}>{p.name}</PlayerName>
                  <PlayerMeta theme={theme}>{p.country}</PlayerMeta>
                </NameBlock>
              </TopRow>

              <RoleBadge theme={theme}>{roleLabel(p.role)}</RoleBadge>

              <TeamLine theme={theme}>
                {p.intl_team_code || ""}
                {p.franchise_name && ` • ${p.franchise_name}`}
              </TeamLine>
            </PlayerCard>
          ))}
        </Grid>
      </Container>
    </Page>
  );
};

export default Players;
