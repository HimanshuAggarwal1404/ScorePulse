SELECT
  m.id,
  m.format,
  m.status,
  m.start_time,
  t1.name AS team1_name,
  t1.short_name AS team1_code,
  t2.name AS team2_name,
  t2.short_name AS team2_code
FROM matches m
JOIN teams t1 ON t1.id = m.team1_id
JOIN teams t2 ON t2.id = m.team2_id
WHERE m.start_time >= NOW() - INTERVAL '7 days'
ORDER BY m.start_time DESC
LIMIT 10;
