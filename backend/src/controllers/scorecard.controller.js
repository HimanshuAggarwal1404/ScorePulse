import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/scorecard.sql"),
  "utf-8"
);

export const getScorecard = async (req, res) => {
  try {
    const { matchId } = req.params;

    const { rows } = await db.query(sql, [matchId]);

    res.json({
      matchId,
      innings: rows
    });
  } catch (err) {
    console.error("Scorecard error:", err.message);
    res.status(500).json({ error: "Failed to fetch scorecard" });
  }
};
