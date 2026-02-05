import express from "express";
import { getCommentary } from "../controllers/commentary.controller.js";

const router = express.Router();

router.get("/matches/:matchId/commentary", getCommentary);

export default router;
