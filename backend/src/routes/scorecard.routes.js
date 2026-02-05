import express from "express";
import { getScorecard } from "../controllers/scorecard.controller.js";

const router = express.Router();

router.get("/:matchId/scorecard", getScorecard);

export default router;
