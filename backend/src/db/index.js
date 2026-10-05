import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const { Pool, types } = pkg;

// DATE -> "YYYY-MM-DD" as-is; a JS Date would shift it by the server's timezone
types.setTypeParser(1082, (v) => v);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

pool.once("connect", () => {
  console.log("PostgreSQL connected");
});

export default pool;
