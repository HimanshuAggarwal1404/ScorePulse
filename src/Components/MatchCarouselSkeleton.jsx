import React from "react";
import styled from "styled-components";

const SkeletonRow = styled.div`
  display: flex;
  gap: 16px;
  overflow: hidden;
`;

const SkeletonCard = styled.div`
  width: 280px;
  height: 140px;
  border-radius: 14px;
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 37%,
    #e5e7eb 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const MatchCarouselSkeleton = () => {
  return (
    <SkeletonRow>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </SkeletonRow>
  );
};

export default MatchCarouselSkeleton;
