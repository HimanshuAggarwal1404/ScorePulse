SELECT
  m.*,
  t1.name AS team1_name,
  t2.name AS team2_name
FROM matches m
JOIN teams t1 ON t1.id = m.team1_id
JOIN teams t2 ON t2.id = m.team2_id
WHERE m.id = $1;
