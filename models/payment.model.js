const mongoose = require("mongoose");

const PaymentRequest = new mongoose.Schema({

    Username:{
        type:String
    },
  
    
    Ammount:{
        type:String
    },
    Transcation_id:{
        type:String,
    },
    stauts:{
        type :String,
        default:"Pending"
    }
},{timestamps:true})

const payment = mongoose.model("payment",PaymentRequest)
module.exports = payment;