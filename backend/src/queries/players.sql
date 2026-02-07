-- get_all_players
SELECT
  id,
  name,
  nationality,
  franchise
FROM players_stats
ORDER BY name ASC;

-- get_player_basic
SELECT
  id,
  name,
  nationality,
  franchise
FROM players_stats
WHERE id = $1;

-- batting_odi
SELECT * FROM batting_odi WHERE player_id = $1;

-- batting_t20
SELECT * FROM batting_t20 WHERE player_id = $1;

-- batting_test
SELECT * FROM batting_test WHERE player_id = $1;

-- bowling_odi
SELECT * FROM bowling_odi WHERE player_id = $1;

-- bowling_t20
SELECT * FROM bowling_t20 WHERE player_id = $1;

-- bowling_test
SELECT * FROM bowling_test WHERE player_id = $1;

-- fielding_odi
SELECT * FROM fielding_odi WHERE player_id = $1;

-- fielding_t20
SELECT * FROM fielding_t20 WHERE player_id = $1;

-- fielding_test
SELECT * FROM fielding_test WHERE player_id = $1;
