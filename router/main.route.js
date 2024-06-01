const Router = require("express");
const router = Router();
const data = require("../controller/User.controller.js")
const Gamelogic = require("../controller/logic.js")
const Usermodel = require("../models/usermodel.model.js")
const path = require("path")
const auth = require("../middleware/auth.middleware.js")
const jwt = require("jsonwebtoken");
const returnx = require('../models/Return.model.js')


const checkinguserauth = async (req,res,next)=>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
console.log(req.cookies,'hello')
    console.log(Incomingaccesstoken);
    if(Incomingaccesstoken){
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        // const id = Decodedtoken?.id;
       const userdata =   await Usermodel.findById(id)
       if(userdata){
        next()
       }
    //    else{
    //    res.redirect("/user/login")
    //    }
    }
    else{
        res.redirect("/user/login")
    }

}








router.get("/",checkinguserauth,(req,res)=>{
    const loginFilePath = path.join(__dirname, "../ColorPrediction/home.html");
res.sendFile(loginFilePath);
})
router.get("/Alldata",async(req,res)=>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")

    
    if(Incomingaccesstoken){
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        // const id = Decodedtoken?.id;
       const userdata =   await Usermodel.findById(id)
       res.json(userdata)
    }
    else{
        res.send("Not getting token !")
    }

})
router.get("/returnx",async (req,res)=>{
    const color = await returnx.ColorX.findOne().limit(1).sort({_id:-1});
    const number = await returnx.NumberX.findOne().limit(1).sort({_id:-1});
    const bg = await returnx.BgX.findOne().limit(1).sort({_id:-1});
    res.json({number,bg,color});
})
router.get("/bathistory",Gamelogic.slothistory)

module.exports = router;