import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { Container, Page, PageHeader } from "../ui/kit";
import { useTheme } from "../context/ThemeContext";
import { scorer } from "../api";
import { formatDate, palette, todayISO } from "../Components/match/theme";
import { Card, Heading, Muted, Row, Table, TableWrap } from "../Components/match/ui";
import { ActionError, Button, Field, Input, Select } from "../Components/scorer/Form";
import { useAction } from "../hooks/useAction";

const FORMAT_OVERS = { T20: 20, T10: 10, ODI: 50, TEST: "", LIST_A: 50, FIRST_CLASS: "" };

const NewMatch = ({ teams, t }) => {
  const navigate = useNavigate();
  const today = todayISO();
  const [f, setF] = useState({
    team1Id: "",
    team2Id: "",
    format: "T20",
    overs: 20,
    venueName: "",
    venueCity: "",
    seriesName: "",
    title: "",
    startDate: today,
  });
  const { busy, error, run } = useAction();
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const create = () =>
    run(async () => {
      const { matchId } = await scorer("POST", "/matches", {
        ...f,
        team1Id: Number(f.team1Id),
        team2Id: Number(f.team2Id),
        overs: f.overs ? Number(f.overs) : null,
      });
      navigate(`/scorer/${matchId}`);
    });

  return (
    <Card $t={t}>
      <Heading $t={t}>Score a new match</Heading>
      <Row $align="flex-end">
        <Field $t={t}>
          Home / team 1
          <Select $t={t} value={f.team1Id} onChange={set("team1Id")}>
            <option value="">Select…</option>
            {teams.map((x) => (
              <option key={x.id} value={x.id} disabled={String(x.id) === f.team2Id}>
                {x.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field $t={t}>
          Away / team 2
          <Select $t={t} value={f.team2Id} onChange={set("team2Id")}>
            <option value="">Select…</option>
            {teams.map((x) => (
              <option key={x.id} value={x.id} disabled={String(x.id) === f.team1Id}>
                {x.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field $t={t} $min="120px">
          Format
          <Select
            $t={t}
            value={f.format}
            onChange={(e) => setF((x) => ({ ...x, format: e.target.value, overs: FORMAT_OVERS[e.target.value] }))}
          >
            <option value="T20">T20</option>
            <option value="ODI">ODI</option>
            <option value="TEST">Test</option>
            <option value="T10">T10</option>
            <option value="LIST_A">List A / One-day</option>
            <option value="FIRST_CLASS">First-class</option>
          </Select>
        </Field>
        {FORMAT_OVERS[f.format] !== "" && (
          <Field $t={t} $min="90px">
            Overs
            <Input $t={t} type="number" min="1" value={f.overs} onChange={set("overs")} />
          </Field>
        )}
      </Row>
      <Row $align="flex-end" style={{ marginTop: 12 }}>
        <Field $t={t} $grow>
          Series / tournament
          <Input $t={t} value={f.seriesName} onChange={set("seriesName")} placeholder="IPL 2026" />
        </Field>
        <Field $t={t}>
          Match title
          <Input $t={t} value={f.title} onChange={set("title")} placeholder="Match 12 / Final" />
        </Field>
        <Field $t={t} $grow>
          Venue
          <Input $t={t} value={f.venueName} onChange={set("venueName")} placeholder="Wankhede Stadium" />
        </Field>
        <Field $t={t}>
          City
          <Input $t={t} value={f.venueCity} onChange={set("venueCity")} />
        </Field>
        <Field $t={t} $min="150px">
          Date
          <Input $t={t} type="date" value={f.startDate} onChange={set("startDate")} />
        </Field>
      </Row>
      <ActionError error={error} t={t} onKeySaved={create} />
      <Button $t={t} style={{ marginTop: 12 }} onClick={create} disabled={busy || !f.team1Id || !f.team2Id}>
        Create match
      </Button>
    </Card>
  );
};

const Replays = ({ t }) => {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [speed, setSpeed] = useState(3000);
  const { busy, error, run } = useAction();

  const load = () =>
    run(async () => {
      const res = await scorer("GET", "/sources");
      setSources(res.sources);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (sourceId) =>
    run(async () => {
      const { matchId } = await scorer("POST", "/replays", { sourceId, intervalMs: speed });
      navigate(`/match/${matchId}`);
    });

  return (
    <Card $t={t}>
      <Row $justify="space-between">
        <Heading $t={t} style={{ margin: 0 }}>
          Replay a real match live
        </Heading>
        <Field $t={t} $min="140px">
          Speed
          <Select $t={t} value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={1000}>1 s per ball</option>
            <option value={3000}>3 s per ball</option>
            <option value={6000}>6 s per ball</option>
            <option value={15000}>15 s per ball</option>
          </Select>
        </Field>
      </Row>
      <Muted $t={t}>
        Plays a Cricsheet match from /MatchesData ball by ball through the scoring engine, as if it were happening now.
      </Muted>
      <ActionError error={error} t={t} onKeySaved={load} />
      <TableWrap>
        <Table $t={t} style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Match</th>
              <th>Format</th>
              <th>Played</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.teams.join(" vs ")}</b>
                  <div>
                    <Muted $t={t} $size="0.78rem">
                      {s.event}
                    </Muted>
                  </div>
                </td>
                <td>{s.format}</td>
                <td>{s.date}</td>
                <td>
                  <Button $t={t} disabled={busy} onClick={() => start(s.id)}>
                    Replay
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Card>
  );
};

const MatchList = ({ t, reloadKey }) => {
  const [matches, setMatches] = useState([]);
  const { busy, error, run } = useAction();
  const load = () =>
    run(async () => {
      const res = await scorer("GET", "/matches");
      setMatches(res.matches);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const remove = (id) =>
    run(async () => {
      await scorer("DELETE", `/matches/${id}`);
      await load();
    });

  return (
    <Card $t={t}>
      <Heading $t={t}>Matches</Heading>
      <ActionError error={error} t={t} onKeySaved={load} />
      <TableWrap>
        <Table $t={t}>
          <thead>
            <tr>
              <th>Match</th>
              <th>Source</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => (
              <tr key={m.id}>
                <td>
                  <Link to={`/scorer/${m.id}`} style={{ color: "var(--accent)", fontWeight: 650, textDecoration: "none" }}>
                    {m.team1} vs {m.team2}
                  </Link>
                  <div>
                    <Muted $t={t} $size="0.78rem">
                      {[m.match_title, m.format, formatDate(m.start_date)].filter(Boolean).join(" • ")}
                    </Muted>
                  </div>
                </td>
                <td>{m.source}</td>
                <td>{m.result_text || m.status.replace("_", " ")}</td>
                <td>
                  <Row $gap="8px" $justify="flex-end">
                    <Link to={`/match/${m.id}`} style={{ color: "var(--accent)", fontWeight: 650, textDecoration: "none" }}>
                      View
                    </Link>
                    {m.source !== "cricsheet" && (
                      <Button
                        $t={t}
                        $variant="ghost"
                        disabled={busy}
                        onClick={() => window.confirm(`Delete ${m.team1} vs ${m.team2}? This cannot be undone.`) && remove(m.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Row>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Card>
  );
};

const Scorer = () => {
  const { darkMode } = useTheme();
  const t = palette(darkMode);
  const [teams, setTeams] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const { error, run } = useAction();

  const load = () =>
    run(async () => {
      const res = await scorer("GET", "/teams");
      setTeams(res.teams);
      setReloadKey((k) => k + 1);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <Header />
      <Container $max="1080px">
        <PageHeader
          eyebrow="Scorer"
          title="Scorer console"
          subtitle="Score matches ball by ball. Every page showing the match updates the moment you tap."
        />
        <ActionError error={error} t={t} onKeySaved={load} />
        <NewMatch teams={teams} t={t} />
        <Replays t={t} />
        <MatchList t={t} reloadKey={reloadKey} />
      </Container>
    </Page>
  );
};

export default Scorer;
