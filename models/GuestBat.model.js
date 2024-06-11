const mongoose = require("mongoose");

const Bat = new mongoose.Schema({
    Username:{
        type:String,
        trim:true
    },
    Batoption:{
        type:String,
        trim:true
    },
    Ammount:{
        type:Number,
        trim:true
    },
    choose:{
        type:String,
        trim:true
    },
    Uid:{
        type:String,
        trim:true
    },
    status:{
        type:String,

    }

},{timestamps:true})

const Batmodel = mongoose.model("guestBatmodel",Bat);

module.exports = Batmodel;