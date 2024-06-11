const mongoose = require("mongoose");

const guest = new mongoose.Schema({
    Uid :{
        type:String
    },
    wallet:{
        type:Number,
        default:100
    }
},{timestamps:true})

const Guest = mongoose.model("guestdata",guest);

module.exports = Guest;
