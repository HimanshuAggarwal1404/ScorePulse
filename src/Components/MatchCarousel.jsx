import React, { useRef, useState } from "react";
import styled from "styled-components";
import MatchCard from "./MatchCard";

/* ---------- Wrapper ---------- */

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

/* ---------- Track ---------- */

const Track = styled.div`
  display: flex;
  gap: ${({ gap }) => gap}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 4px 2px 12px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div`
  flex: 0 0 ${({ cardsPerView }) => 100 / cardsPerView}%;
  scroll-snap-align: start;
`;

/* ---------- Arrows ---------- */

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;

  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${({ disabled }) =>
    disabled ? "#ddd" : "rgba(0,0,0,0.65)"};

  color: white;
  font-size: 18px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 0.85)};
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  }
`;

const LeftArrow = styled(Arrow)`
  left: -12px;
`;

const RightArrow = styled(Arrow)`
  right: -12px;
`;

/* ---------- Component ---------- */

const MatchCarousel = ({
  matches = [],
  cardsPerView = 3,
  scrollBy = 2,
  gap = 16,
  darkMode = false,
}) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    setAtStart(el.scrollLeft <= 5);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
  };

  const scroll = (direction) => {
    const cardWidth =
      trackRef.current.clientWidth / cardsPerView + gap;

    trackRef.current.scrollBy({
      left: direction * cardWidth * scrollBy,
      behavior: "smooth",
    });

    setTimeout(updateEdges, 300);
  };

  return (
    <Wrapper>
      <LeftArrow disabled={atStart} onClick={() => scroll(-1)}>
        ‹
      </LeftArrow>

      <RightArrow disabled={atEnd} onClick={() => scroll(1)}>
        ›
      </RightArrow>

      <Track ref={trackRef} gap={gap} onScroll={updateEdges}>
        {matches.map((match, i) => (
          <Item key={i} cardsPerView={cardsPerView}>
            <MatchCard matchData={match} darkMode={darkMode} />
          </Item>
        ))}
      </Track>
    </Wrapper>
  );
};

export default MatchCarousel;
