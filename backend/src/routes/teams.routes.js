import express from "express";
import { getTeams } from "../controllers/teams.controller.js";

const router = express.Router();

router.get("/", getTeams);

export default router;
