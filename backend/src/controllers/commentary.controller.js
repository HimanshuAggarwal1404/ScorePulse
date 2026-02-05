import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/commentary.sql"),
  "utf-8"
);

export const getCommentary = async (req, res) => {
  const { matchId } = req.params;

  try {
    const { rows } = await db.query(sql, [matchId]);

    // Group: innings → overs → balls
    const inningsMap = {};

    for (const r of rows) {
      if (!inningsMap[r.innings_id]) {
        inningsMap[r.innings_id] = {
          innings_id: r.innings_id,
          innings_number: r.innings_number,
          overs: {}
        };
      }

      const overs = inningsMap[r.innings_id].overs;

      if (!overs[r.over_number]) {
        overs[r.over_number] = {
          over: r.over_number,
          balls: []
        };
      }

      overs[r.over_number].balls.push({
        ball: r.ball,
        runs: r.total_runs,
        isWicket: r.is_wicket,
        wicketType: r.wicket_type,
        text: r.commentary,
        time: r.created_at
      });
    }

    // Convert maps → arrays
    const response = {
      matchId,
      innings: Object.values(inningsMap).map(i => ({
        innings_id: i.innings_id,
        innings_number: i.innings_number,
        overs: Object.values(i.overs)
      }))
    };

    res.json(response);
  } catch (err) {
    console.error("Commentary error:", err.message);
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
};
