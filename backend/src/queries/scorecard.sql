SELECT
  m.id AS match_id,
  m.match_type,
  m.match_date,
  i.id AS innings_id,
  i.innings_number,
  i.batting_team,
  i.bowling_team,
  o.id AS over_id,
  o.over_number,
  d.id AS delivery_id,
  d.ball_number,
  d.batter,
  d.bowler,
  d.non_striker,
  d.runs_batter,
  d.runs_extras,
  d.runs_total,
  d.is_boundary,
  d.is_six,
  w.player_out,
  w.kind,
  w.fielders
FROM matches m
JOIN innings i ON i.match_id = m.id
JOIN overs o ON o.innings_id = i.id
JOIN deliveries d ON d.over_id = o.id
LEFT JOIN wickets w ON w.delivery_id = d.id
WHERE m.id = $1
ORDER BY
  i.innings_number,
  o.over_number,
  d.ball_number;
