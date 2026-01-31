import React, { useRef, useState } from "react";
import styled from "styled-components";
import MatchCard from "./MatchCard";

/* ---------- Styled ---------- */

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Track = styled.div`
  display: flex;
  gap: ${({ gap }) => gap}px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 6px 2px 14px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div`
  flex: 0 0 ${({ cardsPerView }) => 100 / cardsPerView}%;
  scroll-snap-align: start;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;

  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 0.9)};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  }
`;

const LeftArrow = styled(Arrow)`
  left: -14px;
`;

const RightArrow = styled(Arrow)`
  right: -14px;
`;

/* ---------- Component ---------- */

const MatchCarousel = ({
  matches = [],
  cardsPerView = 3,
  scrollBy = 2,
  gap = 16,
}) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    setAtStart(el.scrollLeft <= 5);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
  };

  const scroll = (dir) => {
    const cardWidth =
      trackRef.current.clientWidth / cardsPerView + gap;

    trackRef.current.scrollBy({
      left: dir * cardWidth * scrollBy,
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
            <MatchCard matchData={match} />
          </Item>
        ))}
      </Track>
    </Wrapper>
  );
};

export default MatchCarousel;
