import express from "express";
import axios from "axios";
const port = process.argv[3];
const url = process.argv[5] || "";
const app = express();
let responseCacheMap = new Map<string, any>();
const urlObject = new URL(url);
const path = urlObject.pathname;
console.log(path);
app.get(`${path}`, async (req, res) => {
  if (url && responseCacheMap.get(url)) {
    res.setHeader("X-Cache", "HIT");
    res.json({
      data: responseCacheMap.get(url),
    });
  } else {
    res.setHeader("X-Cache", "MISS");
    let urlResponse = await axios.get(url);
    responseCacheMap.set(url, JSON.stringify(urlResponse.data));
    res.json({
      data: urlResponse.data,
    });
  }
});

app.listen(port, () => {
  console.log(`Caching proxy server started on port ${port} for ${url}`);
});
