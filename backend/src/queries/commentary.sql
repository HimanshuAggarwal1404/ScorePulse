SELECT
  i.id               AS innings_id,
  i.innings_number,
  b.over_number,
  b.ball_number,
  (b.over_number || '.' || b.ball_number) AS ball,
  b.total_runs,
  b.is_wicket,
  b.wicket_type,
  b.commentary,
  b.created_at
FROM innings i
JOIN balls b
  ON b.innings_id = i.id
WHERE i.match_id = $1
ORDER BY
  i.innings_number,
  b.over_number,
  b.ball_number;
