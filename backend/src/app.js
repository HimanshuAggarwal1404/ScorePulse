import express from "express";
import cors from "cors";

import matchesRoutes from "./routes/matches.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import inningsRoutes from "./routes/innings.routes.js";
import playersRoutes from "./routes/players.routes.js";
import ballsRoutes from "./routes/balls.routes.js";
import scorecardRoutes from "./routes/scorecard.routes.js";
import commentaryRoutes from "./routes/commentary.routes.js"
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/matches", matchesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/innings", inningsRoutes);
app.use("/api/balls", ballsRoutes);
app.use("/api/matches", scorecardRoutes); 
app.use("/api", commentaryRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
