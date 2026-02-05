WITH ball_stats AS (
  SELECT
    i.id AS innings_id,
    i.innings_number,
    t.name AS batting_team,

    SUM(b.runs_off_bat + b.extras) AS total_runs,
    COUNT(*) FILTER (WHERE b.wicket_type IS NOT NULL) AS wickets,
    MAX(b.over_number) || '.' || MAX(b.ball_number) AS overs
  FROM innings i
  JOIN teams t ON t.id = i.batting_team_id
  JOIN balls b ON b.innings_id = i.id
  WHERE i.match_id = $1
  GROUP BY i.id, t.name
)
SELECT * FROM ball_stats
ORDER BY innings_number;
