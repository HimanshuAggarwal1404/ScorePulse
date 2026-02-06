SELECT
  p.id,
  p.name,
  p.role,
  p.batting_style,
  p.bowling_style,
  p.country,
  p.is_active,

  it.name AS intl_team_name,
  it.code AS intl_team_code,

  ft.name AS franchise_name,
  ft.code AS franchise_code

FROM players p

-- international team (via country)
LEFT JOIN teams it
  ON it.name = p.country
 AND it.type = 'international'

-- franchise mapping
LEFT JOIN player_teams pt
  ON pt.player_id = p.id

LEFT JOIN teams ft
  ON ft.id = pt.team_id
 AND ft.type = 'franchise'

WHERE p.is_active = true
ORDER BY p.name;
