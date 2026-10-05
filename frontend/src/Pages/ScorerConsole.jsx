import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/Header";
import { Container, Page } from "../ui/kit";
import { useTheme } from "../context/ThemeContext";
import { scorer } from "../api";
import { useLiveMatch } from "../hooks/useLiveMatch";
import { palette } from "../Components/match/theme";
import { Card, Muted, Row } from "../Components/match/ui";
import MatchHeader from "../Components/match/MatchHeader";
import { ActionError, Button } from "../Components/scorer/Form";
import { useAction } from "../hooks/useAction";
import SquadSetup from "../Components/scorer/SquadSetup";
import StartInnings from "../Components/scorer/StartInnings";
import ScoringPad from "../Components/scorer/ScoringPad";
import MatchControls, { TossForm } from "../Components/scorer/MatchControls";

const Top = styled(Row)`
  margin-bottom: 14px;

  a {
    color: var(--accent);
    font-weight: 650;
    text-decoration: none;
  }
`;

// The replay runner drives replay matches; the console only pauses / resumes them.
const ReplayBar = ({ matchId, t }) => {
  const [replay, setReplay] = useState(null);
  const { busy, error, run } = useAction();

  const load = () =>
    run(async () => {
      const { replays } = await scorer("GET", "/replays");
      setReplay(replays.find((r) => r.matchId === Number(matchId)) || null);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const act = (path, body) =>
    run(async () => {
      await scorer("POST", `/replays/${matchId}/${path}`, body);
      const { replays } = await scorer("GET", "/replays");
      setReplay(replays.find((r) => r.matchId === Number(matchId)) || null);
    });

  return (
    <Card $t={t}>
      <Row $justify="space-between">
        <span>
          <b>Replay</b>{" "}
          <Muted $t={t}>
            {replay ? `${replay.state} · ${replay.intervalMs / 1000}s per ball` : "loading…"}
          </Muted>
        </span>
        {replay && replay.state !== "finished" && (
          <Row $gap="8px">
            {replay.state === "running" ? (
              <Button $t={t} $variant="ghost" disabled={busy} onClick={() => act("pause")}>
                Pause
              </Button>
            ) : (
              <Button $t={t} disabled={busy} onClick={() => act("resume")}>
                Resume
              </Button>
            )}
            {[1000, 3000, 6000].map((ms) => (
              <Button key={ms} $t={t} $variant="ghost" disabled={busy} onClick={() => act("resume", { intervalMs: ms })}>
                {ms / 1000}s / ball
              </Button>
            ))}
          </Row>
        )}
      </Row>
      <ActionError error={error} t={t} onKeySaved={load} />
    </Card>
  );
};

const ScorerConsole = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const t = palette(darkMode);
  const { data, setData, error, refresh } = useLiveMatch(id);
  const [teams, setTeams] = useState([]);
  const [editSquads, setEditSquads] = useState(false);
  const teamsAction = useAction();

  const loadTeams = () =>
    teamsAction.run(async () => {
      const res = await scorer("GET", "/teams");
      setTeams(res.teams);
    });

  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <Page>
        <Header />
        <Container $max="1080px">
          <Muted $t={t}>{error ? error.message : "Loading…"}</Muted>
        </Container>
      </Page>
    );
  }

  const { match, innings, squads } = data;
  const onState = (state) => state && setData(state);
  const readOnly = match.source !== "manual";
  const inProgress = innings.find((i) => i.status === "in_progress");
  const finished = ["completed", "abandoned"].includes(match.status);
  const squadsReady = squads.every((s) => s.players.filter((p) => p.role === "playing").length >= 2);
  const noInningsYet = innings.length === 0;

  let stage;
  if (readOnly) stage = null;
  else if (!squadsReady || (editSquads && noInningsYet)) stage = "squads";
  else if (match.status === "upcoming") stage = "toss";
  else if (inProgress) stage = "scoring";
  else if (!finished) stage = "start";

  return (
    <Page>
      <Header />
      <Container $max="1080px">
        <Top $t={t} $justify="space-between">
          <Link to="/scorer">← All matches</Link>
          <Link to={`/match/${match.id}`} target="_blank" rel="noreferrer">
            Open public match page ↗
          </Link>
        </Top>

        <MatchHeader data={data} t={t} />
        <ActionError error={teamsAction.error} t={t} onKeySaved={loadTeams} />

        {match.source === "replay" && <ReplayBar matchId={match.id} t={t} />}
        {match.source === "cricsheet" && (
          <Card $t={t}>
            <Muted $t={t}>This match was imported from Cricsheet and is read-only here.</Muted>
          </Card>
        )}

        {stage === "squads" && (
          <SquadSetup
            data={data}
            teams={teams}
            t={t}
            onSaved={() => {
              setEditSquads(false);
              refresh();
            }}
          />
        )}

        {stage === "toss" && (
          <>
            <TossForm data={data} t={t} onState={onState} />
            <Button $t={t} $variant="ghost" onClick={() => setEditSquads(true)}>
              Edit playing XIs
            </Button>
          </>
        )}

        {stage === "start" && <StartInnings key={innings.length} data={data} t={t} onState={onState} />}
        {stage === "scoring" && data.live && <ScoringPad data={data} t={t} onState={onState} />}

        {!readOnly && stage !== "squads" && match.status !== "upcoming" && (
          <MatchControls data={data} t={t} onState={onState} />
        )}

        {!readOnly && finished && (
          <Card $t={t}>
            <Row $justify="space-between">
              <Muted $t={t}>Scored the last ball by mistake? Undo it to reopen the innings.</Muted>
              <Button
                $t={t}
                $variant="ghost"
                onClick={async () => {
                  const res = await scorer("DELETE", `/matches/${match.id}/balls/last`).catch((e) => alert(e.message));
                  onState(res?.state);
                }}
              >
                ↶ Undo last ball
              </Button>
            </Row>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default ScorerConsole;
