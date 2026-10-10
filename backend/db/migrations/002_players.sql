-- =====================================================================
-- 002_players.sql
--
-- One player model, filled from real sources by `npm run players:sync`
-- (Cricbuzz profiles + ESPNcricinfo Statsguru fielding + Cricsheet registry).
--
-- Replaces the CSV-era tables: players_stats and batting_* / bowling_* /
-- fielding_* (one table per format), plus the hand-typed players and
-- player_teams rows. match_players.player_stats_id goes; scorecards link to
-- profiles through match_players.player_id.
--
-- Model:
--   players 1─* player_batting / player_bowling / player_fielding (per format)
--   players *─* teams          via player_teams         (current squads)
--   players 1─* player_affiliations                     (every side they have played for)
-- =====================================================================

BEGIN;

DROP TABLE IF EXISTS batting_odi, batting_t20, batting_test,
                     bowling_odi, bowling_t20, bowling_test,
                     fielding_odi, fielding_t20, fielding_test CASCADE;

ALTER TABLE match_players DROP COLUMN IF EXISTS player_stats_id;
DROP TABLE IF EXISTS players_stats CASCADE;

UPDATE match_players SET player_id = NULL;
DROP TABLE IF EXISTS player_teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;   -- also drops match_players_player_id_fkey

-- ---------------------------------------------------------------------
-- PLAYERS
-- ---------------------------------------------------------------------
CREATE TABLE players (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,           -- as commonly known: "Virat Kohli"
  full_name         TEXT,
  country           TEXT,                    -- international side they belong to
  country_team_id   INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  role              TEXT CHECK (role IN ('batter', 'bowler', 'allrounder', 'wk')),
  role_label        TEXT,                    -- "Batting Allrounder", "WK-Batter" ...
  batting_style     TEXT,
  bowling_style     TEXT,
  date_of_birth     DATE,
  birth_place       TEXT,
  height            TEXT,
  image_url         TEXT,
  rankings          JSONB,                   -- ICC ranks: { bat: { test: {rank, best}, ... }, bowl, all }
  debuts            JSONB,                   -- [{ format, date, opponent, venue }]
  recent_form       JSONB,                   -- { batting: [...], bowling: [...] }

  cricbuzz_id       INTEGER UNIQUE,
  cricinfo_id       INTEGER UNIQUE,
  cricsheet_id      TEXT UNIQUE,             -- Cricsheet people-registry id (links imported matches)

  source            TEXT NOT NULL DEFAULT 'cricbuzz' CHECK (source IN ('cricbuzz', 'statsguru', 'manual')),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX players_name_idx    ON players (lower(name));
CREATE INDEX players_country_idx ON players (country_team_id);

ALTER TABLE match_players
  ADD CONSTRAINT match_players_player_id_fkey
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- CAREER RECORDS, one row per player per format
-- ---------------------------------------------------------------------
CREATE TABLE player_batting (
  player_id         INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format            TEXT NOT NULL CHECK (format IN ('TEST', 'ODI', 'T20I', 'IPL')),
  matches           INTEGER NOT NULL DEFAULT 0,
  innings           INTEGER NOT NULL DEFAULT 0,
  not_outs          INTEGER NOT NULL DEFAULT 0,
  runs              INTEGER NOT NULL DEFAULT 0,
  balls             INTEGER,
  highest           TEXT,
  average           NUMERIC(7, 2),
  strike_rate       NUMERIC(7, 2),
  hundreds          INTEGER NOT NULL DEFAULT 0,
  double_hundreds   INTEGER NOT NULL DEFAULT 0,
  fifties           INTEGER NOT NULL DEFAULT 0,
  fours             INTEGER,
  sixes             INTEGER,
  ducks             INTEGER,
  PRIMARY KEY (player_id, format)
);

CREATE TABLE player_bowling (
  player_id         INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format            TEXT NOT NULL CHECK (format IN ('TEST', 'ODI', 'T20I', 'IPL')),
  matches           INTEGER NOT NULL DEFAULT 0,
  innings           INTEGER NOT NULL DEFAULT 0,
  balls             INTEGER NOT NULL DEFAULT 0,
  runs              INTEGER NOT NULL DEFAULT 0,
  maidens           INTEGER,
  wickets           INTEGER NOT NULL DEFAULT 0,
  average           NUMERIC(7, 2),
  economy           NUMERIC(6, 2),
  strike_rate       NUMERIC(7, 2),
  best_innings      TEXT,
  best_match        TEXT,
  four_wickets      INTEGER,
  five_wickets      INTEGER NOT NULL DEFAULT 0,
  ten_wickets       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (player_id, format)
);

CREATE TABLE player_fielding (
  player_id         INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format            TEXT NOT NULL CHECK (format IN ('TEST', 'ODI', 'T20I', 'IPL')),
  span              TEXT,                    -- "2011-2025"
  matches           INTEGER NOT NULL DEFAULT 0,
  innings           INTEGER NOT NULL DEFAULT 0,
  dismissals        INTEGER NOT NULL DEFAULT 0,
  catches           INTEGER NOT NULL DEFAULT 0,
  stumpings         INTEGER NOT NULL DEFAULT 0,
  catches_keeper    INTEGER NOT NULL DEFAULT 0,
  catches_fielder   INTEGER NOT NULL DEFAULT 0,
  best_innings      TEXT,                    -- most dismissals in an innings: "5 (5ct 0st)"
  per_innings       NUMERIC(5, 3),
  PRIMARY KEY (player_id, format)
);

-- ---------------------------------------------------------------------
-- TEAMS
-- ---------------------------------------------------------------------
-- Current squads of the teams ScorePulse knows about (filters, scorer picker).
CREATE TABLE player_teams (
  player_id         INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id           INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  source            TEXT NOT NULL DEFAULT 'cricbuzz' CHECK (source IN ('cricbuzz', 'matches', 'manual')),
  PRIMARY KEY (player_id, team_id)
);

CREATE INDEX player_teams_team_idx ON player_teams (team_id);

-- Every side a player has represented, including ones not in `teams`.
CREATE TABLE player_affiliations (
  player_id         INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  kind              TEXT NOT NULL CHECK (kind IN ('international', 'franchise', 'domestic', 'other')),
  league            TEXT,                    -- "IPL", "BBL", "The Hundred" ... for franchises
  team_id           INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  list_order        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (player_id, name)
);

COMMIT;
