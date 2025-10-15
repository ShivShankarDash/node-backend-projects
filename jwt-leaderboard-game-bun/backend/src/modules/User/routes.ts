import { Router } from "express";
import { createUser, signIn, invalidateToken, getAllUsers } from "./controller";
const router = Router()

router.post("/", createUser)
router.post("/signin", signIn)
router.post("/invalidate", invalidateToken)
router.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
})

export default router