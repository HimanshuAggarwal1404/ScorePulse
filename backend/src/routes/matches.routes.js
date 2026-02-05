import express from "express";
import {
  getRecentMatches,
  getMatchScorecard,
  getMatchCommentary,
} from "../controllers/matches.controller.js";

const router = express.Router();

router.get("/recent", getRecentMatches);
router.get("/:id/scorecard", getMatchScorecard);
router.get("/:id/commentary", getMatchCommentary);

export default router;
