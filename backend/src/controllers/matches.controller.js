import pool from "../db/index.js";
import fs from "fs";
import path from "path";

const queryPath = path.resolve("src/queries/matches.sql");
const matchesQuery = fs.readFileSync(queryPath, "utf-8");

export const getMatches = async (req, res) => {
  try {
    const { rows } = await pool.query(matchesQuery);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};
