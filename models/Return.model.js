const mongoose = require("mongoose");

const Batcolor = new mongoose.Schema({
    color:{
        type:Number,
        default:2
        
    }
},{timestamps:true})

const BatNumber = new mongoose.Schema({
    "0":{
        type:Number,
        default:1,
    },
    "1":{
        type:Number,
        default:2,
    },
    "2":{
        type:Number,
        default:3,
    },
    "3":{
        type:Number,
        default:4,
    },
    "4":{
        type:Number,
        default:5,
    },
    "5":{
        type:Number,
        default:6,
    },
    "6":{
        type:Number,
        default:7,
    },
    "7":{
        type:Number,
        default:8,
    },
    "8":{
        type:Number,
        default:9,
    },
    "9":{
        type:Number,
        default:10,
    }

},{timestamps:true})

const BatBg = new mongoose.Schema({
    big:{
        type:Number,
        default:2
    },
    small:{
        type:Number,
        default:2
    }
},{timestamps:true})
const ColorX = mongoose.model("ColorX",Batcolor);
const NumberX = mongoose.model("NumberX",BatNumber)
const BgX = mongoose.model("BgX",BatBg)

module.exports = { ColorX,NumberX,BgX}