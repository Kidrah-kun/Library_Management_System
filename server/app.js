const express = require("express");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const {connectDB} = require("./database/db");
config({ path: "./config/config.env" });

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

module.exports = { app };