import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import EmptyState from "../Components/EmptyState";
import { ButtonLink, Container, DataTable, Glass, Page, PageHeader, TableScroll } from "../ui/kit";

const Pos = styled.span`
  display: inline-grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  margin-right: 0.75rem;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 750;
  background: ${({ $q }) => ($q ? "var(--accent-soft)" : "var(--solid-2)")};
  color: ${({ $q }) => ($q ? "var(--accent)" : "var(--text-2)")};
  border: 1px solid ${({ $q }) => ($q ? "var(--accent-line)" : "transparent")};
`;

const Nrr = styled.span`
  color: ${({ $v }) => ($v.startsWith("-") ? "var(--live)" : "var(--win)")};
  font-weight: 650;
`;

/* ---------- MOCK BACKEND DATA ---------- */

const pointsTableData = {
  ipl_2025: {
    name: "Indian Premier League 2025",
    table: [
      { team: "CSK", p: 9, w: 7, l: 2, nrr: "+0.82", pts: 14 },
      { team: "RR", p: 9, w: 6, l: 3, nrr: "+0.41", pts: 12 },
      { team: "MI", p: 9, w: 5, l: 4, nrr: "+0.18", pts: 10 },
    ],
  },
  wc_2023: {
    name: "ICC Cricket World Cup 2023",
    table: [
      { team: "India", p: 9, w: 8, l: 1, nrr: "+1.42", pts: 16 },
      { team: "Australia", p: 9, w: 7, l: 2, nrr: "+0.98", pts: 14 },
      { team: "South Africa", p: 9, w: 6, l: 3, nrr: "+0.52", pts: 12 },
    ],
  },
};

/* ---------- PAGE ---------- */

const PointsTable = () => {
  const { id } = useParams();
  const tournament = pointsTableData[id];

  return (
    <Page>
      <Header />
      <Container $max="1000px">
        {!tournament ? (
          <EmptyState icon="🏆" title="Points table not found" text="This competition doesn't have a points table yet." actionLabel="All tournaments" actionTo="/tournaments" />
        ) : (
          <>
            <PageHeader eyebrow="Points table" title={tournament.name}>
              <ButtonLink to="/tournaments" $variant="ghost" $size="sm">
                All tournaments
              </ButtonLink>
            </PageHeader>

            <Glass $pad="0.5rem 0.75rem">
              <TableScroll>
                <DataTable style={{ minWidth: 560 }}>
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>P</th>
                      <th>W</th>
                      <th>L</th>
                      <th>NRR</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.table.map((row, i) => (
                      <tr key={row.team}>
                        <td>
                          <Pos $q={i < 4}>{i + 1}</Pos>
                          <b style={{ fontWeight: 650 }}>{row.team}</b>
                        </td>
                        <td>{row.p}</td>
                        <td>{row.w}</td>
                        <td>{row.l}</td>
                        <td>
                          <Nrr $v={row.nrr}>{row.nrr}</Nrr>
                        </td>
                        <td style={{ fontWeight: 750 }}>{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </TableScroll>
            </Glass>
          </>
        )}
      </Container>
    </Page>
  );
};

export default PointsTable;
