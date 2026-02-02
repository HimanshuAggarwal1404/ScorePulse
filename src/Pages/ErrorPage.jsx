import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME TOKENS ---------- */

const tokens = {
  light: {
    bg: "#f6f7f9",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    card: "#ffffff",
    border: "#e5e7eb",
    glowStrong: "rgba(37, 99, 235, 0.45)",
    glowSoft: "rgba(37, 99, 235, 0.2)",
  },
  dark: {
    bg: "#0b1220",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    card: "#151c2f",
    border: "#24304a",
    glowStrong: "rgba(96, 165, 250, 0.65)",
    glowSoft: "rgba(96, 165, 250, 0.3)",
  },
};

/* ---------- ANIMATIONS ---------- */

/* Cricket emoji drop-in */
const dropIn = keyframes`
  0% {
    transform: translateY(-12px) rotate(-12deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
`;

/* Glow that calms down */
const glowSettle = keyframes`
  0% {
    text-shadow:
      0 0 18px var(--glow-strong),
      0 0 36px var(--glow-strong);
  }
  100% {
    text-shadow:
      0 0 8px var(--glow-soft),
      0 0 16px var(--glow-soft);
  }
`;

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: "Inter", sans-serif;
`;

const ErrorContainer = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 520px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 36px 24px;
  }
`;

/* ---------- ICON ---------- */

const Icon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 10px;
  animation: ${dropIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

/* ---------- GLOWING 404 ---------- */

const ErrorCode = styled.div`
  font-size: 5.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1;
  margin-bottom: 6px;

  --glow-strong: ${({ theme }) => theme.glowStrong};
  --glow-soft: ${({ theme }) => theme.glowSoft};

  animation: ${glowSettle} 4s ease forwards;
`;

const ErrorTitle = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.text};
`;

const ErrorMessage = styled.p`
  margin-top: 12px;
  font-size: 1rem;
  color: ${({ theme }) => theme.muted};
  line-height: 1.6;
`;

/* ---------- ACTIONS ---------- */

const Actions = styled.div`
  margin-top: 28px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  background: ${({ theme }) => theme.accent};
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

/* ---------- PAGE ---------- */

const ErrorPage = () => {
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  return (
    <Page theme={theme}>
      <Header />

      <ErrorContainer>
        <Card theme={theme}>
          <Icon>🏏</Icon>
          <ErrorCode theme={theme}>404</ErrorCode>
          <ErrorTitle theme={theme}>Page Not Found</ErrorTitle>
          <ErrorMessage theme={theme}>
            Looks like this page got bowled. The link might be broken,
            or the page has been moved.
          </ErrorMessage>

          <Actions>
            <PrimaryButton to="/" theme={theme}>
              Go to Home
            </PrimaryButton>
            <SecondaryButton to="/fixtures" theme={theme}>
              View Matches
            </SecondaryButton>
          </Actions>
        </Card>
      </ErrorContainer>
    </Page>
  );
};

export default ErrorPage;
