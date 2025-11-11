import express from "express"
import { PrismaClient } from "./generated/prisma/client";
import remarkHtml from 'remark-html'
// import remarkParse from 'remark-parse'
// import {read} from 'to-vfile'
import {unified} from 'unified'
import cors from "cors";
import * as gramma from "gramma";
import { marked } from "marked";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001"
}));

app.post("/api/v1/markdown/note-upload", async (req, res)=>{
 const [title, content] = req.body
 const saved = await prisma.markDownFile.create({
    data : {title, content}
 })
 if(saved){
    res.status(201).json(saved.id);
 }
})

app.post("/api/v1/check-grammar", async (req, res)=>{
 try {
   const { content } = req.body;
   
   if (!content) {
     return res.status(400).json({ message: "Content is required" });
   }

   // Check grammar on the markdown content using gramma
   const result = await gramma.check(content);
   
   // Ensure result is valid and has expected structure
   const matches = Array.isArray(result?.matches) ? result.matches : [];
   
   // Return the grammar check results
   res.json({
     originalText: content,
     matches: matches,
     language: result?.language || { name: "Unknown", code: "unknown" },
     software: result?.software || { name: "LanguageTool" },
     summary: {
       totalIssues: matches.length,
       hasErrors: matches.length > 0
     }
   });
   
 } catch (err) {
   console.error('Grammar check error:', err);
   res.status(500).json({ 
     message: "Grammar check failed", 
     error: err instanceof Error ? err.message : "Unknown error"
   });
 }
})

app.post("/api/v1/markdown/html-renderer", async (req, res)=>{
 try {
   const { content } = req.body;
   
   if (!content) {
     return res.status(400).json({ message: "Content is required" });
   }

   // Convert markdown to HTML using marked
   const html = marked(content);
   
   res.json({
     originalMarkdown: content,
     renderedHtml: html,
     success: true
   });
   
 } catch (err) {
   console.error('HTML rendering error:', err);
   res.status(500).json({ 
     message: "HTML rendering failed", 
     error: err instanceof Error ? err.message : "Unknown error"
   });
 }
})

app.get("/api/v1/markdown/all", async(req, res)=> {
 try {
   const allFiles = await prisma.markDownFile.findMany({
     select: {
       id: true,
       title: true,
       content: true,
       createdAt: true,
       updatedAt: true
     },
     orderBy: {
       createdAt: 'desc'
     }
   });
   res.json(allFiles);
 } catch (err) {
   console.error(err);
   res.status(500).json({ message: "Failed to fetch files" });
 }
})

app.listen(PORT, ()=>{
    console.log(`Note api started on port ${PORT}`);
})
