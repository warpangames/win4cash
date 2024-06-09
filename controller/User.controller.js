const { options } = require("../app.js");
const mongoose = require("mongoose"); // You missed assigning mongoose to a variable
const usermodel = require("../models/usermodel.model.js");
const jwt = require("jsonwebtoken")
require("../db/connect.js");
const auth = require("../middleware/auth.middleware.js");
const Usermodel = require("../models/usermodel.model.js");
const Batmodel = require("../models/Batmodel.model.js");
const Withdraw = require("../models/bankdetail.model.js")
const Withdrawammount = require("../models/withdrawammount.model.js");
const Paymentmodel = require('../models/payment.model.js');
const QRmodel=  require('../models/Qrgateway.model.js');
const Gstmodel = require("../models/Gstwithdraw.model.js");

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
    // const Blance = user.wallet;
    // user.wallet -= req.body.Ammount;
    user.bankdetail = true;

       await Withdraw.create({
        Username:user.Username,
       
        Accountno:req.body.Accountno,
        IFSC:req.body.IFSC,
        bankname:req.body.bankname,
        fullname:req.body.fullname,
        phoneno:req.body.phoneno


       })
        console.log("")
       await user.save().then(()=>{
        console.log("ammount debited sucessfully !")
       })
       res.json("your request sent sucessfully !")
    }
    else{
        res.json("token didn't get !")
    }

}

const WithdrawAmmount = async (req,res) =>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
    // console.log(req.header("Authorization")?.replace("Bearer",""))

    if(Incomingaccesstoken){
    const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
    const id = Decodedtoken?.id;
    const Username = Decodedtoken?.Username;

    console.log(id)
    const user = await Usermodel.findById(id)
    const Blance = user.wallet;
   
    console.log(typeof req.body)

    const data = await Withdrawammount.create({
        Requestedammount:parseFloat(req.body.reqammount),
        Username:user.Username,
        Walletammount:Blance,
        Uid :req.body.uniqueId

    })
    console.log(data)
    // user.wallet -= parseFloat(req.body.reqammount);
    await user.save()
    res.json("your request sucessfully sended !")
    }

    else{
        res.json("token didn't get !")
    }
}

    const widthdraw_second = async(req,res) =>{
        const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
        // console.log(req.header("Authorization")?.replace("Bearer",""))
    
        if(Incomingaccesstoken){
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        const Username = Decodedtoken?.Username;
    
        console.log(id)
        const user = await Usermodel.findById(id)
         const withdraw = await Withdrawammount.updateOne({Uid:req.body.uniqueId},{$set:{satuts:"accepted"}})
    
    
         await Withdrawammount.deleteMany({ status: "Pending", Username: Username });
    
       const data =   await Gstmodel.create({
            Username:user.Username,
            Trancation_id:req.body.Trancation_id,
            Gst:req.body.gstammount,
            Uid :req.body.uniqueId
        })
        console.log(data)
        res.json("sucessfully !")
        }
        else{
            res.json("token didn't get");
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

const PaymentRequest = async (req,res) =>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
    try {
        const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
        const id = Decodedtoken?.id;
        const Username = Decodedtoken?.Username;
        await Paymentmodel.create({
            Username:Username,
            Ammount:req.body.ammount,
            Transcation_id:req.body.Transcation_id
        })
               
        
            res.json("Request sended sucessfully !");
    } catch (error) {
        console.log(error)
        
    }

}

const PyamentQR = async(req,res) =>{
    const QR = await QRmodel.findOne().sort({_id:-1})
    res.json(QR)

 }

module.exports = {
    UserRegister,
    Userlogin,
    UserHistory,
    withdraw,
    WithdrawAmmount,
    PaymentRequest,
    PyamentQR,
    widthdraw_second
};
