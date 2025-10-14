import { Router } from "express";
import { createUser, getAllUsers, getUserById, userSignIn, signOut, getCurrentUser } from "./controller";
import { authMiddleware } from "../middleware/auth";

const router = Router()

router.get("/", getAllUsers)
router.get("/me", authMiddleware, getCurrentUser)
router.get("/:id", getUserById)
router.post("/signup", createUser)
router.post("/signin", userSignIn)
router.post("/signout", signOut)

export default router;