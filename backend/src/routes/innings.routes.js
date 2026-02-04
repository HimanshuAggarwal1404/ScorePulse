import express from "express";
import { getInningsByMatch } from "../controllers/innings.controller.js";

const router = express.Router();

router.get("/:matchId", getInningsByMatch);

export default router;
