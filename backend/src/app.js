import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import matchesRoutes from "./routes/matches.routes.js";
import scoringRoutes from "./routes/scoring.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import playersRoutes from "./routes/players.routes.js";
import newsRoutes from "./routes/news.routes.js";
import rankingsRoutes from "./routes/rankings.routes.js";
import fixturesRoutes from "./routes/fixtures.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

const app = express();

// behind Render / any reverse proxy: trust its X-Forwarded-For for client IPs (rate limits)
app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));

app.use(helmet());

// gzip JSON (the players list shrinks ~8x); never buffer Server-Sent Events
app.use(
  compression({
    filter: (req, res) => !String(res.getHeader("Content-Type") || "").includes("text/event-stream") && compression.filter(req, res),
  })
);

// CORS_ORIGIN: comma-separated allowed origins, "*" wildcards allowed for preview
// deploys (https://scorepulse-*.vercel.app). Unset = allow any origin (local dev).
const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean)
  .map((o) => new RegExp(`^${o.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+")}$`));
if (!allowed.length && process.env.NODE_ENV === "production") {
  console.warn("CORS_ORIGIN is not set: the API accepts requests from any website");
}
app.use(
  cors({
    origin: allowed.length ? (origin, cb) => cb(null, !origin || allowed.some((re) => re.test(origin))) : true,
    allowedHeaders: ["Content-Type", "x-scorer-key"],
  })
);

app.use(express.json({ limit: "100kb" }));

// Liveness for the host and uptime pingers. Deliberately doesn't touch the
// database, so pings don't keep a scale-to-zero database awake.
app.get("/api/health", (req, res) => res.json({ ok: true, uptime: Math.round(process.uptime()) }));

const limiter = (limit, windowMinutes) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many requests, slow down a little" },
  });

// generous for readers; tighter for writes and for endpoints that call third-party sites
app.use("/api", limiter(Number(process.env.RATE_LIMIT_API) || 900, 5));
app.use("/api/scoring", limiter(Number(process.env.RATE_LIMIT_SCORING) || 300, 5));
app.use(["/api/news", "/api/rankings", "/api/fixtures"], limiter(120, 5));

app.use("/api/matches", matchesRoutes);
app.use("/api/scoring", scoringRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/rankings", rankingsRoutes);
app.use("/api/fixtures", fixturesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
