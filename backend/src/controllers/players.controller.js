import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/players.sql"),
  "utf-8"
);

export const getPlayers = async (req, res) => {
  try {
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Players fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};
