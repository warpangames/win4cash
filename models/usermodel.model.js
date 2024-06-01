const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")


const UserRegister = new mongoose.Schema({
   
    Name:{
        type:String,
        requried:true,
        trim:true,

    },
    Phoneno:{
        type:Number,
        requried:true,
        trim:true
    },
    Username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        
    },
    Password:{
        type:String,
        required:true,
        trim:true
    },
    wallet:{
        type:Number,
        trim:true,
        default:0,
    },
    bankdetail:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


UserRegister.methods.genrateAcesstoken = function (){
return jwt.sign({
    id : this._id,
    Name:this.Name,
    Username:this.Username
},process.env.ACCESS_TOKEN_KEY)
}

const Usermodel  = mongoose.model("UserData",UserRegister)

module.exports = Usermodel