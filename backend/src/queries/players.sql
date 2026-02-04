SELECT
  p.id,
  p.name,
  p.role,
  p.batting_style,
  p.bowling_style,
  p.country,
  p.is_active,
  t.name AS team_name,
  t.short_code AS team_code
FROM players p
LEFT JOIN teams t ON t.id = p.team_id
WHERE p.is_active = true
ORDER BY p.name;
