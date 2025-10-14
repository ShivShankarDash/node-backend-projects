import prisma from "../../lib/prisma";
import type { Request, Response } from "express";

export const getAllBlogs = async (req: Request, res: Response) => {
  const allBlogs = await prisma.blog.findMany({
    include: {
      tags: true,
      author: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  if (!allBlogs)
    return res.status(500).json({ message: "Could not load the blogs.." });
  res.status(200).json(allBlogs);
};

export const getBlogById = async (req : Request, res: Response) => {
    const id = Number(req.params.id);
    const blog = await prisma.blog.findUnique({
        where : {id}
    })
    if(!blog) 
        return res.status(500).json({message : "Blog could not be found.."})
    res.status(200).json(blog);
}

export const createBlog = async (req : Request, res : Response) => {
    const {title, content, category, tagIds} = req.body;
    if (!req.user) {
        return res.status(400).json({ message: "User information is missing." });
    }
    const authorId = req.user.id;
    
    try {
        const blog = await prisma.blog.create({
            data: {
                title, 
                content, 
                authorId, 
                category,
                tags: {
                    connect: tagIds?.map((id: number) => ({ id })) || []
                }
            },
            include: {
                tags: true,
                author: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
        
        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({message : "Blog could not be created"});
    }
}