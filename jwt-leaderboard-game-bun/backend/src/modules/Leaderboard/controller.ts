import type { Request, Response } from "express"
import { getAllUsers } from "../User/controller";
export const leaderboard = async (req : Request, res : Response) => {
    const allUsers = await getAllUsers();
    const leaderBoardRanking = allUsers.map(user => ({
        name : user.name,
        tokenLength : user?.token.length ?? 0
    })).sort((a, b)=> b.tokenLength - a.tokenLength)
    res.json(leaderBoardRanking)
}