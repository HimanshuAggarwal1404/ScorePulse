SELECT
  i.id,
  i.match_id,
  i.innings_number,
  i.runs,
  i.wickets,
  i.overs,
  i.is_completed,

  bt.name AS batting_team,
  bw.name AS bowling_team

FROM innings i
JOIN teams bt ON bt.id = i.batting_team_id
JOIN teams bw ON bw.id = i.bowling_team_id
WHERE i.match_id = $1
ORDER BY i.innings_number;



