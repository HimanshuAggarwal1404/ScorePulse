export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(sql, [id]);

    if (!rows.length) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch match" });
  }
};
