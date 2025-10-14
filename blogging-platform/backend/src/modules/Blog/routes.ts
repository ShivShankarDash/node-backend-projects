import { Router } from "express";
import { createBlog, getAllBlogs, getBlogById } from "./controller";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.get("/", authMiddleware,getAllBlogs)
router.get("/:id", authMiddleware, getBlogById)
router.post("/new", authMiddleware, createBlog)

export default router;