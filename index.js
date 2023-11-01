require('dotenv').config();
const express = require("express");
//const router = require("express-promise-router")();
const cookieParser = require ("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const indexRoute = require("./src/routes/index.router");
const passcodesRoute = require('./src/routes/passcodes.router');

const app = express();
const { PORT, API_ENV, CORS_URL1, DATABASE_ENV } = process.env;

if( API_ENV === "Production") {
    console.log(`---\n🔄 Production Server Loading...\n---`);
} else if( API_ENV === "Staging") {
    console.log(`---\n🔄 Staging Server Loading...\n---`);
} else {
    console.log(`---\n🔄 Development Server Loading...\n---`);
}

app.use(cors(CORS_URL1));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.options("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

/** Routes */
app.use("/api", indexRoute);
app.use('/api', passcodesRoute);

const portInt = parseInt(PORT) || 7000;

app.listen(portInt, () => {
    if( DATABASE_ENV === "Production") {
        console.log(
            `🏃‍♀️ Production Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    } else if( DATABASE_ENV === "Staging") {
        console.log(
            `🏃‍♀️ Staging Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    } else {
        console.log(
            `🏃‍♀️ Development Server Running Here 👉 http://localhost:${portInt}\n---`
        );
    }
});
