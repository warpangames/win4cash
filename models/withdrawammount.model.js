const mongoose = require("mongoose");

const WithdrawRequest = new mongoose.Schema({

    Username:{
        type:String
    },
    Requestedammount:{
        type:Number,
        
    },
    Walletammount:{
        type:Number
    },
    satuts:{
        type:String,
        default:"Pending"
    }
   
},{timestamps:true})

const Withdraw = mongoose.model("withdrawrequest",WithdrawRequest)
module.exports = Withdraw;