import db from "../db/index.js";

export const getAllTeams = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, name, short_code, type
      FROM teams
      ORDER BY name
    `);

    res.json({ teams: rows });
  } catch (err) {
    console.error("Teams fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};
