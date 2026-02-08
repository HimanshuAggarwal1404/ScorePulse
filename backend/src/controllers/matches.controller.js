import db from "../db/index.js";
import fs from "fs";
import path from "path";

const recentMatchesSQL = fs.readFileSync(
  path.resolve("src/queries/recent_matches.sql"),
  "utf-8"
);
const scorecardSQL = fs.readFileSync(
  path.resolve("src/queries/scorecard.sql"),
  "utf-8"
);
export const getRecentMatches = async (req, res) => {
  try {
    const { rows } = await db.query(recentMatchesSQL);

    const formatted = rows.map((m) => ({
      id: m.id,
      format: m.type,
      status: "completed", // or derive later
      date: m.date,

      team1: {
        name: m.teams?.[0],
        code: m.teams?.[0]
          ? m.teams[0].split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase()
          : "T1",
      },

      team2: {
        name: m.teams?.[1],
        code: m.teams?.[1]
          ? m.teams[1].split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase()
          : "T2",
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent matches error:", err);
    res.status(500).json({ error: "Failed to fetch recent matches" });
  }
};

export const getMatchScorecard = async (req, res) => {
  try {
    const { matchId } = req.params;

    const { rows } = await db.query(scorecardSQL, [matchId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Scorecard not found" });
    }

    res.json({
      matchId,
      scorecard: rows
    });
  } catch (err) {
    console.error("Scorecard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch scorecard" });
  }
};
