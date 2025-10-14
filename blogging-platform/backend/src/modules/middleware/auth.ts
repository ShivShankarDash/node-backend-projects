import type {Request, Response, NextFunction} from "express"

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
import jwt, { type JwtPayload } from "jsonwebtoken";
const JWT_SECRET = Bun.env.JWT_SECRET;
export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const token = req.cookies.token
    if(!token) return res.status(401).send("Unauthorized")
    const decoded = jwt.verify(token, JWT_SECRET || "default_secret") as JwtPayload
    req.user = decoded;
    next();
}