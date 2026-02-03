import React from "react";
import styled, { keyframes } from "styled-components";

/* ---------- SHIMMER ---------- */

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/* ---------- LAYOUT ---------- */

const SkeletonRow = styled.div`
  display: flex;
  gap: 16px;
  overflow: hidden;
`;

/* responsive cards per row */
const SkeletonItem = styled.div`
  flex: 0 0 calc(33.333% - 12px);

  @media (max-width: 900px) {
    flex: 0 0 calc(50% - 12px);
  }

  @media (max-width: 600px) {
    flex: 0 0 100%;
  }
`;

/* ---------- CARD ---------- */

const Card = styled.div`
  height: 150px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #24304a;
  background: #151c2f;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* ---------- SKELETON BLOCK ---------- */

const Line = styled.div`
  height: ${({ h }) => h || 10}px;
  width: ${({ w }) => w || "100%"};
  border-radius: 6px;

  background: linear-gradient(
    90deg,
    #1e293b 25%,
    #24304a 37%,
    #1e293b 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ---------- ROWS ---------- */

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TeamRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

/* ---------- COMPONENT ---------- */

const MatchCarouselSkeleton = () => {
  return (
    <SkeletonRow>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonItem key={i}>
          <Card>
            {/* Match type + LIVE */}
            <HeaderRow>
              <Line w="90px" />
              <Line w="40px" />
            </HeaderRow>

            {/* Team 1 */}
            <TeamRow>
              <Left>
                <Line w="28px" h={28} />
                <Line w="120px" />
              </Left>
              <Line w="60px" />
            </TeamRow>

            {/* Team 2 */}
            <TeamRow>
              <Left>
                <Line w="28px" h={28} />
                <Line w="120px" />
              </Left>
              <Line w="60px" />
            </TeamRow>

            {/* Status */}
            <Line w="80%" />
          </Card>
        </SkeletonItem>
      ))}
    </SkeletonRow>
  );
};

export default MatchCarouselSkeleton;
