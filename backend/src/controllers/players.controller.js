import db from "../db/index.js";
import fs from "fs";
import path from "path";

const sql = fs.readFileSync(
  path.resolve("src/queries/players.sql"),
  "utf-8"
);

// helper to extract named query
const getQuery = (name) => {
  const regex = new RegExp(
    `-- ${name}[\\s\\S]*?(?=-- |$)`,
    "g"
  );
  return sql.match(regex)?.[0].replace(`-- ${name}`, "").trim();
};

// =====================
// GET ALL PLAYERS
// =====================
export const getPlayers = async (req, res) => {
  try {
    const query = getQuery("get_all_players");
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Players fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

// =====================
// GET PLAYER BY ID
// =====================
export const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await db.query(
      getQuery("get_player_basic"),
      [id]
    );

    if (player.rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const [
      batOdi,
      batT20,
      batTest,
      bowlOdi,
      bowlT20,
      bowlTest,
      fieldOdi,
      fieldT20,
      fieldTest
    ] = await Promise.all([
      db.query(getQuery("batting_odi"), [id]),
      db.query(getQuery("batting_t20"), [id]),
      db.query(getQuery("batting_test"), [id]),
      db.query(getQuery("bowling_odi"), [id]),
      db.query(getQuery("bowling_t20"), [id]),
      db.query(getQuery("bowling_test"), [id]),
      db.query(getQuery("fielding_odi"), [id]),
      db.query(getQuery("fielding_t20"), [id]),
      db.query(getQuery("fielding_test"), [id]),
    ]);

    res.json({
      player: player.rows[0],
      batting: {
        odi: batOdi.rows[0] || null,
        t20: batT20.rows[0] || null,
        test: batTest.rows[0] || null,
      },
      bowling: {
        odi: bowlOdi.rows[0] || null,
        t20: bowlT20.rows[0] || null,
        test: bowlTest.rows[0] || null,
      },
      fielding: {
        odi: fieldOdi.rows[0] || null,
        t20: fieldT20.rows[0] || null,
        test: fieldTest.rows[0] || null,
      },
    });
  } catch (err) {
    console.error("getPlayerById error:", err.message);
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
