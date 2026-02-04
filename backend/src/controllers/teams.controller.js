import db from "../db/index.js";
import fs from "fs";
import path from "path";

const teamsSql = fs.readFileSync(
  path.resolve("src/queries/teams.sql"),
  "utf-8"
);

export const getTeams = async (req, res) => {
  try {
    const { rows } = await db.query(teamsSql);
    res.json(rows);
  } catch (err) {
    console.error("Get teams error:", err.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};
