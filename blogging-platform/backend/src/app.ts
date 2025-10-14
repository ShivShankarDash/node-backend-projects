import express from "express"
import blogRoutes from "./modules/Blog/routes"
import tagRoutes from "./modules/Tag/routes"
import userRoutes from "./modules/User/routes"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware should be applied first
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001"
}));

// Routes should come after middleware
app.use("/tags", tagRoutes)
app.use("/blogs", blogRoutes)
app.use("/users", userRoutes)

app.listen(Bun.env.PORT, ()=>{
    console.log(`Blog App listening on port ${Bun.env.PORT}`);
})
