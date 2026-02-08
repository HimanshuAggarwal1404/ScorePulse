
INSERT INTO matches (
  source_match_id,
  match_type,
  gender,
  team_type,
  venue,
  city,
  match_date,
  season,
  overs,
  winner,
  win_by_runs,
  win_by_wickets,
  method,
  event_name
)
VALUES (
  '3677',
  'T20',
  'male',
  'international',
  'Dubai International Cricket Stadium',
  'Dubai',
  '2026-01-31',
  '2025/26',
  20,
  'Ireland',
  30,
  NULL,
  'None',
  'Ireland tour of United Arab Emirates'
)
ON CONFLICT (source_match_id) DO NOTHING;


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'PR Stirling',
  'stirling',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'stirling'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'GR Adair',
  'adair',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'adair'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'HT Tector',
  'tector',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'tector'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'L Tucker',
  'tucker',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'tucker'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'C Campher',
  'campher',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'campher'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'BF Calitz',
  'calitz',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'calitz'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'GJ Delany',
  'delany',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'delany'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'GH Dockrell',
  'dockrell',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'dockrell'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'MR Adair',
  'adair',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'adair'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'BJ McCarthy',
  'mccarthy',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'mccarthy'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'Ireland',
  'MJ Humphreys',
  'humphreys',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'humphreys'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'A Sharma',
  'sharma',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'sharma'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Waseem Muhammad',
  'muhammad',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'muhammad'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Muhammad Zohaib',
  'zohaib',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'zohaib'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'A Sharafu',
  'sharafu',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'sharafu'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'H Kaushik',
  'kaushik',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'kaushik'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'MR Kumar',
  'kumar',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'kumar'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'D Parashar',
  'parashar',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'parashar'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Muhammad Arfan',
  'arfan',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'arfan'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Haider Ali',
  'ali',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'ali'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Junaid Siddique',
  'siddique',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'siddique'
WHERE m.source_match_id = '3677';


INSERT INTO match_players (
  match_id,
  team_name,
  player_name,
  last_name,
  player_stats_id,
  matched_by
)
SELECT
  m.id,
  'United Arab Emirates',
  'Muhammad Jawadullah',
  'jawadullah',
  ps.id,
  'last_name'
FROM matches m
LEFT JOIN players_stats ps
  ON LOWER(ps.name) LIKE '% ' || 'jawadullah'
WHERE m.source_match_id = '3677';


INSERT INTO innings (
  match_id,
  team_id,
  innings_number,
  batting_team
)
SELECT
  m.id,
  t.id,
  1,
  'Ireland'
FROM matches m
JOIN teams t ON t.name = 'Ireland'
WHERE m.source_match_id = '3677';


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 0
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'PR Stirling',
  'Junaid Siddique',
  'GR Adair',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'PR Stirling',
  'Junaid Siddique',
  'GR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'GR Adair',
  'Junaid Siddique',
  'PR Stirling',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'GR Adair',
  'Junaid Siddique',
  'PR Stirling',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'GR Adair',
  'Junaid Siddique',
  'PR Stirling',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'GR Adair',
  'Junaid Siddique',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 0;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'GR Adair',
  'caught',
  ARRAY['A Sharma']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 1
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'PR Stirling',
  'D Parashar',
  'HT Tector',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'HT Tector',
  'D Parashar',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'HT Tector',
  'D Parashar',
  'PR Stirling',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'PR Stirling',
  'D Parashar',
  'HT Tector',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'PR Stirling',
  'D Parashar',
  'HT Tector',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'PR Stirling',
  'D Parashar',
  'HT Tector',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 1;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 2
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'HT Tector',
  'Junaid Siddique',
  'PR Stirling',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'HT Tector',
  'Junaid Siddique',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'HT Tector',
  'Junaid Siddique',
  'PR Stirling',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'HT Tector',
  'Junaid Siddique',
  'PR Stirling',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'PR Stirling',
  'Junaid Siddique',
  'HT Tector',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'PR Stirling',
  'Junaid Siddique',
  'HT Tector',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 2;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 3
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'HT Tector',
  'Haider Ali',
  'PR Stirling',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'HT Tector',
  'Haider Ali',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'HT Tector',
  'Haider Ali',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'HT Tector',
  'Haider Ali',
  'PR Stirling',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'PR Stirling',
  'Haider Ali',
  'HT Tector',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'PR Stirling',
  'Haider Ali',
  'HT Tector',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 3;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 4
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'HT Tector',
  'Muhammad Arfan',
  'PR Stirling',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'HT Tector',
  'Muhammad Arfan',
  'PR Stirling',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'PR Stirling',
  'Muhammad Arfan',
  'HT Tector',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'PR Stirling',
  'bowled',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'L Tucker',
  'Muhammad Arfan',
  'HT Tector',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'HT Tector',
  'Muhammad Arfan',
  'L Tucker',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'HT Tector',
  'Muhammad Arfan',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 4;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 5
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'HT Tector',
  'Haider Ali',
  'L Tucker',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'HT Tector',
  'Haider Ali',
  'L Tucker',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'HT Tector',
  'Haider Ali',
  'L Tucker',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'HT Tector',
  'caught',
  ARRAY['Waseem Muhammad']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Haider Ali',
  'L Tucker',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'C Campher',
  'Haider Ali',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'L Tucker',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 5;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 6
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Muhammad Arfan',
  'L Tucker',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Muhammad Arfan',
  'L Tucker',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'C Campher',
  'Muhammad Arfan',
  'L Tucker',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Muhammad Arfan',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'L Tucker',
  'Muhammad Arfan',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'L Tucker',
  'Muhammad Arfan',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 6;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 7
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Haider Ali',
  'L Tucker',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Haider Ali',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'L Tucker',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'L Tucker',
  'Haider Ali',
  'C Campher',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'L Tucker',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'L Tucker',
  'Haider Ali',
  'C Campher',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 7;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 8
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Muhammad Jawadullah',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'L Tucker',
  'Muhammad Jawadullah',
  'C Campher',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'L Tucker',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Muhammad Jawadullah',
  'L Tucker',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'L Tucker',
  'Muhammad Jawadullah',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'L Tucker',
  'caught',
  ARRAY['H Kaushik']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'BF Calitz',
  'Muhammad Jawadullah',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 8;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 9
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'D Parashar',
  'BF Calitz',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'D Parashar',
  'BF Calitz',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'BF Calitz',
  'D Parashar',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'D Parashar',
  'BF Calitz',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'BF Calitz',
  'D Parashar',
  'C Campher',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'BF Calitz',
  'D Parashar',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'C Campher',
  'D Parashar',
  'BF Calitz',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 9;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 10
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'BF Calitz',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Muhammad Jawadullah',
  'BF Calitz',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'C Campher',
  'Muhammad Jawadullah',
  'BF Calitz',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'BF Calitz',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'C Campher',
  'Muhammad Jawadullah',
  'BF Calitz',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'C Campher',
  'Muhammad Jawadullah',
  'BF Calitz',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 10;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 11
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'BF Calitz',
  'Muhammad Arfan',
  'C Campher',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'BF Calitz',
  'Muhammad Arfan',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'BF Calitz',
  'bowled',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'GJ Delany',
  'Muhammad Arfan',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Muhammad Arfan',
  'GJ Delany',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'GJ Delany',
  'Muhammad Arfan',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'C Campher',
  'Muhammad Arfan',
  'GJ Delany',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 11;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 12
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Haider Ali',
  'GJ Delany',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'GJ Delany',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'GJ Delany',
  'caught',
  ARRAY['MR Kumar']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'GH Dockrell',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'GH Dockrell',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'GH Dockrell',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'GH Dockrell',
  'Haider Ali',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 12;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 13
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Junaid Siddique',
  'GH Dockrell',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Junaid Siddique',
  'GH Dockrell',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'GH Dockrell',
  'Junaid Siddique',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'GH Dockrell',
  'Junaid Siddique',
  'C Campher',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'GH Dockrell',
  'Junaid Siddique',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'GH Dockrell',
  'bowled',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Adair',
  'Junaid Siddique',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 13;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 14
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 14;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 15
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'MR Adair',
  'Muhammad Arfan',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Muhammad Arfan',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'MR Adair',
  'Muhammad Arfan',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Muhammad Arfan',
  'MR Adair',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'C Campher',
  'Muhammad Arfan',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Adair',
  'Muhammad Arfan',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 15;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 16
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'MR Adair',
  'H Kaushik',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'C Campher',
  'H Kaushik',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 16;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 17
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Muhammad Jawadullah',
  'MR Adair',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Muhammad Jawadullah',
  'MR Adair',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 17;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 18
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'MR Adair',
  'Junaid Siddique',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  2,
  1,
  3,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'MR Adair',
  'Junaid Siddique',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  8,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  9,
  'C Campher',
  'Junaid Siddique',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 18;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 19
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'C Campher',
  'Muhammad Jawadullah',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'C Campher',
  'Muhammad Jawadullah',
  'MR Adair',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'C Campher',
  'Muhammad Jawadullah',
  'MR Adair',
  0,
  2,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'MR Adair',
  'Muhammad Jawadullah',
  'C Campher',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 1
  AND o.over_number = 19;


INSERT INTO innings (
  match_id,
  team_id,
  innings_number,
  batting_team
)
SELECT
  m.id,
  t.id,
  2,
  'United Arab Emirates'
FROM matches m
JOIN teams t ON t.name = 'United Arab Emirates'
WHERE m.source_match_id = '3677';


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 0
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Waseem Muhammad',
  'MR Adair',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 0;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 1
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Waseem Muhammad',
  'MJ Humphreys',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Waseem Muhammad',
  'MJ Humphreys',
  'A Sharma',
  3,
  0,
  3,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'MJ Humphreys',
  'Waseem Muhammad',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharma',
  'MJ Humphreys',
  'Waseem Muhammad',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'MJ Humphreys',
  'Waseem Muhammad',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'MJ Humphreys',
  'Waseem Muhammad',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 1;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 2
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Waseem Muhammad',
  'MR Adair',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Waseem Muhammad',
  'MR Adair',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Waseem Muhammad',
  'MR Adair',
  'A Sharma',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'MR Adair',
  'Waseem Muhammad',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'Waseem Muhammad',
  'MR Adair',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 2;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 3
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Waseem Muhammad',
  'BJ McCarthy',
  'A Sharma',
  3,
  0,
  3,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'BJ McCarthy',
  'Waseem Muhammad',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Waseem Muhammad',
  'BJ McCarthy',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Waseem Muhammad',
  'BJ McCarthy',
  'A Sharma',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Waseem Muhammad',
  'BJ McCarthy',
  'A Sharma',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Waseem Muhammad',
  'BJ McCarthy',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'Waseem Muhammad',
  'lbw',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'Muhammad Zohaib',
  'BJ McCarthy',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 3;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 4
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'MJ Humphreys',
  'Muhammad Zohaib',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'MJ Humphreys',
  'Muhammad Zohaib',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'MJ Humphreys',
  'Muhammad Zohaib',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Zohaib',
  'MJ Humphreys',
  'A Sharma',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Zohaib',
  'MJ Humphreys',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Zohaib',
  'MJ Humphreys',
  'A Sharma',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 4;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 5
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'BJ McCarthy',
  'Muhammad Zohaib',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'BJ McCarthy',
  'Muhammad Zohaib',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Zohaib',
  'BJ McCarthy',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Zohaib',
  'BJ McCarthy',
  'A Sharma',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Zohaib',
  'BJ McCarthy',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'BJ McCarthy',
  'Muhammad Zohaib',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 5;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 6
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Muhammad Zohaib',
  'GJ Delany',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Zohaib',
  'GJ Delany',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 6;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 7
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Muhammad Zohaib',
  'C Campher',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Muhammad Zohaib',
  'C Campher',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Zohaib',
  'C Campher',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharma',
  'C Campher',
  'Muhammad Zohaib',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'C Campher',
  'Muhammad Zohaib',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Zohaib',
  'C Campher',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 7;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 8
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'GJ Delany',
  'Muhammad Zohaib',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Zohaib',
  'GJ Delany',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'Muhammad Zohaib',
  'caught',
  ARRAY['C Campher']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharafu',
  'GJ Delany',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'GJ Delany',
  'A Sharafu',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'GJ Delany',
  'A Sharafu',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 8;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 9
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'GH Dockrell',
  'A Sharafu',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharafu',
  'GH Dockrell',
  'A Sharma',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharafu',
  'GH Dockrell',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharafu',
  'GH Dockrell',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'GH Dockrell',
  'A Sharafu',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharafu',
  'GH Dockrell',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 9;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 10
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharafu',
  'MJ Humphreys',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharafu',
  'MJ Humphreys',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'A Sharafu',
  'stumped',
  ARRAY['L Tucker']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'H Kaushik',
  'MJ Humphreys',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'A Sharma',
  'MJ Humphreys',
  'H Kaushik',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'MJ Humphreys',
  'H Kaushik',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'A Sharma',
  'MJ Humphreys',
  'H Kaushik',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 10;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 11
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'C Campher',
  'H Kaushik',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'C Campher',
  'H Kaushik',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'C Campher',
  'H Kaushik',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'H Kaushik',
  'C Campher',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'A Sharma',
  'C Campher',
  'H Kaushik',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'H Kaushik',
  'C Campher',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 11;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 12
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'H Kaushik',
  'GJ Delany',
  'A Sharma',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'A Sharma',
  'GJ Delany',
  'H Kaushik',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'A Sharma',
  'GJ Delany',
  'H Kaushik',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'H Kaushik',
  'GJ Delany',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'H Kaushik',
  'GJ Delany',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'H Kaushik',
  'caught',
  ARRAY['C Campher']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Kumar',
  'GJ Delany',
  'A Sharma',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 12;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 13
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'A Sharma',
  'GH Dockrell',
  'MR Kumar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'A Sharma',
  'stumped',
  ARRAY['L Tucker']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'D Parashar',
  'GH Dockrell',
  'MR Kumar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'D Parashar',
  'GH Dockrell',
  'MR Kumar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'D Parashar',
  'GH Dockrell',
  'MR Kumar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'MR Kumar',
  'GH Dockrell',
  'D Parashar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'D Parashar',
  'GH Dockrell',
  'MR Kumar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 13;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 14
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'MR Kumar',
  'GJ Delany',
  'D Parashar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'MR Kumar',
  'GJ Delany',
  'D Parashar',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'D Parashar',
  'GJ Delany',
  'MR Kumar',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'D Parashar',
  'GJ Delany',
  'MR Kumar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'D Parashar',
  'GJ Delany',
  'MR Kumar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'MR Kumar',
  'GJ Delany',
  'D Parashar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 14;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 15
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'MR Kumar',
  'GH Dockrell',
  'D Parashar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'D Parashar',
  'GH Dockrell',
  'MR Kumar',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'MR Kumar',
  'GH Dockrell',
  'D Parashar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'MR Kumar',
  'stumped',
  ARRAY['L Tucker']
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Arfan',
  'GH Dockrell',
  'D Parashar',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Arfan',
  'GH Dockrell',
  'D Parashar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Arfan',
  'GH Dockrell',
  'D Parashar',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 15;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 16
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'D Parashar',
  'MR Adair',
  'Muhammad Arfan',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'D Parashar',
  'caught and bowled',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Haider Ali',
  'MR Adair',
  'Muhammad Arfan',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Arfan',
  'MR Adair',
  'Haider Ali',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Arfan',
  'MR Adair',
  'Haider Ali',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Arfan',
  'MR Adair',
  'Haider Ali',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Haider Ali',
  'MR Adair',
  'Muhammad Arfan',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 16;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 17
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Haider Ali',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Haider Ali',
  'BJ McCarthy',
  'Muhammad Arfan',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO wickets (
  delivery_id,
  player_out,
  kind,
  fielders
)
SELECT
  d.id,
  'Haider Ali',
  'bowled',
  NULL
FROM deliveries d
ORDER BY d.id DESC
LIMIT 1;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Junaid Siddique',
  'BJ McCarthy',
  'Muhammad Arfan',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Junaid Siddique',
  'BJ McCarthy',
  'Muhammad Arfan',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Junaid Siddique',
  'BJ McCarthy',
  'Muhammad Arfan',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 17;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 18
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  6,
  0,
  6,
  false,
  true
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Arfan',
  'MR Adair',
  'Junaid Siddique',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  7,
  'Junaid Siddique',
  'MR Adair',
  'Muhammad Arfan',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 18;


INSERT INTO overs (innings_id, over_number)
SELECT i.id, 19
FROM innings i
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  1,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  2,
  'Junaid Siddique',
  'BJ McCarthy',
  'Muhammad Arfan',
  0,
  1,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  3,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  0,
  0,
  0,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  4,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  4,
  0,
  4,
  true,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  5,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  2,
  0,
  2,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;


INSERT INTO deliveries (
  over_id,
  ball_number,
  batter,
  bowler,
  non_striker,
  runs_batter,
  runs_extras,
  runs_total,
  is_boundary,
  is_six
)
SELECT
  o.id,
  6,
  'Muhammad Arfan',
  'BJ McCarthy',
  'Junaid Siddique',
  1,
  0,
  1,
  false,
  false
FROM overs o
JOIN innings i ON i.id = o.innings_id
JOIN matches m ON m.id = i.match_id
WHERE m.source_match_id = '3677'
  AND i.innings_number = 2
  AND o.over_number = 19;
