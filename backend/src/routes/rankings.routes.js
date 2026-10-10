import express from "express";
import { getRankings } from "../controllers/rankings.controller.js";

const router = express.Router();

router.get("/", getRankings);

export default router;
