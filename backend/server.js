import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// import axios from "axios";
// import * as cheerio from 'cheerio';
import auditRoutes from "./routes/auditRoutes.js";

const app = express();

app.use(cors({
    origin : "*"
}
));
app.use(express.json());

app.use("/audit", auditRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is runnning on port ${PORT}`);
});