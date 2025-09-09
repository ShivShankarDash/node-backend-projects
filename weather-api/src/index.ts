import express from 'express'
import axios from 'axios'
import cors from "cors";
import dotenv from "dotenv"
import { createClient } from 'redis';
const app = express();
dotenv.config(); 
app.use(express.json());
app.use(cors());
const PORT = 3000;
const client = createClient();
const apiKey = process.env.WEATHER_API_KEY;
(async () => {
    await client.connect();
})();
app.get("/api/v1/weather/:location/:date1/:date2", async (req,res)=>{
    const { location, date1, date2 } = req.params;
    let weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}`;
    if (date1) {
        weatherUrl += `/${date1}`;
        if (date2) {
            weatherUrl += `/${date2}`;
        }
    }
    weatherUrl += `?key=${apiKey}`;
    try{
        const redisCache = await client.get(location);
        if(!redisCache){
            const weatherData = await axios.get(weatherUrl);
            client.set(location, JSON.stringify(weatherData.data));
            res.status(200).send(weatherData.data);
        } 
        else{
            console.log(`Cache hit with the key${location}`)
            res.status(200).send(JSON.parse(redisCache));
        }
    }catch(err){
        console.log(err);
    }
})


app.listen(PORT, ()=>{
    console.log(`Server listening on port${PORT}`)
})



