import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/balls.sql"),
  "utf-8"
);

export const getBallsByInnings = async (req, res) => {
  try {
    const { inningsId } = req.params;
    const { rows } = await db.query(sql, [inningsId]);
    res.json(rows);
  } catch (err) {
    console.error("Get balls error:", err.message);
    res.status(500).json({ error: "Failed to fetch balls" });
  }
};
