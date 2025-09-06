import express  from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import path from "path";
import cors from "cors";
const app = express();
app.use(bodyParser.json());
app.use(cors());

interface Blog {
    id : number,
    title : string, 
    date : Date,
    content : string
}

const dirPath = path.join(__dirname, "blogs");

app.get("/home", (req,res)=>{
    const files = fs.readdirSync(dirPath)
    let savedBlogs : Blog[] = [];
    for(const file of files){
        const blogFilePath = path.join(dirPath, file);
        if(fs.statSync(blogFilePath).isFile()){
            const blog = JSON.parse(fs.readFileSync(blogFilePath,'utf-8'))
            savedBlogs.push(blog);
        }
    }
    res.status(200).json(savedBlogs);
})

app.post("/new", (req,res)=>{
    const id : number =  Math.floor(Math.random() * 1000);
    const title : string = req.body.title;
    const datePublished : Date = req.body.date;
    const content : string = req.body.content;
    fs.mkdirSync(dirPath, {recursive : true});
    // if(!fs.readdirSync(dirPath)){
    //     fs.mkdirSync(dirPath, {recursive : true});
    // }
    const blogPath = path.join(dirPath, `blog_${id}.json`);
    const blog = {
        id, 
        title, 
        date : datePublished,
        content
    }
    writeFile(blogPath,blog);
    res.status(200).json("Blog created successfully");
})

app.put("/edit/:id", (req,res)=>{
    const idToEdit = Number(req.params.id);
    const title : string = req.body.title;
    const datePublished : Date = req.body.date;
    const content : string = req.body.content;
    const blogPath = path.join(dirPath,`blog_${idToEdit}.json`);
    const blog = {
        id : idToEdit, 
        title, 
        date : datePublished,
        content
    }
    writeFile(blogPath,blog);
    res.status(200).json("Blog edited successfully");
})

app.delete("/delete/:id", (req,res)=>{
    const idToDelete = Number(req.params.id);
    const filePathToDelete = path.join(dirPath, `blog_${idToDelete}.json`);
    if(fs.existsSync(filePathToDelete)){
        fs.unlinkSync(filePathToDelete);
        res.status(200).send("File deleted successfully");
    }
    else{
        res.status(404).send("File doesn't exist");
    }
})

app.get("/admin", (req,res)=>{
    const files = fs.readdirSync(dirPath, 'utf-8')
    let savedBlogs : Blog[] = [];
    for(const file of files){
        const blogFilePath = path.join(dirPath, file);
        if(fs.statSync(blogFilePath).isFile()){
            const blog = JSON.parse(fs.readFileSync(blogFilePath,'utf-8'))
            savedBlogs.push(blog);
        }
    }
    res.status(200).json(savedBlogs);
})

app.get("/view/:id", (req,res)=>{
     const idToView = Number(req.params.id);
     const filePathToCheck = path.join(dirPath, `blog_${idToView}.json`);
     if(fs.existsSync(filePathToCheck)){
        const blog = JSON.parse(fs.readFileSync(filePathToCheck, 'utf-8'));
        res.status(200).json(blog);
     }
})

function writeFile(blogPath : string, blog : Blog){
    fs.writeFile(blogPath, JSON.stringify(blog), (err : any)=>{
        if(err) console.log(err);
    })
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`✅ Server listening on port ${PORT}`);
})