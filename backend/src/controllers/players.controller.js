import db from "../db/index.js";

const FORMAT_ORDER = ["TEST", "ODI", "T20I", "IPL"];

const byFormat = (rows) =>
  Object.fromEntries(
    rows
      .sort((a, b) => FORMAT_ORDER.indexOf(a.format) - FORMAT_ORDER.indexOf(b.format))
      .map(({ player_id: _p, format, ...r }) => [format, r])
  );

// =====================
// GET ALL PLAYERS
// Compact cards for the players page, team pages and the scorer's squad picker.
// ?team=ID narrows it to one squad.
// =====================
export const getPlayers = async (req, res) => {
  const teamId = Number(req.query.team) || null;
  try {
    const { rows } = await db.query(
      `
      SELECT
        p.id, p.name, p.country, p.country_team_id, p.role, p.role_label,
        p.batting_style, p.bowling_style, p.date_of_birth, p.image_url, p.rankings,
        COALESCE((SELECT array_agg(pt.team_id ORDER BY pt.team_id) FROM player_teams pt WHERE pt.player_id = p.id), '{}') AS team_ids,
        (SELECT json_object_agg(b.format, json_build_object(
            'm', b.matches, 'r', b.runs, 'avg', b.average, 'sr', b.strike_rate, 'hs', b.highest, 'h', b.hundreds))
           FROM player_batting b WHERE b.player_id = p.id) AS bat,
        (SELECT json_object_agg(w.format, json_build_object(
            'm', w.matches, 'w', w.wickets, 'avg', w.average, 'eco', w.economy, 'bbi', w.best_innings))
           FROM player_bowling w WHERE w.player_id = p.id) AS bowl,
        (SELECT json_object_agg(f.format, json_build_object('ct', f.catches, 'st', f.stumpings))
           FROM player_fielding f WHERE f.player_id = p.id) AS field
      FROM players p
      WHERE $1::int IS NULL OR EXISTS (SELECT 1 FROM player_teams pt WHERE pt.player_id = p.id AND pt.team_id = $1)
      ORDER BY p.name
    `,
      [teamId]
    );
    res.json({ players: rows });
  } catch (err) {
    console.error("Players fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

// =====================
// GET PLAYER BY ID
// =====================
export const getPlayerById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).json({ error: "Player not found" });

  try {
    const { rows } = await db.query(
      `SELECT p.*, t.short_code AS country_code
         FROM players p LEFT JOIN teams t ON t.id = p.country_team_id
        WHERE p.id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "Player not found" });

    const [batting, bowling, fielding, squads, affiliations, appearances] = await Promise.all([
      db.query("SELECT * FROM player_batting WHERE player_id = $1", [id]),
      db.query("SELECT * FROM player_bowling WHERE player_id = $1", [id]),
      db.query("SELECT * FROM player_fielding WHERE player_id = $1", [id]),
      db.query(
        `SELECT t.id, t.name, t.short_code, t.type
           FROM player_teams pt JOIN teams t ON t.id = pt.team_id
          WHERE pt.player_id = $1
          ORDER BY array_position(ARRAY['international', 'franchise', 'domestic'], t.type), t.name`,
        [id]
      ),
      db.query(
        `SELECT a.name, a.kind, a.league, a.team_id, t.short_code
           FROM player_affiliations a LEFT JOIN teams t ON t.id = a.team_id
          WHERE a.player_id = $1 ORDER BY a.list_order`,
        [id]
      ),
      // matches scored on ScorePulse, with what they did in each
      db.query(
        `SELECT m.id AS match_id, m.format, m.match_title, m.series_name, m.start_date, m.status, m.result_text,
                t.short_code AS team, o.short_code AS opponent,
                bat.runs, bat.balls, bat.out, bowl.wickets, bowl.conceded, bowl.legal_balls
           FROM match_players mp
           JOIN matches m ON m.id = mp.match_id
           JOIN teams t ON t.id = mp.team_id
           JOIN teams o ON o.id = CASE WHEN m.team1_id = mp.team_id THEN m.team2_id ELSE m.team1_id END
           LEFT JOIN LATERAL (
             SELECT SUM(d.runs_batter)::int AS runs,
                    COUNT(*) FILTER (WHERE d.wides = 0)::int AS balls,
                    EXISTS (SELECT 1 FROM wickets w WHERE w.match_id = m.id AND w.player_out_id = mp.id
                              AND w.kind NOT IN ('retired hurt', 'retired not out')) AS out
               FROM deliveries d WHERE d.match_id = m.id AND d.batter_id = mp.id
             HAVING COUNT(*) > 0
           ) bat ON true
           LEFT JOIN LATERAL (
             SELECT (SELECT COUNT(*) FROM wickets w JOIN deliveries d2 ON d2.id = w.delivery_id
                      WHERE d2.match_id = m.id AND d2.bowler_id = mp.id
                        AND w.kind IN ('bowled', 'caught', 'caught and bowled', 'lbw', 'stumped', 'hit wicket'))::int AS wickets,
                    SUM(d.runs_batter + d.wides + d.noballs)::int AS conceded,
                    COUNT(*) FILTER (WHERE d.is_legal)::int AS legal_balls
               FROM deliveries d
              WHERE d.match_id = m.id AND d.bowler_id = mp.id
             HAVING COUNT(*) > 0
           ) bowl ON true
          WHERE mp.player_id = $1
          ORDER BY m.start_date DESC, m.id DESC
          LIMIT 20`,
        [id]
      ),
    ]);

    res.json({
      player: rows[0],
      batting: byFormat(batting.rows),
      bowling: byFormat(bowling.rows),
      fielding: byFormat(fielding.rows),
      squads: squads.rows,
      affiliations: affiliations.rows,
      appearances: appearances.rows,
    });
  } catch (err) {
    console.error("getPlayerById error:", err.message);
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
