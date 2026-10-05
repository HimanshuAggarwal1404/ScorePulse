import React, { useState } from "react";
import styled from "styled-components";
import { scoreText } from "./theme";
import { Card, Heading, Muted, PlayerName, Sub, Table, TableWrap } from "./ui";

const InningsHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: ${({ $t }) => $t.cardAlt};
  border: 1px solid ${({ $t }) => $t.border};
  color: ${({ $t }) => $t.text};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: ${({ $open }) => ($open ? "12px" : "0")};
  text-align: left;
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 6px;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  font-size: 0.9rem;
`;

const Section = styled.div`
  margin-top: 18px;
`;

const Fow = styled.div`
  font-size: 0.86rem;
  line-height: 1.8;
  color: ${({ $t }) => $t.sub};

  b {
    color: ${({ $t }) => $t.text};
  }
`;

const PartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ $t }) => $t.border};
  font-size: 0.85rem;

  &:last-child {
    border-bottom: none;
  }
`;

const Bar = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${({ $t }) => $t.border};
  overflow: hidden;
  margin-top: 4px;
  display: flex;
  justify-content: ${({ $right }) => ($right ? "flex-start" : "flex-end")};

  span {
    display: block;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ $t }) => $t.accent};
  }
`;

const inningsLabel = (inn, perTeam) => {
  if (inn.isSuperOver) return `${inn.battingTeam.name} Super Over`;
  if (perTeam === 2) return `${inn.battingTeam.name} ${inn.number <= 2 ? "1st" : "2nd"} Innings${inn.isFollowOn ? " (f/o)" : ""}`;
  return `${inn.battingTeam.name} Innings`;
};

const InningsCard = ({ inn, perTeam, t, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const e = inn.extras;
  const live = inn.status === "in_progress";
  const maxPart = Math.max(1, ...inn.partnerships.map((p) => p.runs));

  return (
    <Card $t={t}>
      <InningsHeader $t={t} $open={open} onClick={() => setOpen((o) => !o)}>
        <span>{inningsLabel(inn, perTeam)}</span>
        <span>
          {scoreText(inn)} <Muted $t={t}>({inn.overs} Ov)</Muted> {open ? "▴" : "▾"}
        </span>
      </InningsHeader>

      {open && (
        <>
          <TableWrap>
            <Table $t={t}>
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {inn.batting.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <PlayerName player={b} t={t} suffix={b.onStrike ? " *" : ""} />
                      <Sub $t={t}>{b.dismissal}</Sub>
                    </td>
                    <td className="strong">{b.runs}</td>
                    <td>{b.balls}</td>
                    <td>{b.fours}</td>
                    <td>{b.sixes}</td>
                    <td>{b.strikeRate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          <Line $t={t}>
            <b>Extras</b>
            <span>
              <b>{e.total}</b>{" "}
              <Muted $t={t}>
                (b {e.byes}, lb {e.legbyes}, w {e.wides}, nb {e.noballs}, p {e.penalty})
              </Muted>
            </span>
          </Line>
          <Line $t={t}>
            <b>Total</b>
            <span>
              <b>{inn.runs}</b>{" "}
              <Muted $t={t}>
                ({inn.allOut ? "all out" : `${inn.wickets} wkts${inn.declared ? " dec" : ""}`}, {inn.overs} Ov, RR {inn.runRate.toFixed(2)})
              </Muted>
            </span>
          </Line>

          {inn.didNotBat.length > 0 && (
            <Line $t={t} style={{ borderBottom: "none" }}>
              <b>{live ? "Yet to bat" : "Did not bat"}</b>
              <span style={{ textAlign: "right" }}>
                {inn.didNotBat.map((p, i) => (
                  <React.Fragment key={p.id}>
                    {i > 0 && ", "}
                    <PlayerName player={p} t={t} />
                  </React.Fragment>
                ))}
              </span>
            </Line>
          )}

          {inn.fallOfWickets.length > 0 && (
            <Section>
              <Heading $t={t}>Fall of wickets</Heading>
              <Fow $t={t}>
                {inn.fallOfWickets.map((f, i) => (
                  <React.Fragment key={f.wicket}>
                    {i > 0 && ", "}
                    <b>
                      {f.runs}-{f.wicket}
                    </b>{" "}
                    ({f.name}, {f.overs} ov)
                  </React.Fragment>
                ))}
              </Fow>
            </Section>
          )}

          <Section>
            <TableWrap>
              <Table $t={t}>
                <thead>
                  <tr>
                    <th>Bowler</th>
                    <th>O</th>
                    <th>M</th>
                    <th>R</th>
                    <th>W</th>
                    <th>NB</th>
                    <th>WD</th>
                    <th>ECO</th>
                  </tr>
                </thead>
                <tbody>
                  {inn.bowling.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <PlayerName player={b} t={t} suffix={b.isBowling ? " *" : ""} />
                      </td>
                      <td>{b.overs}</td>
                      <td>{b.maidens}</td>
                      <td>{b.runs}</td>
                      <td className="strong">{b.wickets}</td>
                      <td>{b.noballs}</td>
                      <td>{b.wides}</td>
                      <td>{b.economy.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </Section>

          {inn.partnerships.length > 0 && (
            <Section>
              <Heading $t={t}>Partnerships</Heading>
              {inn.partnerships.map((p) => (
                <PartRow key={`${p.wicket}-${p.batters[0].id}-${p.batters[1].id}`} $t={t}>
                  <div>
                    {p.batters[0].name} <Muted $t={t}>{p.batters[0].runs}({p.batters[0].balls})</Muted>
                    <Bar $t={t} $pct={(p.batters[0].runs / maxPart) * 100}>
                      <span />
                    </Bar>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <b>
                      {p.runs}
                      {p.unbroken && live ? "*" : ""}
                    </b>{" "}
                    <Muted $t={t}>({p.balls})</Muted>
                    <Sub $t={t}>{p.wicket}{["st", "nd", "rd"][p.wicket - 1] || "th"} wkt</Sub>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Muted $t={t}>{p.batters[1].runs}({p.batters[1].balls})</Muted> {p.batters[1].name}
                    <Bar $t={t} $right $pct={(p.batters[1].runs / maxPart) * 100}>
                      <span />
                    </Bar>
                  </div>
                </PartRow>
              ))}
            </Section>
          )}
        </>
      )}
    </Card>
  );
};

const Scorecard = ({ data, t }) => {
  if (!data.innings.length) {
    return (
      <Card $t={t}>
        <Muted $t={t}>The scorecard will appear once play starts.</Muted>
      </Card>
    );
  }
  const perTeam = data.match.rules.inningsPerTeam;
  const last = data.innings.length - 1;
  return (
    <>
      {data.innings.map((inn, i) => (
        <InningsCard key={inn.id} inn={inn} perTeam={perTeam} t={t} defaultOpen={perTeam === 1 || i === last} />
      ))}
    </>
  );
};

export default Scorecard;
