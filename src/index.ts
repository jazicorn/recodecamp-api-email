'use strict';
/* eslint-disable  @typescript-eslint/no-explicit-any */
const express = require("express");
//const router = require("express-promise-router")();
const cookieParser = require ("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv =  require("dotenv");
const cors = require("cors");

const indexRoute = require("./routes/index.router");
const passcodesRoute = require('./routes/passcodes.router');

const app = express();
require('dotenv').config();
const { PORT, API_ENV, CORS_URL1, DATABASE_URL, DATABASE_ENV } = process.env;

if( API_ENV === "Production") {
    console.log(`🔄 Production Server Loading...\n---`);
} else if( API_ENV === "Staging") {
    console.log(`🔄 Staging Server Loading...\n---`);
} else {
    console.log(`🔄 Development Server Loading...\n---`);
}

var corsOptions = {
  origin: process.env.CORS_URL1
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true,origin: corsOptions }));
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", `${corsOptions}`);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", `${corsOptions}`);
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

/** Routes */
app.use("/api", indexRoute);
app.use('/api', passcodesRoute);

const portInt = PORT || 8000;

app.listen(portInt, "0.0.0.0", (): void => {
    if( DATABASE_ENV === "Production") {
        console.log(
            `🏃🏿‍♀️ Production Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    } else if( DATABASE_ENV === "Staging") {
        console.log(
            `🏃🏿‍♀️ Staging Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    } else {
        console.log(
            `🏃🏿‍♀️ Development Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    }
});
