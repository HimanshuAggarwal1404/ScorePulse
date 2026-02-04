import db from "../db/index.js";
import fs from "fs";
import path from "path";

const playersSql = fs.readFileSync(
  path.resolve("src/queries/players.sql"),
  "utf-8"
);

export const getPlayers = async (req, res) => {
  try {
    const { teamId } = req.query;

    let query = playersSql;
    let params = [];

    if (teamId) {
      query += " WHERE p.team_id = $1";
      params.push(teamId);
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Get players error:", err.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};
