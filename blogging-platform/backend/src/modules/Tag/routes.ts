import { Router } from "express";
import { createTag, getTagByTitle, getAllTags } from "./controller";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.get("/", authMiddleware, getAllTags)
router.post("/new", authMiddleware, createTag)
router.get("/:title", authMiddleware, getTagByTitle)

export default router;