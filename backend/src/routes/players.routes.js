import express from "express";
import { getPlayers } from "../controllers/players.controller.js";

const router = express.Router();

router.get("/", getPlayers);

export default router;
