import React from "react";
import styled from "styled-components";
import { ButtonLink } from "../ui/kit";
import { glass } from "../ui/styles";

const Wrap = styled.div`
  ${glass}
  padding: 3rem 1.5rem;
  text-align: center;
  border-radius: var(--radius-lg);
`;

const Icon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: grid;
  place-items: center;
  font-size: 1.9rem;
  border-radius: 20px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
`;

const Title = styled.div`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.015em;
  margin-bottom: 0.35rem;
`;

const Text = styled.p`
  font-size: 0.92rem;
  color: var(--muted);
  margin: 0 auto 1.25rem;
  max-width: 42ch;
`;

const EmptyState = ({ icon, title, text, actionLabel, actionTo }) => (
  <Wrap>
    <Icon aria-hidden>{icon}</Icon>
    <Title>{title}</Title>
    <Text>{text}</Text>
    {actionLabel && <ButtonLink to={actionTo}>{actionLabel}</ButtonLink>}
  </Wrap>
);

export default EmptyState;
