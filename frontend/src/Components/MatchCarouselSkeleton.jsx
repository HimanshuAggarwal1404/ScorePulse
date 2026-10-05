import React from "react";
import styled from "styled-components";
import { Skeleton } from "../ui/kit";
import { glass } from "../ui/styles";

const Row = styled.div`
  display: flex;
  gap: 16px;
  overflow: hidden;
  padding: 4px 2px 18px;
`;

const Card = styled.div`
  ${glass}
  flex: 0 0 calc((100% - 32px) / 3);
  height: 168px;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  @media (max-width: 960px) {
    flex-basis: calc((100% - 16px) / 2);
  }
  @media (max-width: 640px) {
    flex-basis: 87%;
  }
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const MatchCarouselSkeleton = () => (
  <Row aria-hidden>
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <Line>
          <Skeleton $w="110px" $h="10px" />
          <Skeleton $w="36px" $h="10px" />
        </Line>
        {[0, 1].map((k) => (
          <Line key={k}>
            <Skeleton $w="34px" $h="24px" />
            <Skeleton $w="55%" />
            <Skeleton $w="54px" $h="14px" />
          </Line>
        ))}
        <Skeleton $w="70%" style={{ marginTop: "auto" }} />
      </Card>
    ))}
  </Row>
);

export default MatchCarouselSkeleton;
