const mongoose = require("mongoose");

const Result = new mongoose.Schema({
    Number:Number,
    Color:String,
    Bs:String,
    Uid:String
},{timestamps:true})

const Resultmodel = mongoose.model("Resultmodel",Result)

module.exports = Resultmodel;