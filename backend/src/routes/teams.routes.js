import express from "express";
import { getAllTeams } from "../controllers/teams.controller.js";
import { getTeamPlayers } from "../controllers/teamPlayers.controller.js";

const router = express.Router();

router.get("/", getAllTeams);
router.get("/:teamId/players", getTeamPlayers);

export default router;
