require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const connect = require("./db/db");
const cors = require('cors');
connect();
app.use(cors());
const cron = require("node-cron");
const axios = require("axios");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({}));

cron.schedule("*/5 * * * *", async () => {
    try {
        console.log("⏰ Cron: Pinging server...");
        await axios.get("https://hm053-tech-titans-2-0.onrender.com/");
    } catch (err) {
        console.log("Cron error:", err.message);
    }
});

app.get("/" , async(req,res)=>{
    res.status(200).json("server is running fine build by harshu");
})

const rawMaterial = require("./route/Rawmaterial.route");
app.use("/api/crud/rawmaterial" , rawMaterial );

const product = require("./route/Product.route");
app.use("/api/crud/product" , product );

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log('server is running on port 3000 ~ built by harshu');
})
//testing mode after udpating repo 