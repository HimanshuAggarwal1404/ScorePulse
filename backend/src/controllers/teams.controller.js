import db from "../db/index.js";
import { logoFor } from "../lib/teamLogos.js";

export const getAllTeams = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        t.id, t.name, t.short_code, t.type,
        (SELECT count(*)::int FROM player_teams pt WHERE pt.team_id = t.id) AS player_count,
        -- a few familiar faces: the most experienced players with photos
        COALESCE((
          SELECT json_agg(json_build_object('id', f.id, 'name', f.name, 'image_url', f.image_url))
            FROM (
              SELECT p.id, p.name, p.image_url
                FROM player_teams pt JOIN players p ON p.id = pt.player_id
               WHERE pt.team_id = t.id AND p.image_url IS NOT NULL
               ORDER BY (SELECT COALESCE(SUM(b.matches), 0) FROM player_batting b WHERE b.player_id = p.id) DESC, p.name
               LIMIT 4
            ) f
        ), '[]') AS faces
      FROM teams t
      ORDER BY t.name
    `);

    res.json({ teams: rows.map((t) => ({ ...t, logo: logoFor(t.name) })) });
  } catch (err) {
    console.error("Teams fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};
