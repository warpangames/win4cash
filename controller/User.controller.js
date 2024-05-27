const { options } = require("../app.js");
const mongoose = require("mongoose"); // You missed assigning mongoose to a variable
const usermodel = require("../models/usermodel.model.js");
const jwt = require("jsonwebtoken")
require("../db/connect.js");
const auth = require("../middleware/auth.middleware.js");
const Usermodel = require("../models/usermodel.model.js");
const Batmodel = require("../models/Batmodel.model.js");

const UserRegister = async (req, res) => {
    try {
        const checkingusername = await usermodel.findOne({Username:req.body.Username})

        if ( ! checkingusername) {
            console.log(req.body);
            try {
                await usermodel.create({
                    Name: req.body.Name,
                    Password: req.body.Password,
                    Username: req.body.Username,
                    Phoneno: req.body.Phoneno
                });
                res.json("You are successfully registered!");
            } catch (error) {
                console.log("Error in register user", error);
                res.status(500).json({ error: "Internal server error" });
            }
        } else {
            res.json("Username already exists! Choose another username");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Userlogin = async (req, res) => {
    console.log(req.body)
    try {
        const AuthByUsername = await usermodel.findOne({ Username: req.body.Username });
        if (AuthByUsername) {
            const AuthByPassword = await (AuthByUsername.Password === req.body.Password);
            if (AuthByPassword) {
               let options = {
                    httpOnly: true,
                    secure: true,
                    path: "/" // Corrected to lowercase "path"
                };
                const AccessToken = AuthByUsername.genrateAcesstoken();
                console.log(AccessToken)
                res.cookie("AccessToken", AccessToken, options).json("You are successfully logged in!");
            } else {
                res.json("Password is wrong!");
            }
        } else {
            res.json("Username is wrong!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const withdraw = async (req,res)=>{

    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
    // console.log(req.header("Authorization")?.replace("Bearer",""))

    if(Incomingaccesstoken){
    const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
    const id = Decodedtoken?.id;
    const Username = Decodedtoken?.Username;

    console.log(id)
    const user = await Usermodel.findById(id)
    const Blance = user.wallet;
    user.wallet -= req.body.Ammount;

       await user.save().then(()=>{
        console.log("ammount debited sucessfully !")
       })

       res.json({
        reqammount:req.body.Ammount,
        Blance:Blance,
       })
    }
    else{
        res.json("token didn't get !")
    }

}

const UserHistory = async (req, res) => {
    
        const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
    // console.log(req.header("Authorization")?.replace("Bearer",""))

    try {
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        const Username = Decodedtoken?.Username;
    
            const data = await Batmodel.find({ Username: Username }).sort({_id:-1});
               
            //   console.log(data)
            res.json(data);
    } catch (error) {
        console.log(error)
        
    }
    
};

module.exports = {
    UserRegister,
    Userlogin,
    UserHistory
};