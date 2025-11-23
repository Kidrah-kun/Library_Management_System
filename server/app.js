const express = require("express");
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const {connectDB} = require("./database/db");
config({ path: "./config/config.env" });
const {errorMiddleware} = require("./middlewares/errorMiddlewares.js");
const authRouter = require("./routes/authRouter.js");
const bookRouter = require("./routes/bookRouter.js")

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth",authRouter);
// here /api/v1/auth is a static uri , ex- authRouter = http://localhost:4000, 
// therefore final result will be http://localhost:4000/api/v1/auth
app.use("/api/v1/books",bookRouter);

connectDB();

app.use(errorMiddleware);
module.exports = { app };