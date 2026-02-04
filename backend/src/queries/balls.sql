SELECT
  b.over_number,
  b.ball_in_over,
  b.runs,
  b.is_wicket,
  b.created_at,

  striker.name AS batsman,
  bowler.name AS bowler

FROM balls b
JOIN players striker ON striker.id = b.batsman_id
JOIN players bowler ON bowler.id = b.bowler_id
WHERE b.innings_id = $1
ORDER BY b.over_number, b.ball_in_over;
