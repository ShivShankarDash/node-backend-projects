import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../../lib/prisma";
const JWT_SECRET = Bun.env.JWT_SECRET;

export const getAllUsers = async (req : Request, res : Response) => {
    const allUsers = await prisma.user.findMany({
        include : {blogs : true}
    })
    res.json(allUsers);
}

export const getUserById = async (req : Request, res : Response) => {
    const id = Number(req.params.id);
    const specificUser = await prisma.user.findUnique({
        where : {id},
        include : {blogs : true}
    })
    if(!specificUser) return res.status(404).json({ message : "User not found"});
    res.status(200).json(specificUser);
}

export const createUser = async (req : Request, res : Response) => {
    const { name, email, password } = req.body;
    const userExists = await prisma.user.findUnique({
        where : {email}
    })
    if(userExists) return res.status(409).send("User already exists..");
    const createdUser = await prisma.user.create({
        data : {name, email, password}
    })
    if(!createdUser) return res.status(500).json({message : "User could not be created"});
    res.status(201).json({message : "User successfully created"});
}

export const userSignIn = async (req : Request, res : Response) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where : {email, password}
    })
    if(!user)
        return res.status(404).json({message: "Invalid email or password"});
    
    const token = jwt.sign({
        id : user.id,
        name : user.name,
        email : user.email
    }, JWT_SECRET || "default_secret")
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
    });
    
    res.status(200).json({
        message: "Logged in successfully",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}

export const signOut = async (req : Request, res : Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({message : "Logged out successfully"});
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // req.user is set by authMiddleware
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true } // Don't return password
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}