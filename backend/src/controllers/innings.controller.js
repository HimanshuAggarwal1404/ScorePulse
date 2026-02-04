import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/innings.sql"),
  "utf-8"
);

export const getInningsByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { rows } = await db.query(sql, [matchId]);
    res.json(rows);
  } catch (err) {
    console.error("Get innings error:", err.message);
    res.status(500).json({ error: "Failed to fetch innings" });
  }
};
