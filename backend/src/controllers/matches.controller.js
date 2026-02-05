import db from "../db/index.js";
import fs from "fs";
import path from "path";

/* ---------- SQL FILES ---------- */

const recentMatchesSQL = fs.readFileSync(
  path.resolve("src/queries/recent_matches.sql"),
  "utf-8"
);

const scorecardSQL = fs.readFileSync(
  path.resolve("src/queries/scorecard.sql"),
  "utf-8"
);

const commentarySQL = fs.readFileSync(
  path.resolve("src/queries/commentary.sql"),
  "utf-8"
);

/* ---------- CONTROLLERS ---------- */

export const getRecentMatches = async (req, res) => {
  try {
    const { rows } = await db.query(recentMatchesSQL);

    const formatted = rows.map((m) => ({
      id: m.id,
      type: m.format,
      live: !m.status?.toLowerCase().includes("won"),
      team1: {
        name: m.team1_name,
        code: m.team1_code,
        score: "—",
        wickets: "—",
        overs: "—",
      },
      team2: {
        name: m.team2_name,
        code: m.team2_code,
        score: "—",
        wickets: "—",
        overs: "—",
      },
      status: m.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Recent matches error:", err);
    res.status(500).json({ error: "Failed to fetch recent matches" });
  }
};

export const getMatchScorecard = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(scorecardSQL, [id]);
    res.json({ matchId: id, innings: rows });
  } catch (err) {
    console.error("Scorecard error:", err);
    res.status(500).json({ error: "Failed to fetch scorecard" });
  }
};

export const getMatchCommentary = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(commentarySQL, [id]);
    res.json({ matchId: id, innings: rows });
  } catch (err) {
    console.error("Commentary error:", err);
    res.status(500).json({ error: "Failed to fetch commentary" });
  }
};
