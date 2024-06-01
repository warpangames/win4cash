const mongoose = require("mongoose");

const WithdrawRequest = new mongoose.Schema({

    Username:{
        type:String
    },
  
    
    Accountno:{
        type:String
    },
    IFSC:{
        type:String,
    },
    bankname:{
        type:String
    },
    fullname:{
        type:String
    },
    phoneno:{
        type:String
    }

},{timestamp:true})

const Withdraw = mongoose.model("bankdetail",WithdrawRequest)
module.exports = Withdraw;