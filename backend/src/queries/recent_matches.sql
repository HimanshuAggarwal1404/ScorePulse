SELECT
  m.id,
  m.match_type,
  m.match_date,
  ARRAY_AGG(t.name ORDER BY t.name) AS teams
FROM matches m
JOIN match_teams mt ON mt.match_id = m.id
JOIN teams t ON t.id = mt.team_id
GROUP BY m.id, m.match_type, m.match_date
ORDER BY m.match_date DESC
LIMIT 5;
