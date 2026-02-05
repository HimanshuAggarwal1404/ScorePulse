import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME ---------- */

const tokens = {
  light: {
    bg: "#f6f7f9",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#2563eb",
    wicket: "#dc2626",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    wicket: "#f87171",
  },
};

/* ---------- LAYOUT ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 0 16px;
`;

/* ---------- MATCH HEADER ---------- */

const MatchHeader = styled.div`
  margin-bottom: 16px;
`;

const Teams = styled.h1`
  font-size: 1.35rem;
  color: ${({ theme }) => theme.text};
`;

const Result = styled.div`
  margin-top: 4px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- SCORECARD ---------- */

const SectionTitle = styled.h2`
  margin: 24px 0 12px;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
`;

const InningCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
`;

const InningTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const InningScore = styled.div`
  margin-top: 4px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- COMMENTARY ---------- */

const OverBlock = styled.div`
  margin-top: 18px;
`;

const OverTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 6px;
`;

const BallRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 32px;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 600px) {
    grid-template-columns: 42px 1fr 28px;
  }
`;

const BallNo = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.muted};
`;

const BallText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;
`;

const BallRuns = styled.div`
  font-weight: 700;
  text-align: right;
  color: ${({ isWicket, theme }) =>
    isWicket ? theme.wicket : theme.text};
`;

/* ---------- PAGE ---------- */

const MatchDetails = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [scorecard, setScorecard] = useState(null);
  const [commentary, setCommentary] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/matches/${id}/scorecard`)
      .then((res) => res.json())
      .then(setScorecard);

    fetch(`http://localhost:8000/api/matches/${id}/commentary`)
      .then((res) => res.json())
      .then(setCommentary);
  }, [id]);

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        {/* MATCH HEADER */}
        <MatchHeader>
          <Teams theme={theme}>Match {id}</Teams>
          <Result theme={theme}>Full scorecard & commentary</Result>
        </MatchHeader>

        {/* SCORECARD */}
        <SectionTitle theme={theme}>Scorecard</SectionTitle>

        {scorecard?.innings?.map((inn) => (
          <InningCard key={inn.innings_id} theme={theme}>
            <InningTitle theme={theme}>
              {inn.batting_team}
            </InningTitle>
            <InningScore theme={theme}>
              {inn.total_runs}/{inn.wickets} in {inn.overs} overs
            </InningScore>
          </InningCard>
        ))}

        {/* COMMENTARY */}
        <SectionTitle theme={theme}>Commentary</SectionTitle>

        {commentary?.innings?.map((inn) =>
          inn.overs.map((over) => (
            <OverBlock key={over.over}>
              <OverTitle theme={theme}>
                Over {over.over}
              </OverTitle>

              {over.balls.map((ball, i) => (
                <BallRow key={i} theme={theme}>
                  <BallNo theme={theme}>{ball.ball}</BallNo>
                  <BallText theme={theme}>
                    {ball.text || "No commentary"}
                  </BallText>
                  <BallRuns
                    theme={theme}
                    isWicket={ball.isWicket}
                  >
                    {ball.isWicket ? "W" : ball.runs}
                  </BallRuns>
                </BallRow>
              ))}
            </OverBlock>
          ))
        )}
      </Container>
    </Page>
  );
};

export default MatchDetails;
