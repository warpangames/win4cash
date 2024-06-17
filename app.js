const express = require("express");
const app = express();
const path = require("path")
const cors  = require('cors');

const cookieparser = require("cookie-parser");

app.use(cookieparser())

const allowedOrigins = [ 'https:/win4cash.in', 'https:/admin.win4cash.in'];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // Additional CORS settings if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions));

// const game = require("../ColorPrediction/")

const Userroute = require("./router/user.route.js")
const Adminroute = require("./router/admin.route.js")
const main = require("./router/main.route.js")
// app.use(express.static(path.join(__dirname,"Public")));
app.use(express.static(__dirname+"/Public"));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use("/user", Userroute)
app.use("/",main);
app.use("/admin",Adminroute)



module.exports = app;