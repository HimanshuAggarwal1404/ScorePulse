import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/matches.sql"),
  "utf-8"
);

export const getMatches = async (req, res) => {
  try {
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Get matches error:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};
