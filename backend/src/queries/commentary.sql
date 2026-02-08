SELECT
  i.innings_number,
  o.over_number,
  d.ball_number,
  d.batter,
  d.bowler,
  d.non_striker,
  d.runs_total,
  d.runs_extras,
  w.kind AS wicket_type,
  w.player_out
FROM deliveries d
JOIN overs o ON o.id = d.over_id
JOIN innings i ON i.id = o.innings_id
LEFT JOIN wickets w ON w.delivery_id = d.id
WHERE i.match_id = $1
ORDER BY i.innings_number, o.over_number, d.ball_number;
