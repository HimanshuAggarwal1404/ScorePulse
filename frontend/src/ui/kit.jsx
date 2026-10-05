// Shared building blocks. Colours come from the CSS variables in index.scss,
// so everything here follows the light / dark theme automatically.
import React, { useLayoutEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { glass, pressable } from "./styles";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* LAYOUT                                                              */
/* ------------------------------------------------------------------ */

export const Page = styled.div`
  min-height: 100vh;
  color: var(--text);
  font-family: var(--font);
`;

export const Container = styled.main`
  width: 100%;
  max-width: ${({ $max }) => $max || "1180px"};
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem 3rem;
  }
`;

const HeaderWrap = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

export const Eyebrow = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.4rem;
`;

export const Title = styled.h1`
  text-wrap: balance;
  font-size: clamp(1.75rem, 3.2vw, 2.5rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.025em;
`;

export const Subtitle = styled.p`
  margin-top: 0.45rem;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.5;
  max-width: 60ch;
`;

export const PageHeader = ({ eyebrow, title, subtitle, children }) => (
  <HeaderWrap>
    <div>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </div>
    {children && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>}
  </HeaderWrap>
);

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: ${({ $flush }) => ($flush ? "0" : "2.5rem 0 1rem")};
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $min }) => $min || "220px"}, 1fr));
  gap: ${({ $gap }) => $gap || "1rem"};
`;

/* ------------------------------------------------------------------ */
/* MATERIALS                                                           */
/* ------------------------------------------------------------------ */

export const Glass = styled.div`
  ${glass}
  border-radius: ${({ $radius }) => $radius || "var(--radius-lg)"};
  padding: ${({ $pad }) => $pad ?? "1.25rem"};

  ${({ $interactive }) =>
    $interactive &&
    css`
      ${pressable}
      @media (hover: hover) {
        &:hover {
          border-color: var(--accent-line);
          box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow), 0 0 0 1px var(--accent-soft);
        }
      }
    `}
`;

/* ------------------------------------------------------------------ */
/* BUTTONS                                                             */
/* ------------------------------------------------------------------ */

const buttonBase = css`
  ${pressable}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  height: ${({ $size }) => ($size === "sm" ? "2rem" : "2.6rem")};
  padding: 0 ${({ $size }) => ($size === "sm" ? "0.85rem" : "1.15rem")};
  border-radius: var(--radius-pill);
  font-size: ${({ $size }) => ($size === "sm" ? "0.82rem" : "0.92rem")};
  font-weight: 650;
  letter-spacing: -0.005em;
  white-space: nowrap;
  text-decoration: none;
  border: 1px solid transparent;

  ${({ $variant }) => {
    if ($variant === "ghost")
      return css`
        background: var(--hover);
        border-color: var(--border);
        color: var(--text);
        @media (hover: hover) {
          &:hover {
            border-color: var(--border-strong);
          }
        }
      `;
    if ($variant === "danger")
      return css`
        background: var(--live);
        color: #fff;
      `;
    return css`
      background: var(--accent);
      color: var(--accent-ink);
      box-shadow: var(--glow);
      @media (hover: hover) {
        &:hover {
          filter: brightness(1.06);
        }
      }
    `;
  }}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Button = styled.button`
  ${buttonBase}
`;

export const ButtonLink = styled(Link)`
  ${buttonBase}
`;

/* ------------------------------------------------------------------ */
/* SEGMENTED CONTROL                                                   */
/* ------------------------------------------------------------------ */

const SegWrap = styled.div`
  ${glass}
  box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow-sm);
  position: relative;
  display: inline-flex;
  gap: 2px;
  padding: 4px;
  border-radius: var(--radius-pill);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SegIndicator = styled.span`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  border-radius: var(--radius-pill);
  background: var(--accent);
  box-shadow: var(--glow);
  /* CSS transitions re-target from the current value, so rapid taps never jump */
  transition: transform var(--settle) var(--ease), width var(--settle) var(--ease);
  will-change: transform, width;
`;

const SegButton = styled.button`
  position: relative;
  z-index: 1;
  border: 0;
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-size: 0.88rem;
  font-weight: 650;
  letter-spacing: -0.005em;
  white-space: nowrap;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text-2)")};
  transition: color var(--quick) var(--ease), transform var(--press) var(--ease);

  @media (max-width: 600px) {
    padding: 0.45rem 0.75rem;
    font-size: 0.84rem;
  }

  &:active {
    transform: scale(0.96);
  }
  @media (hover: hover) {
    &:hover {
      color: ${({ $active }) => ($active ? "var(--accent-ink)" : "var(--text)")};
    }
  }
`;

// Tabs with a sliding selection pill. items: [{ key, label }]
export const Segmented = ({ items, value, onChange, ariaLabel }) => {
  const wrap = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const el = wrap.current?.querySelector('[aria-selected="true"]');
    if (!el) return undefined;
    const measure = () => setBox({ x: el.offsetLeft, w: el.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [value, items.length]);

  return (
    <SegWrap ref={wrap} role="tablist" aria-label={ariaLabel}>
      {box && <SegIndicator style={{ transform: `translateX(${box.x}px)`, width: box.w }} />}
      {items.map((it) => (
        <SegButton
          key={it.key}
          role="tab"
          aria-selected={value === it.key}
          $active={value === it.key}
          onClick={() => onChange(it.key)}
        >
          {it.label}
        </SegButton>
      ))}
    </SegWrap>
  );
};

// Sticky strip for segmented controls; content scrolls under a soft edge, not a hard line.
export const StickyBar = styled.div`
  position: sticky;
  top: calc(var(--header-h) + 8px);
  z-index: 30;
  padding: 0.25rem 0 0.75rem;
  margin-bottom: 0.5rem;
`;

/* ------------------------------------------------------------------ */
/* SMALL PIECES                                                        */
/* ------------------------------------------------------------------ */

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $tone }) => ($tone === "live" ? "var(--live)" : $tone === "muted" ? "var(--muted)" : "var(--accent)")};
  background: ${({ $tone }) => ($tone === "live" ? "var(--live-soft)" : $tone === "muted" ? "var(--hover)" : "var(--accent-soft)")};
  border: 1px solid ${({ $tone }) => ($tone === "live" ? "transparent" : $tone === "muted" ? "var(--border)" : "var(--accent-line)")};
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 var(--live); opacity: 1; }
  70% { box-shadow: 0 0 0 7px transparent; opacity: 0.85; }
  100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
`;

export const LiveDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: var(--live);
  animation: ${pulse} 1.8s var(--ease) infinite;
`;

export const LiveTag = () => (
  <Tag $tone="live">
    <LiveDot />
    Live
  </Tag>
);

export const Muted = styled.span`
  color: var(--muted);
  font-size: ${({ $size }) => $size || "0.875rem"};
`;

// $subtle for long lists (restraint); the neon gradient is for hero moments.
export const Avatar = styled.div`
  width: ${({ $size }) => $size || "44px"};
  height: ${({ $size }) => $size || "44px"};
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 750;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: ${({ $subtle }) => ($subtle ? "var(--accent)" : "var(--accent-ink)")};
  background: ${({ $subtle }) =>
    $subtle ? "var(--accent-soft)" : "linear-gradient(140deg, var(--accent), var(--accent-2))"};
  border: 1px solid ${({ $subtle }) => ($subtle ? "var(--accent-line)" : "transparent")};
  box-shadow: ${({ $subtle }) => ($subtle ? "none" : "inset 0 1px 0 rgba(255, 255, 255, 0.3), var(--glow)")};
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 0.7rem 0.75rem;
    text-align: right;
    white-space: nowrap;
    border-bottom: 1px solid var(--border);
  }
  th:first-child,
  td:first-child {
    text-align: left;
    white-space: normal;
  }
  th {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
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
    border-bottom: 0;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  margin: 0 -0.25rem;
`;

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const Skeleton = styled.div`
  height: ${({ $h }) => $h || "12px"};
  width: ${({ $w }) => $w || "100%"};
  border-radius: ${({ $r }) => $r || "8px"};
  background: linear-gradient(90deg, var(--hover) 25%, var(--border) 37%, var(--hover) 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.6s ease infinite;
`;

export const SearchField = styled.input`
  ${glass}
  box-shadow: inset 0 1px 0 var(--glass-highlight);
  height: 2.6rem;
  width: ${({ $w }) => $w || "260px"};
  padding: 0 1rem 0 2.4rem;
  border-radius: var(--radius-pill);
  font-size: 0.92rem;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2386948c' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='7' cy='7' r='5'/%3E%3Cpath d='m14 14-3.2-3.2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 0.9rem center;
  transition: border-color var(--quick) var(--ease), box-shadow var(--quick) var(--ease);

  &::placeholder {
    color: var(--muted);
  }
  &:focus {
    border-color: var(--accent-line);
    box-shadow: 0 0 0 4px var(--accent-soft);
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;
