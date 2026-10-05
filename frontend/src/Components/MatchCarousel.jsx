import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MatchCard from "./MatchCard";
import { glass, pressable } from "../ui/styles";

/* ---------- Styled ---------- */

const Wrapper = styled.div`
  position: relative;
`;

// Native scroll + snap: the browser supplies 1:1 tracking and momentum.
const Track = styled.div`
  display: flex;
  gap: ${({ $gap }) => $gap}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  padding: 4px 2px 18px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div`
  flex: 0 0 calc((100% - ${({ $gap, $perView }) => $gap * ($perView - 1)}px) / ${({ $perView }) => $perView});
  scroll-snap-align: start;
  min-width: 0;
`;

const Arrow = styled.button`
  ${glass}
  ${pressable}
  position: absolute;
  top: calc(50% - 9px);
  translate: 0 -50%;
  z-index: 5;
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--text);
  box-shadow: inset 0 1px 0 var(--glass-highlight), var(--shadow);
  opacity: ${({ disabled }) => (disabled ? 0 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  transition: opacity var(--quick) var(--ease), transform var(--press) var(--ease);

  svg {
    width: 16px;
    height: 16px;
  }
  @media (hover: hover) {
    &:hover {
      color: var(--accent);
      border-color: var(--accent-line);
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const Left = styled(Arrow)`
  left: -1.1rem;
`;

const Right = styled(Arrow)`
  right: -1.1rem;
`;

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir < 0 ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} />
  </svg>
);

/* ---------- Component ---------- */

const MatchCarousel = ({ matches = [], cardsPerView = 3, scrollBy = 2, gap = 16 }) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const perView = width < 640 ? 1.15 : width < 960 ? 2 : cardsPerView;

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 5);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
  };

  useEffect(updateEdges, [matches.length, perView]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = (el.clientWidth - gap * (Math.ceil(perView) - 1)) / perView + gap;
    el.scrollBy({ left: dir * card * Math.max(1, Math.min(scrollBy, Math.floor(perView))), behavior: "smooth" });
  };

  return (
    <Wrapper>
      <Left disabled={atStart} onClick={() => scroll(-1)} aria-label="Previous matches">
        <Chevron dir={-1} />
      </Left>
      <Right disabled={atEnd} onClick={() => scroll(1)} aria-label="More matches">
        <Chevron dir={1} />
      </Right>

      <Track ref={trackRef} $gap={gap} onScroll={updateEdges}>
        {matches.map((match) => (
          <Item key={match.id} $perView={perView} $gap={gap}>
            <MatchCard matchData={match} />
          </Item>
        ))}
      </Track>
    </Wrapper>
  );
};

export default MatchCarousel;
