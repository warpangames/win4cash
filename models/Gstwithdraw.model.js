const mongoose = require("mongoose");

const GstWithdrawRequest = new mongoose.Schema({

    Username:{
        type:String
    },
    Trancation_id:{
        type:String,
        
    },
    Gst:{
        type:Number,
    },
    Uid:{
        type:String,
        
    },
   
},{timestamps:true})

const Gstwithdrawrequest = mongoose.model("Gstwithdrawrequest",GstWithdrawRequest)
module.exports = Gstwithdrawrequest;