import express from "express";
import {
  getCommentary,
  getMatch,
  getMatches,
  getRecentMatches,
  getScorecard,
  streamMatch,
  streamMatchList,
} from "../controllers/live.controller.js";

const router = express.Router();

router.get("/", getMatches);
router.get("/recent", getRecentMatches);
router.get("/stream", streamMatchList);
router.get("/:matchId", getMatch);
router.get("/:matchId/scorecard", getScorecard);
router.get("/:matchId/commentary", getCommentary);
router.get("/:matchId/stream", streamMatch);

export default router;
