import express from "express";
import { getPlayers, getPlayerById } from "../controllers/players.controller.js";

const router = express.Router();

router.get("/", getPlayers);
router.get("/:id", getPlayerById);

export default router;
