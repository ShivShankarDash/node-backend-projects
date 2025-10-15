import type { Request, Response } from "express"
import prisma from "../../lib/prisma"
import jwt, {type JwtPayload} from "jsonwebtoken"
const JWT_SECRET = Bun.env.JWT_SECRET || "demo-secret"

export const createUser = async (req : Request , res : Response) => {
    const {name, email, password} = req.body
    let token = ""
    const user = await prisma.user.create({
        data : {name, email, password, token}
    })
    if(!user) 
        return res.status(500).json({message : "Internal Server error"})
    res.status(200).json({message : "User created successfully.."})
}

export const signIn = async (req : Request, res : Response) => {
    const {email , password} = req.body
    const user = await prisma.user.findUnique({
        where : {email, password}
    })
    if(!user) 
        return res.status(404).json({message : "Could not find the user.."});
    
    const token = jwt.sign({
        id : user.id,
        name : user.name,
        email : user.email
    }, JWT_SECRET)

    const updatedUser = await prisma.user.update({
        where : {id : user.id},
        data : {token}
    })

    res.cookie("token", token)
    res.status(200).json({
        message : "User logged in successfully",
        user : {
            id : user.id, 
            email : user.email,
            name : user.name
        }
    })
}

export const invalidateToken = async (req : Request, res : Response) => {
    const { userId } = req.body
    if(!userId) return res.status(404).json({message : "Could not fetch the user"})
    const updatedUser = await prisma.user.update({
        where : {id : userId},
        data : {token : ""}
    })
    if(!updatedUser) return res.status(500).json({message : "Could not invalidate the token.." })
    res.status(200).json({message : "Invalidated token for the user"})
}

export const getAllUsers = async () => {
    const allUsers = await prisma.user.findMany();
    return allUsers
}