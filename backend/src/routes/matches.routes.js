import express from "express";
import { getRecentMatches,getMatchScorecard } from "../controllers/matches.controller.js";

const router = express.Router();

router.get("/recent", getRecentMatches);
router.get("/:matchId/scorecard", getMatchScorecard);

export default router;
