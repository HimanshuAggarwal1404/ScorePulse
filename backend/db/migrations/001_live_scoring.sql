-- =====================================================================
-- 001_live_scoring.sql
--
-- Rebuilds the live-scoring part of the schema (matches, squads, innings,
-- deliveries, wickets). Stats tables (players_stats, batting_*, bowling_*,
-- fielding_*), teams, players, player_teams, tournaments and points_table
-- are left untouched.
--
-- Model:
--   matches 1─* match_players   (the XI / squad of each side for that match)
--   matches 1─* innings 1─* deliveries 0..1─1 wickets 1─* wicket_fielders
--
-- Deliveries are the source of truth. Totals, overs, partnerships, fall of
-- wickets, bowler figures etc. are always derived from them.
-- =====================================================================

BEGIN;

DROP VIEW  IF EXISTS innings_totals;
DROP TABLE IF EXISTS replays         CASCADE;
DROP TABLE IF EXISTS wicket_fielders CASCADE;
DROP TABLE IF EXISTS wickets       CASCADE;
DROP TABLE IF EXISTS deliveries    CASCADE;
DROP TABLE IF EXISTS overs         CASCADE;
DROP TABLE IF EXISTS innings       CASCADE;
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS match_teams   CASCADE;
DROP TABLE IF EXISTS matches       CASCADE;

DROP TYPE IF EXISTS match_status;
DROP TYPE IF EXISTS innings_status;

CREATE TYPE match_status AS ENUM (
  'upcoming',       -- scheduled, toss not done
  'toss',           -- toss done, play not started
  'live',           -- an innings is in progress
  'innings_break',  -- between innings
  'stumps',         -- end of a day's play (multi-day)
  'delayed',        -- rain / bad light / other interruption
  'completed',
  'abandoned'
);

CREATE TYPE innings_status AS ENUM ('in_progress', 'completed');

-- ---------------------------------------------------------------------
-- MATCHES
-- ---------------------------------------------------------------------
CREATE TABLE matches (
  id                  SERIAL PRIMARY KEY,
  source              TEXT NOT NULL DEFAULT 'manual'
                        CHECK (source IN ('manual', 'cricsheet', 'replay')),
  source_match_id     TEXT,

  tournament_id       INTEGER REFERENCES tournaments(id) ON DELETE SET NULL,
  series_name         TEXT,                  -- e.g. "New Zealand tour of India"
  match_title         TEXT,                  -- e.g. "5th T20I"
  season              TEXT,

  format              TEXT NOT NULL
                        CHECK (format IN ('T20', 'ODI', 'TEST', 'T10', 'LIST_A', 'FIRST_CLASS')),
  team_type           TEXT NOT NULL DEFAULT 'international'
                        CHECK (team_type IN ('international', 'domestic', 'franchise', 'club')),
  gender              TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),

  team1_id            INTEGER NOT NULL REFERENCES teams(id),
  team2_id            INTEGER NOT NULL REFERENCES teams(id),

  venue_id            INTEGER REFERENCES venues(id) ON DELETE SET NULL,
  start_date          DATE NOT NULL,
  start_time          TIMESTAMPTZ,
  days                INTEGER NOT NULL DEFAULT 1 CHECK (days BETWEEN 1 AND 5),

  -- rules
  overs_per_innings   INTEGER CHECK (overs_per_innings > 0),   -- NULL = unlimited (multi-day)
  balls_per_over      INTEGER NOT NULL DEFAULT 6 CHECK (balls_per_over BETWEEN 4 AND 10),
  innings_per_team    INTEGER NOT NULL DEFAULT 1 CHECK (innings_per_team IN (1, 2)),

  -- state
  status              match_status NOT NULL DEFAULT 'upcoming',
  status_note         TEXT,                  -- "Rain stops play", "Day 2 - Lunch" ...
  current_day         INTEGER NOT NULL DEFAULT 1,

  toss_winner_id      INTEGER REFERENCES teams(id),
  toss_decision       TEXT CHECK (toss_decision IN ('bat', 'field')),

  -- result
  result_type         TEXT CHECK (result_type IN ('win', 'tie', 'draw', 'no_result', 'abandoned')),
  winner_id           INTEGER REFERENCES teams(id),
  win_margin          INTEGER,
  win_margin_type     TEXT CHECK (win_margin_type IN ('runs', 'wickets', 'innings')),
  result_method       TEXT,                  -- 'DLS', 'Super Over', 'VJD' ...
  result_text         TEXT,
  player_of_match_id  INTEGER,               -- FK added after match_players exists

  umpires             TEXT[],
  tv_umpire           TEXT,
  match_referee       TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT matches_distinct_teams  CHECK (team1_id <> team2_id),
  CONSTRAINT matches_toss_team       CHECK (toss_winner_id IS NULL OR toss_winner_id IN (team1_id, team2_id)),
  CONSTRAINT matches_winner_team     CHECK (winner_id IS NULL OR winner_id IN (team1_id, team2_id)),
  CONSTRAINT matches_win_needs_winner CHECK (result_type IS DISTINCT FROM 'win' OR winner_id IS NOT NULL),
  CONSTRAINT matches_source_unique   UNIQUE (source, source_match_id)
);

CREATE INDEX matches_status_idx ON matches (status);
CREATE INDEX matches_start_idx  ON matches (start_date DESC);

-- ---------------------------------------------------------------------
-- MATCH PLAYERS (playing XI + substitutes, per match)
-- ---------------------------------------------------------------------
CREATE TABLE match_players (
  id                SERIAL PRIMARY KEY,
  match_id          INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id           INTEGER NOT NULL REFERENCES teams(id),
  name              TEXT NOT NULL,
  registry_id       TEXT,                    -- Cricsheet people registry id
  player_id         INTEGER REFERENCES players(id) ON DELETE SET NULL,        -- squad player
  player_stats_id   INTEGER REFERENCES players_stats(id) ON DELETE SET NULL,  -- profile page
  role              TEXT NOT NULL DEFAULT 'playing'
                      CHECK (role IN ('playing', 'substitute', 'replacement')),
  is_captain        BOOLEAN NOT NULL DEFAULT false,
  is_keeper         BOOLEAN NOT NULL DEFAULT false,
  list_order        INTEGER NOT NULL DEFAULT 0,

  UNIQUE (match_id, team_id, name),
  UNIQUE (id, match_id)                      -- lets other tables pin a player to a match
);

CREATE INDEX match_players_match_idx ON match_players (match_id);

ALTER TABLE matches
  ADD CONSTRAINT matches_pom_fk
  FOREIGN KEY (player_of_match_id) REFERENCES match_players(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- INNINGS
-- ---------------------------------------------------------------------
CREATE TABLE innings (
  id                SERIAL PRIMARY KEY,
  match_id          INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings_number    INTEGER NOT NULL CHECK (innings_number BETWEEN 1 AND 6),
  batting_team_id   INTEGER NOT NULL REFERENCES teams(id),
  bowling_team_id   INTEGER NOT NULL REFERENCES teams(id),

  is_super_over     BOOLEAN NOT NULL DEFAULT false,
  is_follow_on      BOOLEAN NOT NULL DEFAULT false,

  status            innings_status NOT NULL DEFAULT 'in_progress',
  end_reason        TEXT CHECK (end_reason IN (
                      'all_out', 'overs_complete', 'target_reached',
                      'declared', 'forfeited', 'match_ended')),

  -- limits for this innings (NULL = unlimited)
  max_balls         INTEGER CHECK (max_balls > 0),     -- legal balls, so 17.3 ov is possible
  max_wickets       INTEGER NOT NULL DEFAULT 10 CHECK (max_wickets BETWEEN 1 AND 10),
  target_runs       INTEGER CHECK (target_runs > 0),   -- runs needed to win (revised for DLS)

  -- live crease state (who is where right now)
  striker_id        INTEGER,
  non_striker_id    INTEGER,
  bowler_id         INTEGER,

  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at          TIMESTAMPTZ,

  UNIQUE (match_id, innings_number),
  UNIQUE (id, match_id),
  CONSTRAINT innings_distinct_teams CHECK (batting_team_id <> bowling_team_id),
  CONSTRAINT innings_end_reason CHECK ((status = 'completed') = (end_reason IS NOT NULL)),
  FOREIGN KEY (striker_id, match_id)     REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (non_striker_id, match_id) REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (bowler_id, match_id)      REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED
);

-- at most one innings in progress per match
CREATE UNIQUE INDEX innings_one_live ON innings (match_id) WHERE status = 'in_progress';

-- ---------------------------------------------------------------------
-- DELIVERIES (every ball, legal or not)
-- ---------------------------------------------------------------------
CREATE TABLE deliveries (
  id                BIGSERIAL PRIMARY KEY,
  innings_id        INTEGER NOT NULL,
  match_id          INTEGER NOT NULL,
  seq               INTEGER NOT NULL CHECK (seq > 0),          -- 1..n within the innings

  over_number       INTEGER NOT NULL CHECK (over_number >= 0), -- 0-based, as in "4.3" -> 4
  ball_in_over      INTEGER NOT NULL CHECK (ball_in_over >= 1),-- legal-ball position; extras repeat the next number

  batter_id         INTEGER NOT NULL,
  non_striker_id    INTEGER NOT NULL,
  bowler_id         INTEGER NOT NULL,

  runs_batter       INTEGER NOT NULL DEFAULT 0 CHECK (runs_batter BETWEEN 0 AND 7),
  is_boundary       BOOLEAN NOT NULL DEFAULT false,            -- runs_batter came from a boundary (4/6)
  wides             INTEGER NOT NULL DEFAULT 0 CHECK (wides   >= 0),
  noballs           INTEGER NOT NULL DEFAULT 0 CHECK (noballs >= 0),
  byes              INTEGER NOT NULL DEFAULT 0 CHECK (byes    >= 0),
  legbyes           INTEGER NOT NULL DEFAULT 0 CHECK (legbyes >= 0),
  penalty           INTEGER NOT NULL DEFAULT 0 CHECK (penalty >= 0),

  runs_extras       INTEGER GENERATED ALWAYS AS (wides + noballs + byes + legbyes + penalty) STORED,
  runs_total        INTEGER GENERATED ALWAYS AS (runs_batter + wides + noballs + byes + legbyes + penalty) STORED,
  is_legal          BOOLEAN GENERATED ALWAYS AS (wides = 0 AND noballs = 0) STORED,

  commentary        TEXT,                                      -- optional scorer text
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (innings_id, seq),
  FOREIGN KEY (innings_id, match_id)     REFERENCES innings (id, match_id) ON DELETE CASCADE,
  FOREIGN KEY (batter_id, match_id)      REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (non_striker_id, match_id) REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY (bowler_id, match_id)      REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED,

  CONSTRAINT deliveries_distinct_batters CHECK (batter_id <> non_striker_id),
  CONSTRAINT deliveries_wide_no_bat      CHECK (wides = 0 OR (runs_batter = 0 AND noballs = 0)),
  CONSTRAINT deliveries_bye_or_legbye    CHECK (byes = 0 OR legbyes = 0),
  CONSTRAINT deliveries_boundary_runs    CHECK (NOT is_boundary OR runs_batter IN (4, 6))
);

CREATE INDEX deliveries_innings_seq_idx ON deliveries (innings_id, seq);
CREATE INDEX deliveries_match_idx       ON deliveries (match_id);

-- ---------------------------------------------------------------------
-- WICKETS (a delivery can, rarely, carry two: e.g. retired + run out)
-- ---------------------------------------------------------------------
CREATE TABLE wickets (
  id                SERIAL PRIMARY KEY,
  delivery_id       BIGINT NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  match_id          INTEGER NOT NULL,
  player_out_id     INTEGER NOT NULL,
  kind              TEXT NOT NULL CHECK (kind IN (
                      'bowled', 'caught', 'caught and bowled', 'lbw', 'stumped',
                      'run out', 'hit wicket', 'retired hurt', 'retired not out',
                      'retired out', 'obstructing the field', 'handled the ball',
                      'hit the ball twice', 'timed out')),
  UNIQUE (delivery_id, player_out_id),
  FOREIGN KEY (player_out_id, match_id) REFERENCES match_players (id, match_id) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX wickets_delivery_idx ON wickets (delivery_id);

CREATE TABLE wicket_fielders (
  wicket_id         INTEGER NOT NULL REFERENCES wickets(id) ON DELETE CASCADE,
  position          INTEGER NOT NULL DEFAULT 1,
  fielder_id        INTEGER NOT NULL REFERENCES match_players(id) DEFERRABLE INITIALLY DEFERRED,
  is_substitute     BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (wicket_id, position)
);

-- ---------------------------------------------------------------------
-- REPLAYS (a Cricsheet match being fed ball-by-ball as if live)
-- ---------------------------------------------------------------------
CREATE TABLE replays (
  match_id          INTEGER PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,
  source_file       TEXT NOT NULL,
  interval_ms       INTEGER NOT NULL DEFAULT 4000 CHECK (interval_ms >= 200),
  state             TEXT NOT NULL DEFAULT 'running' CHECK (state IN ('running', 'paused', 'finished')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- DERIVED: innings totals (used by match lists / cards)
-- ---------------------------------------------------------------------
CREATE VIEW innings_totals AS
SELECT
  i.id                                                   AS innings_id,
  i.match_id,
  i.innings_number,
  i.batting_team_id,
  i.bowling_team_id,
  i.status,
  i.end_reason,
  i.is_super_over,
  i.is_follow_on,
  i.target_runs,
  i.max_balls,
  i.max_wickets,
  COALESCE(SUM(d.runs_total), 0)::int                    AS runs,
  COALESCE(COUNT(*) FILTER (WHERE d.is_legal), 0)::int   AS legal_balls,
  COALESCE((
    SELECT COUNT(*) FROM wickets w
    JOIN deliveries d2 ON d2.id = w.delivery_id
    WHERE d2.innings_id = i.id
      AND w.kind NOT IN ('retired hurt', 'retired not out')
  ), 0)::int                                             AS wickets
FROM innings i
LEFT JOIN deliveries d ON d.innings_id = i.id
GROUP BY i.id;

COMMIT;
