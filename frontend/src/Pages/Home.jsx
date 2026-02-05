import db from "../db/index.js";

/* ---------- RECENT MATCHES ---------- */
export const getRecentMatches = async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT id FROM matches`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "recent matches failed" });
  }
};

/* ---------- SCORECARD ---------- */
export const getMatchScorecard = async (req, res) => {
  try {
    res.json({ matchId: req.params.id, scorecard: [] });
  } catch (err) {
    res.status(500).json({ error: "scorecard failed" });
  }
};

/* ---------- COMMENTARY ---------- */
export const getMatchCommentary = async (req, res) => {
  try {
    res.json({ matchId: req.params.id, commentary: [] });
  } catch (err) {
    res.status(500).json({ error: "commentary failed" });
  }
};
