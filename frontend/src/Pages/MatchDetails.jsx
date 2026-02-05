import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";
import { useTheme } from "../context/ThemeContext";

/* ---------- THEME TOKENS ---------- */

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
  padding: 0 14px;
`;

/* ---------- MATCH HEADER ---------- */

const MatchHeader = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 20px;
`;

const Teams = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const MatchMeta = styled.div`
  margin-top: 6px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- SECTION ---------- */

const Section = styled.div`
  margin-top: 26px;
`;

const SectionTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.muted};
  margin-bottom: 12px;
  text-transform: uppercase;
`;

/* ---------- SCORECARD ---------- */

const InningCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
`;

const InningTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InningName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const InningScore = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const InningOvers = styled.div`
  margin-top: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.muted};
`;

/* ---------- COMMENTARY ---------- */

const CommentaryBox = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const OverHeader = styled.div`
  background: ${({ theme }) => theme.bg};
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.muted};
`;

const BallRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const BallTag = styled.div`
  min-width: 42px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const BallText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme, wicket }) =>
    wicket ? theme.wicket : theme.text};
`;

/* ---------- PAGE ---------- */

const MatchDetails = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const theme = darkMode ? tokens.dark : tokens.light;

  const [scorecard, setScorecard] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoreRes, commRes] = await Promise.all([
          fetch(`http://localhost:8000/api/matches/${id}/scorecard`),
          fetch(`http://localhost:8000/api/matches/${id}/commentary`),
        ]);

        const scoreData = await scoreRes.json();
        const commData = await commRes.json();

        setScorecard(scoreData.innings || []);

        const flat = [];
        (commData.innings || []).forEach((inn) => {
          inn.overs.forEach((over) => {
            flat.push({ type: "over", over: over.over });
            over.balls.forEach((b) => {
              flat.push({
                type: "ball",
                ball: b.ball,
                text: b.text,
                isWicket: b.isWicket,
              });
            });
          });
        });

        setCommentary(flat.reverse());
      } catch (err) {
        console.error("Match load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Page theme={theme}>
      <Header />

      <Container>
        <MatchHeader theme={theme}>
          <Teams theme={theme}>Match #{id}</Teams>
          <MatchMeta theme={theme}>
            Live score, scorecard & commentary
          </MatchMeta>
        </MatchHeader>

        {/* SCORECARD */}
        <Section>
          <SectionTitle theme={theme}>Scorecard</SectionTitle>
          {loading ? (
            <InningOvers theme={theme}>Loading…</InningOvers>
          ) : (
            scorecard.map((inn) => (
              <InningCard key={inn.innings_id} theme={theme}>
                <InningTop>
                  <InningName theme={theme}>
                    Inning {inn.innings_number} — {inn.batting_team}
                  </InningName>
                  <InningScore theme={theme}>
                    {inn.total_runs}/{inn.wickets}
                  </InningScore>
                </InningTop>
                <InningOvers theme={theme}>
                  Overs: {inn.overs}
                </InningOvers>
              </InningCard>
            ))
          )}
        </Section>

        {/* COMMENTARY */}
        <Section>
          <SectionTitle theme={theme}>Commentary</SectionTitle>
          <CommentaryBox theme={theme}>
            {loading ? (
              <BallRow theme={theme}>
                <BallText theme={theme}>Loading commentary…</BallText>
              </BallRow>
            ) : commentary.length === 0 ? (
              <BallRow theme={theme}>
                <BallText theme={theme}>No commentary yet</BallText>
              </BallRow>
            ) : (
              commentary.map((item, i) =>
                item.type === "over" ? (
                  <OverHeader key={i} theme={theme}>
                    Over {item.over}
                  </OverHeader>
                ) : (
                  <BallRow key={i} theme={theme}>
                    <BallTag theme={theme}>{item.ball}</BallTag>
                    <BallText theme={theme} wicket={item.isWicket}>
                      {item.text}
                    </BallText>
                  </BallRow>
                )
              )
            )}
          </CommentaryBox>
        </Section>
      </Container>
    </Page>
  );
};

export default MatchDetails;
