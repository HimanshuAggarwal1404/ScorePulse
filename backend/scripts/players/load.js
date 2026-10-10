// Loads db/seed/players.json into the database (no network needed).
//   npm run players:load
//
// Players are matched on their Cricbuzz / ESPNcricinfo id, so ids (and the
// /players/:id URLs) stay the same across syncs. Afterwards every scorecard
// player in match_players is re-linked to a profile.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../../src/db/index.js";
import { TEAMS } from "./teams.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = path.resolve(here, "../../db/seed/players.json");

const snap = JSON.parse(fs.readFileSync(SNAPSHOT, "utf-8"));
const client = await db.connect();

const insertRows = async (table, playerId, records) => {
  for (const [format, r] of Object.entries(records || {})) {
    const cols = Object.keys(r);
    await client.query(
      `INSERT INTO ${table} (player_id, format, ${cols.join(", ")})
       VALUES ($1, $2, ${cols.map((_, i) => `$${i + 3}`).join(", ")})`,
      [playerId, format, ...cols.map((c) => r[c])]
    );
  }
};

try {
  await client.query("BEGIN");

  const { rows: teams } = await client.query("SELECT id, name FROM teams");
  const teamByName = new Map(teams.map((t) => [t.name.toLowerCase(), t.id]));
  const teamByCricbuzz = new Map(
    TEAMS.filter((t) => t.cricbuzzId && teamByName.has(t.name.toLowerCase())).map((t) => [t.cricbuzzId, teamByName.get(t.name.toLowerCase())])
  );
  const missing = TEAMS.filter((t) => !teamByName.has(t.name.toLowerCase()));
  if (missing.length) console.warn(`Teams not in the database (skipped): ${missing.map((t) => t.name).join(", ")}`);

  const { rows: existing } = await client.query("SELECT id, cricbuzz_id, cricinfo_id FROM players");
  const byCricbuzz = new Map(existing.filter((p) => p.cricbuzz_id).map((p) => [p.cricbuzz_id, p.id]));
  const byCricinfo = new Map(existing.filter((p) => p.cricinfo_id).map((p) => [p.cricinfo_id, p.id]));

  const idByKey = new Map();
  for (const p of snap.players) {
    const values = [
      p.name,
      p.fullName || null,
      p.country || null,
      p.country ? teamByName.get(p.country.toLowerCase()) || null : null,
      p.role || null,
      p.roleLabel || null,
      p.battingStyle || null,
      p.bowlingStyle || null,
      p.dateOfBirth || null,
      p.birthPlace || null,
      p.height || null,
      p.image || null,
      p.rankings ? JSON.stringify(p.rankings) : null,
      p.debuts?.length ? JSON.stringify(p.debuts) : null,
      p.recentForm?.batting?.length || p.recentForm?.bowling?.length ? JSON.stringify(p.recentForm) : null,
      p.cricbuzzId || null,
      p.cricinfoId || null,
      p.cricsheetId || null,
      p.source,
    ];
    const id = byCricbuzz.get(p.cricbuzzId) ?? byCricinfo.get(p.cricinfoId);
    const cols = `name, full_name, country, country_team_id, role, role_label, batting_style, bowling_style,
                  date_of_birth, birth_place, height, image_url, rankings, debuts, recent_form,
                  cricbuzz_id, cricinfo_id, cricsheet_id, source`;
    if (id) {
      await client.query(
        `UPDATE players SET (${cols}, updated_at) = (${values.map((_, i) => `$${i + 2}`).join(", ")}, now()) WHERE id = $1`,
        [id, ...values]
      );
      idByKey.set(p.key, id);
    } else {
      const { rows } = await client.query(
        `INSERT INTO players (${cols}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING id`,
        values
      );
      idByKey.set(p.key, rows[0].id);
    }
  }

  // anyone synced before but gone from the sources now
  const keep = [...idByKey.values()];
  const { rowCount: removed } = await client.query(
    "DELETE FROM players WHERE source <> 'manual' AND NOT (id = ANY($1::int[]))",
    [keep]
  );

  await client.query("DELETE FROM player_batting WHERE player_id = ANY($1::int[])", [keep]);
  await client.query("DELETE FROM player_bowling WHERE player_id = ANY($1::int[])", [keep]);
  await client.query("DELETE FROM player_fielding WHERE player_id = ANY($1::int[])", [keep]);
  await client.query("DELETE FROM player_affiliations WHERE player_id = ANY($1::int[])", [keep]);
  await client.query("DELETE FROM player_teams WHERE source <> 'manual'");

  for (const p of snap.players) {
    const id = idByKey.get(p.key);
    await insertRows("player_batting", id, p.batting);
    await insertRows("player_bowling", id, p.bowling);
    await insertRows("player_fielding", id, p.fielding);
    for (const [i, a] of (p.affiliations || []).entries()) {
      await client.query(
        `INSERT INTO player_affiliations (player_id, name, kind, league, team_id, list_order)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
        [id, a.name, a.kind, a.league, teamByCricbuzz.get(a.cricbuzzTeamId) || null, i]
      );
    }
  }

  let memberships = 0;
  for (const [source, groups] of [["cricbuzz", snap.squads], ["matches", snap.matchSquads]]) {
    for (const [team, keys] of Object.entries(groups || {})) {
      const teamId = teamByName.get(team.toLowerCase());
      if (!teamId) continue;
      for (const key of keys) {
        const playerId = idByKey.get(key);
        if (!playerId) continue;
        const { rowCount } = await client.query(
          "INSERT INTO player_teams (player_id, team_id, source) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [playerId, teamId, source]
        );
        memberships += rowCount;
      }
    }
  }

  // scorecards -> profiles: Cricsheet registry id first, then an unambiguous name
  await client.query("UPDATE match_players SET player_id = NULL");
  const { rowCount: byRegistry } = await client.query(
    `UPDATE match_players mp SET player_id = p.id
       FROM players p WHERE p.cricsheet_id = mp.registry_id`
  );
  const { rowCount: byName } = await client.query(
    `UPDATE match_players mp SET player_id = (SELECT p.id FROM players p WHERE lower(p.name) = lower(mp.name))
      WHERE mp.player_id IS NULL
        AND (SELECT count(*) FROM players p WHERE lower(p.name) = lower(mp.name)) = 1`
  );
  const { rows: total } = await client.query("SELECT count(*)::int AS n FROM match_players");

  await client.query("COMMIT");
  console.log(`Loaded ${snap.players.length} players (snapshot from ${snap.generatedAt}); removed ${removed} stale`);
  console.log(`${memberships} squad memberships`);
  console.log(`Scorecard players linked: ${byRegistry + byName} of ${total[0].n} (${byRegistry} by registry, ${byName} by name)`);
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();
  await db.end();
}
