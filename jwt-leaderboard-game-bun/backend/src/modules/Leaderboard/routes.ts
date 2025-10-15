import { Router } from "express";
import { leaderboard } from "./controller";
const router = Router()

router.get("/", leaderboard)

export default router