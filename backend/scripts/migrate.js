// Applies SQL files in db/migrations that haven't been applied yet.
//   npm run db:migrate
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../src/db/index.js";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../db/migrations");

await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`);
const { rows } = await db.query("SELECT name FROM schema_migrations");
const applied = new Set(rows.map((r) => r.name));

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(file)) continue;
  console.log(`Applying ${file}`);
  await db.query(fs.readFileSync(path.join(dir, file), "utf-8"));
  await db.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
}
console.log("Migrations up to date");
await db.end();
