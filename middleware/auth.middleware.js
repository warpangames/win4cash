
const jwt = require("jsonwebtoken")
const Usermodel = require("../models/usermodel.model.js")

const auth = async (req,res,next)=>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
     console.log(Incomingaccesstoken,'k hal h');
     console.log(req.cookies)
    
    if(Incomingaccesstoken){
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        // const id = Decodedtoken?.id;
       const userdata =   await Usermodel.findById(id)
       if(userdata){
        req.user= userdata;
        next()
       }
       else{
        res.send("token doesn't match ! ")
       }
    }
    else{
        res.send("Not getting token !")
    }
}

module.exports = auth