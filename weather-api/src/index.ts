import express from 'express'
import axios from 'axios'
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;
const apiKey = process.env.WEATHER_API_KEY;
app.get("/api/v1/weather/:location/:date1/:date2", async (req,res)=>{
    const location : string = req.params.location
    const date1 = req.params.date1
    const date2 = req.params.date2 ? req.params.date2 : ""
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date1}/${date2}?key=${apiKey}`  
    const weatherData = await axios.get(weatherUrl);
    res.status(200).send(weatherData.data);
})


app.listen(PORT, ()=>{
    console.log(`Server listening on port${PORT}`)
})



