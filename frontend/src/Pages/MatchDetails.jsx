import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";

/* ---------- STYLES ---------- */

const Page = styled.div`
  background: #0b1220;
  min-height: 100vh;
  color: #f5f7fa;
  font-family: Inter, sans-serif;
`;

const Container = styled.div`
  max-width: 1150px;
  margin: auto;
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
`;

const Sub = styled.div`
  color: #9aa4b2;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: ${({ active }) => (active ? "#2563eb" : "#151c2f")};
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
`;

const Card = styled.div`
  background: #151c2f;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 28px;
`;

const BallRow = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #24304a;
  display: flex;
  gap: 12px;
`;

const OverTag = styled.span`
  color: #60a5fa;
  min-width: 52px;
  font-weight: 600;
`;

const Event = styled.span`
  color: ${({ type }) =>
    type === "W" ? "#f87171" :
    type === "6" ? "#4ade80" :
    type === "4" ? "#60a5fa" :
    "#e5e7eb"};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 8px;
    border-bottom: 1px solid #24304a;
  }

  th {
    color: #9aa4b2;
    font-weight: 600;
    text-align: left;
  }
`;

/* ---------- HELPERS ---------- */

const groupBy = (arr, fn) =>
  arr.reduce((a, x) => {
    const k = fn(x);
    a[k] = a[k] || [];
    a[k].push(x);
    return a;
  }, {});

/* ---------- PAGE ---------- */

const MatchDetails = () => {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("balls");

  useEffect(() => {
    fetch(`http://localhost:8000/api/matches/${id}/scorecard`)
      .then(r => r.json())
      .then(d => setRows(d.scorecard || []));
  }, [id]);

  if (!rows.length) return null;

  const inningsMap = groupBy(rows, r => r.innings_id);

  return (
    <Page>
      <Header />
      <Container>
        <Title>
          {rows[0].batting_team} vs {rows[rows.length - 1].batting_team}
        </Title>
        <Sub>
          {rows[0].match_type} •{" "}
          {new Date(rows[0].match_date).toDateString()}
        </Sub>

        <Tabs>
          <Tab active={tab === "balls"} onClick={() => setTab("balls")}>
            Ball by Ball
          </Tab>
          <Tab active={tab === "scorecard"} onClick={() => setTab("scorecard")}>
            Scorecard
          </Tab>
        </Tabs>

        {Object.values(inningsMap).map((inn, idx) => {
          let runs = 0;
          let wickets = 0;
          const dismissed = new Set();
          const validBalls = [];

          for (const b of inn) {
            if (
              b.over_number > 19 ||
              (b.over_number === 19 && b.ball_number > 6) ||
              wickets >= 10
            ) break;

            validBalls.push(b);
            runs += b.runs_total;

            if (b.player_out && !dismissed.has(b.player_out)) {
              wickets++;
              dismissed.add(b.player_out);
            }
          }

          /* ---------- SCORECARD ---------- */

          const batGroups = groupBy(validBalls, b => b.batter);
          const bowlGroups = groupBy(validBalls, b => b.bowler);

          return (
            <Card key={idx}>
              <h3>
                {inn[0].batting_team} — {runs}/{wickets}
              </h3>

              {tab === "balls" &&
                validBalls.map((b, i) => {
                  let type = "N";
                  let text = `${b.bowler} to ${b.batter}, ${b.runs_total} run`;

                  if (b.is_boundary) {
                    type = "4";
                    text = `${b.bowler} to ${b.batter}, FOUR`;
                  }
                  if (b.is_six) {
                    type = "6";
                    text = `${b.bowler} to ${b.batter}, SIX`;
                  }
                  if (b.player_out) {
                    type = "W";
                    text = `${b.bowler} to ${b.batter}, OUT`;
                  }

                  return (
                    <BallRow key={i}>
                      <OverTag>
                        {b.over_number}.{b.ball_number}
                      </OverTag>
                      <Event type={type}>{text}</Event>
                    </BallRow>
                  );
                })}

              {tab === "scorecard" && (
                <>
                  <h4>Batting</h4>
                  <Table>
                    <thead>
                      <tr>
                        <th>Batter</th>
                        <th>Runs</th>
                        <th>Balls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(batGroups).map(([name, balls]) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td>{balls.reduce((a, b) => a + b.runs_batter, 0)}</td>
                          <td>{balls.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <br />

                  <h4>Bowling</h4>
                  <Table>
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>Overs</th>
                        <th>Runs</th>
                        <th>Wkts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(bowlGroups).map(([name, balls]) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td>{(balls.length / 6).toFixed(1)}</td>
                          <td>{balls.reduce((a, b) => a + b.runs_total, 0)}</td>
                          <td>{balls.filter(b => b.player_out).length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card>
          );
        })}
      </Container>
    </Page>
  );
};

export default MatchDetails;
