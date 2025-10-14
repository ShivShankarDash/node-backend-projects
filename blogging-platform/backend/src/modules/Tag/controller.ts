import type { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getAllTags = async (req: Request, res: Response) => {
    try {
        const allTags = await prisma.tag.findMany({
            orderBy: { title: 'asc' }
        });
        res.status(200).json(allTags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: "Could not fetch tags" });
    }
}

export const createTag = async (req : Request, res : Response) => {
    const { title } = req.body
    const checkPreviousTag = await prisma.tag.findUnique({
        where : {title}
    })
    if(checkPreviousTag) return res.status(409).json({message : "Tag with the same title already exists", tag: checkPreviousTag});
    const newTag = await prisma.tag.create({
        data : {title}
    })
    if(newTag) return res.status(201).json({message : "New tag created", tag: newTag});
    res.status(500).json({ message : "Tag could not be created"});
}

export const getTagByTitle = async (req : Request, res : Response) => {
    const tagTitle = req.params.title;
    const foundTag = await prisma.tag.findUnique({
        where : {title : tagTitle}
    })
    if(!foundTag) return res.status(404).json({message : "Tag not found"});
    res.status(200).json(foundTag);
}