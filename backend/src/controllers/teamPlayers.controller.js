import db from "../db/index.js";

export const getTeamPlayers = async (req, res) => {
  const { teamId } = req.params;

  try {
    const { rows } = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.role,
        p.batting_style,
        p.bowling_style,
        p.country
      FROM players p
      JOIN player_teams pt ON pt.player_id = p.id
      WHERE pt.team_id = $1
        AND pt.is_current = true
      ORDER BY p.role, p.name
      `,
      [teamId]
    );

    res.json({ players: rows });
  } catch (err) {
    console.error("Team players error:", err.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};
