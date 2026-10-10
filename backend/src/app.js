import express from "express";
import cors from "cors";

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

app.use(cors());
app.use(express.json());

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
