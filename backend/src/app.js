import express from "express";
import cors from "cors";

import matchesRoutes from "./routes/matches.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import playersRoutes from "./routes/players.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "ScorePulse backend running" });
});

app.use("/api/matches", matchesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
