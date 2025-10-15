import express from "express"
import userRoutes from "../src/modules/User/routes"
import leaderBoardRoutes from "../src/modules/Leaderboard/routes"
import cors from "cors"
const app = express();
const port = Bun.env.PORT

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3001"
}));

app.use("/users", userRoutes)
app.use("/leaderboard", leaderBoardRoutes)
app.listen(port, ()=>{
    console.log(`Leaderboard app listening on port ${port}`)
})