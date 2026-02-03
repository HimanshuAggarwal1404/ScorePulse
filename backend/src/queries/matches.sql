SELECT
  m.id,
  m.match_type,
  m.status,
  m.start_time,
  t1.name AS team1,
  t2.name AS team2
FROM matches m
JOIN teams t1 ON m.team1_id = t1.id
JOIN teams t2 ON m.team2_id = t2.id
ORDER BY m.start_time DESC
LIMIT 10;
