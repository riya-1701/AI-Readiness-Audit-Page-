import express from "express";
import {analyzeURL} from "../controllers/analyzeURL.js"


//Post - /api/audit
const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET route working");
  res.send("GET API is working");
});

router.post("/", async(req,res) =>{
    console.log("POST API is WORKING");

//basic validatiion
const {url}=req.body
if(!url){
    return res.status(400).json({success: false,message: "URL is required or INvalid URL"});
}
try{
    const result = await analyzeURL(url);
    console.log(url);
    return res.json(result);
}catch(err){
    return res.status(500).json({error: err.message});
}
});

export default router;