import React from "react";
import styled from "styled-components";
import { BallChip, Card, Chips, Muted, PlayerName, Row, Table, TableWrap } from "./ui";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Key = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px 20px;
  font-size: 0.86rem;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${({ $t }) => $t.border};

  b {
    font-weight: 600;
  }
`;

const OverGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  padding-right: 10px;
  border-right: 1px solid ${({ $t }) => $t.border};

  &:last-child {
    border-right: none;
  }
`;

const LivePanel = ({ live, t }) => {
  if (!live) return null;

  return (
    <Card $t={t}>
      <Grid>
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
              {live.batters.map((b) => (
                <tr key={b.id}>
                  <td>
                    <PlayerName player={b} t={t} suffix={b.onStrike ? " *" : ""} />
                  </td>
                  <td className="strong">{b.runs}</td>
                  <td>{b.balls}</td>
                  <td>{b.fours}</td>
                  <td>{b.sixes}</td>
                  <td>{b.strikeRate.toFixed(2)}</td>
                </tr>
              ))}
              {live.needsBatter && (
                <tr>
                  <td colSpan={6}>
                    <Muted $t={t}>New batter coming in…</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrap>

        <TableWrap>
          <Table $t={t}>
            <thead>
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>ECO</th>
              </tr>
            </thead>
            <tbody>
              {[live.bowler && { ...live.bowler, current: true }, live.previousBowler]
                .filter(Boolean)
                .map((b) => (
                  <tr key={b.id}>
                    <td>
                      <PlayerName player={b} t={t} suffix={b.current ? " *" : ""} />
                    </td>
                    <td>{b.overs}</td>
                    <td>{b.maidens}</td>
                    <td>{b.runs}</td>
                    <td className="strong">{b.wickets}</td>
                    <td>{b.economy.toFixed(2)}</td>
                  </tr>
                ))}
              {live.needsBowler && (
                <tr>
                  <td colSpan={6}>
                    <Muted $t={t}>End of over - new bowler coming on</Muted>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Grid>

      <Key $t={t}>
        {live.partnership && (
          <div>
            <Muted $t={t}>Partnership: </Muted>
            <b>
              {live.partnership.runs}({live.partnership.balls})
            </b>
          </div>
        )}
        {live.lastWicket && (
          <div>
            <Muted $t={t}>Last Wkt: </Muted>
            <b>
              {live.lastWicket.name} {live.lastWicket.dismissal} {live.lastWicket.runs}({live.lastWicket.balls})
            </b>{" "}
            <Muted $t={t}>
              - {live.lastWicket.score}, {live.lastWicket.overs} ov
            </Muted>
          </div>
        )}
        {live.need != null && (
          <div>
            <Muted $t={t}>Need: </Muted>
            <b>
              {live.need} from {live.ballsLeft ?? "-"} balls
            </b>
          </div>
        )}
      </Key>

      {live.recent.length > 0 && (
        <Row $t={t} style={{ marginTop: 14 }}>
          <Muted $t={t}>Recent:</Muted>
          <Chips>
            {live.recent.map((o) => (
              <OverGroup key={o.over} $t={t}>
                {o.balls.map((b, i) => (
                  <BallChip key={i} chip={b.chip} kind={b.kind} t={t} size="sm" />
                ))}
              </OverGroup>
            ))}
          </Chips>
        </Row>
      )}
    </Card>
  );
};

export default LivePanel;
