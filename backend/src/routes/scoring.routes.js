import express from "express";
import * as c from "../controllers/scoring.controller.js";

const router = express.Router();

router.use(c.requireScorer);

// reference data
router.get("/teams", c.getTeamsWithSquads);
router.get("/sources", c.getSources);
router.get("/matches", c.getConsoleMatches);

// replays of real Cricsheet matches
router.get("/replays", c.getReplays);
router.post("/replays", c.postReplay);
router.post("/replays/:matchId/pause", c.pauseReplay);
router.post("/replays/:matchId/resume", c.resumeReplay);

// match setup
router.post("/matches", c.postMatch);
router.patch("/matches/:matchId", c.patchMatch);
router.delete("/matches/:matchId", c.deleteMatch);
router.put("/matches/:matchId/squads/:teamId", c.putSquad);
router.post("/matches/:matchId/players", c.postPlayer);
router.post("/matches/:matchId/toss", c.postToss);

// ball by ball
router.post("/matches/:matchId/innings", c.postInnings);
router.post("/matches/:matchId/innings/end", c.endInnings);
router.patch("/matches/:matchId/innings/current", c.reviseInnings);
router.put("/matches/:matchId/crease", c.putCrease);
router.post("/matches/:matchId/balls", c.postBall);
router.delete("/matches/:matchId/balls/last", c.undoBall);
router.post("/matches/:matchId/status", c.postStatus);
router.post("/matches/:matchId/result", c.postResult);
router.put("/matches/:matchId/player-of-match", c.putPlayerOfMatch);

export default router;
