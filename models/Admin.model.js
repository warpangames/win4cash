const mongoose = require("mongoose");


const Admin = new mongoose.Schema({
    Username:{
        type:String,
        required:true,
        trim:true,
        tolowercase:true,

    },
    Password:{
        type:String,
        required:true,
        trim:true
    },
   Auto:{
    type:Boolean,
    default:true
   }

},{timestamps:true})

const AdminData = mongoose.model("AdminData",Admin);



module.exports = Admin;
