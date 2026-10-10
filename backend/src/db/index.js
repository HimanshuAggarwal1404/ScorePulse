import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const { Pool, types } = pkg;

// DATE -> "YYYY-MM-DD" as-is; a JS Date would shift it by the server's timezone
types.setTypeParser(1082, (v) => v);

// Hosted Postgres (Neon, Render, Supabase ...) gives one DATABASE_URL and
// requires TLS; local development uses the separate DB_* variables.
// DB_SSL=false turns TLS off, e.g. for a local DATABASE_URL.
// pg already treats sslmode=require as verify-full (checks the certificate); saying so
// explicitly keeps that behaviour and silences its deprecation warning.
const url = process.env.DATABASE_URL?.replace(/sslmode=(prefer|require|verify-ca)\b/, "sslmode=verify-full");
const ssl = process.env.DB_SSL === "false" ? false : url ? { rejectUnauthorized: true } : false;

const pool = new Pool({
  ...(url
    ? { connectionString: url }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      }),
  ssl,
  max: Number(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: 30000,
  // serverless databases may take a moment to wake from idle
  connectionTimeoutMillis: 15000,
});

pool.once("connect", () => {
  console.log("PostgreSQL connected");
});

// a dropped idle connection (e.g. the database scaled to zero) must not crash the server
pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err.message);
});

export default pool;
