import React, { useRef, useState, useEffect } from "react";
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
  flex: 0 0 ${({ perView }) => 100 / perView}%;
  scroll-snap-align: start;
`;

/* ---------- Arrows ---------- */

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

  /* Mobile: smaller + inside */
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
`;

const LeftArrow = styled(Arrow)`
  left: -14px;

  @media (max-width: 768px) {
    left: 6px;
  }
`;

const RightArrow = styled(Arrow)`
  right: -14px;

  @media (max-width: 768px) {
    right: 6px;
  }
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
  const [isMobile, setIsMobile] = useState(false);

  /* ---------- Detect Mobile ---------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const effectiveCardsPerView = isMobile ? 1 : cardsPerView;
  const effectiveScrollBy = isMobile ? 1 : scrollBy;

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;

    setAtStart(el.scrollLeft <= 5);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 5);
  };

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;

    const cardWidth =
      el.clientWidth / effectiveCardsPerView + gap;

    el.scrollBy({
      left: dir * cardWidth * effectiveScrollBy,
      behavior: "smooth",
    });

    setTimeout(updateEdges, 300);
  };

  return (
    <Wrapper>
      {/* Arrows */}
      <LeftArrow disabled={atStart} onClick={() => scroll(-1)}>
        ‹
      </LeftArrow>

      <RightArrow disabled={atEnd} onClick={() => scroll(1)}>
        ›
      </RightArrow>

      {/* Track */}
      <Track ref={trackRef} gap={gap} onScroll={updateEdges}>
        {matches.map((match, i) => (
          <Item key={i} perView={effectiveCardsPerView}>
            <MatchCard matchData={match} />
          </Item>
        ))}
      </Track>
    </Wrapper>
  );
};

export default MatchCarousel;
