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
    four: "#16a34a",
    six: "#ea580c",
    overBg: "#f1f5f9",
    badgeBg: "#eef2ff",
  },
  dark: {
    bg: "#0b1220",
    card: "#151c2f",
    border: "#24304a",
    text: "#f5f7fa",
    muted: "#9aa4b2",
    accent: "#60a5fa",
    wicket: "#f87171",
    four: "#22c55e",
    six: "#fb923c",
    overBg: "#0f172a",
    badgeBg: "#1e293b",
  },
};

/* ---------- STYLES ---------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 18px auto;
  padding: 0 14px;
`;

const Section = styled.div`
  margin-top: 26px;
`;

const SectionTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.muted};
  margin-bottom: 14px;
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
`;

const InningName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const InningScore = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const InningOvers = styled.div`
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

const InningsHeader = styled.div`
  padding: 10px 14px;
  font-weight: 800;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
`;

const OverHeader = styled.div`
  background: ${({ theme }) => theme.overBg};
  padding: 8px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.muted};
`;

const BallRow = styled.div`
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  border-top: 1px solid ${({ theme }) => theme.border};
  align-items: center;
`;

const BallTag = styled.div`
  min-width: 42px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

const ResultBadge = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, result }) => {
    if (result === "W") return theme.wicket;
    if (result === "4") return theme.four;
    if (result === "6") return theme.six;
    return theme.badgeBg;
  }};
  color: ${({ result }) =>
    result === "4" || result === "6" || result === "W"
      ? "#fff"
      : "inherit"};
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

        /* ---------- BUILD COMMENTARY STRUCTURE ---------- */

        const rows = commData.innings || [];
        const inningsMap = {};

        rows.forEach((r) => {
          if (!inningsMap[r.innings_id]) {
            inningsMap[r.innings_id] = {
              innings_number: r.innings_number,
              overs: {},
            };
          }

          if (!inningsMap[r.innings_id].overs[r.over_number]) {
            inningsMap[r.innings_id].overs[r.over_number] = [];
          }

          inningsMap[r.innings_id].overs[r.over_number].push({
            ball: r.ball,
            text: r.commentary,
            isWicket: r.is_wicket,
            result: r.is_wicket ? "W" : String(r.total_runs),
          });
        });

        const structured = [];

        Object.values(inningsMap)
          .sort((a, b) => b.innings_number - a.innings_number)
          .forEach((inn) => {
            structured.push({
              type: "innings",
              innings: inn.innings_number,
            });

            Object.entries(inn.overs)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .forEach(([overNum, balls]) => {
                structured.push({
                  type: "over",
                  over: overNum,
                });

                [...balls].reverse().forEach((b) => {
                  structured.push({
                    type: "ball",
                    ...b,
                  });
                });
              });
          });

        setCommentary(structured);
      } catch (err) {
        console.error("Match load error:", err);
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
            ) : (
              commentary.map((item, i) => {
                if (item.type === "innings") {
                  return (
                    <InningsHeader key={`inn-${i}`} theme={theme}>
                      Innings {item.innings}
                    </InningsHeader>
                  );
                }

                if (item.type === "over") {
                  return (
                    <OverHeader key={`over-${i}`} theme={theme}>
                      Over {item.over}
                    </OverHeader>
                  );
                }

                return (
                  <BallRow key={`ball-${i}`} theme={theme}>
                    <BallTag theme={theme}>{item.ball}</BallTag>
                    <ResultBadge theme={theme} result={item.result}>
                      {item.result}
                    </ResultBadge>
                    <BallText theme={theme} wicket={item.isWicket}>
                      {item.text}
                    </BallText>
                  </BallRow>
                );
              })
            )}
          </CommentaryBox>
        </Section>
      </Container>
    </Page>
  );
};

export default MatchDetails;
