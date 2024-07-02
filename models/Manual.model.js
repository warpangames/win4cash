const mongoose = require("mongoose");

const Manual = new mongoose.Schema({

    per:{
        type:String
    },
  
    whatsappno:{
        type:String
    }

},{timestamp:true})

const manual = mongoose.model("Manualdetail",Manual)
module.exports = manual;