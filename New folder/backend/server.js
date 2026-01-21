require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const connect = require("./db/db");
const cors = require('cors');
connect();
app.use(cors());




const port = process.env.PORT;
app.listen(port, ()=>{
    console.log('server is running on port 3000 ~ built by harshu');
})