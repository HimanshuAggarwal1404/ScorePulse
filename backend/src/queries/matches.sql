SELECT
  m.id,
  m.format,
  m.status,
  m.start_time,
  m.result,

  t1.name AS team1_name,
  t1.code AS team1_code,

  t2.name AS team2_name,
  t2.code AS team2_code

FROM matches m
JOIN teams t1 ON t1.id = m.team1_id
JOIN teams t2 ON t2.id = m.team2_id
ORDER BY m.start_time DESC;
