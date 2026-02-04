import express from "express";
import { getBallsByInnings } from "../controllers/balls.controller.js";

const router = express.Router();

router.get("/:inningsId", getBallsByInnings);

export default router;
