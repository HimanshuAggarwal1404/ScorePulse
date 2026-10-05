import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { chipColor, tint } from "./theme";
import { glass, pressable } from "../../ui/styles";

export const Card = styled.section`
  ${glass}
  border-radius: var(--radius-lg);
  padding: ${({ $pad }) => $pad ?? "1.25rem"};
  margin-bottom: 1rem;
  color: var(--text);
`;

export const Heading = styled.h3`
  font-family: var(--font);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 0.75rem;
`;

export const Muted = styled.span`
  color: var(--muted);
  font-size: ${({ $size }) => $size || "0.86rem"};
`;

export const TableWrap = styled.div`
  overflow-x: auto;
  margin: 0 -4px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 0.6rem 0.45rem;
    border-bottom: 1px solid var(--border);
    text-align: right;
    white-space: nowrap;
  }
  th:first-child,
  td:first-child {
    text-align: left;
    white-space: normal;
  }
  th {
    color: var(--muted);
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  tbody tr {
    transition: background-color var(--quick) var(--ease);
  }
  @media (hover: hover) {
    tbody tr:hover {
      background: var(--hover);
    }
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  td.strong {
    font-weight: 750;
    color: var(--text);
  }
`;

export const Sub = styled.div`
  font-size: 0.76rem;
  color: var(--muted);
  margin-top: 2px;
`;

const ChipBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $size }) => ($size === "sm" ? "26px" : "32px")};
  height: ${({ $size }) => ($size === "sm" ? "26px" : "32px")};
  padding: 0 6px;
  border-radius: 999px;
  font-size: ${({ $size }) => ($size === "sm" ? "0.7rem" : "0.78rem")};
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  color: ${({ $solid, $color }) => ($solid ? "var(--bg)" : $color)};
  background: ${({ $color, $solid }) => ($solid ? $color : tint($color, 10))};
  border: 1px solid ${({ $color, $solid }) => ($solid ? "transparent" : tint($color, 35))};
  box-shadow: ${({ $color, $solid }) => ($solid ? `0 0 14px ${tint($color, 45)}` : "none")};
`;

export const BallChip = ({ chip, kind, t, size }) => {
  const solid = ["wicket", "four", "six"].includes(kind);
  return (
    <ChipBox $color={chipColor(kind, t)} $solid={solid} $size={size}>
      {chip}
    </ChipBox>
  );
};

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: var(--text);
  text-decoration: none;
  font-weight: 650;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size var(--settle) var(--ease), color var(--quick) var(--ease);

  @media (hover: hover) {
    &:hover {
      color: var(--accent);
      background-size: 100% 1px;
    }
  }
`;

// Links to the stats profile when the player is matched to one.
export const PlayerName = ({ player, suffix }) => {
  const label = (
    <>
      {player.name}
      {player.isCaptain ? " (c)" : ""}
      {player.isKeeper ? " (wk)" : ""}
      {suffix}
    </>
  );
  return player.profileId ? (
    <StyledLink to={`/players/${player.profileId}`}>{label}</StyledLink>
  ) : (
    <span style={{ fontWeight: 650 }}>{label}</span>
  );
};

export const Pill = styled.button`
  ${pressable}
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "var(--border)")};
  background: ${({ $active }) => ($active ? "var(--accent)" : "var(--hover)")};
  color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text-2)")};
  box-shadow: ${({ $active }) => ($active ? "var(--glow)" : "none")};
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  font-weight: 650;
  font-size: 0.84rem;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text)")};
      border-color: ${({ $active }) => ($active ? "transparent" : "var(--border-strong)")};
    }
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: ${({ $gap }) => $gap || "12px"};
  flex-wrap: wrap;
  align-items: ${({ $align }) => $align || "center"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 var(--live); }
  70% { box-shadow: 0 0 0 7px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

export const LiveDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--live);
  margin-right: 6px;
  flex: none;
  animation: ${pulse} 1.8s var(--ease) infinite;
`;
