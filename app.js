const express = require("express");
const app = express();
const path = require("path")
const cookieparser = require("cookie-parser");

app.use(cookieparser())
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