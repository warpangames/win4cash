const Router = require("express");
const router = Router();
const data = require("../controller/User.controller.js")
const Gamelogic = require("../controller/logic.js")
const returnmodel = require("../models/bankdetail.model.js")
const withdrawammount = require("../models/withdrawammount.model.js");
const Usermodel = require("../models/usermodel.model.js");
const jwt = require("jsonwebtoken");

// const jwt = require("jsonwebtoken");

const path = require("path")

// const game = require("../ColorPrediction/home.html")

// user routers

// router.route("/register").post(User.UserRegister);
// router.route("/login").post(User.Userlogin);

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




router.get("/signup",(req,res)=>
    {const loginFilePath = path.join(__dirname, "../ColorPrediction/signUp.html");
res.sendFile(loginFilePath);
})
router.post("/signup",data.UserRegister);
router.get('/login', (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/login.html");
    res.sendFile(loginFilePath);
});

router.get("/withdraw",checkinguserauth,(req,res)=>{
    const loginFilePath = path.join(__dirname, "../ColorPrediction/withdraw.html");
    res.sendFile(loginFilePath);
})

router.get('/profile',checkinguserauth, (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/profile.html");
    res.sendFile(loginFilePath);
});

router.get('/GameHistory',checkinguserauth, (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/GameHistory.html");
    res.sendFile(loginFilePath);
});

router.get('/WithdrawHistory',checkinguserauth, (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/WithdrawHistory.html");
    res.sendFile(loginFilePath);
});

router.get('/Payment',checkinguserauth, (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/transaction.html");
    res.sendFile(loginFilePath);
});

router.get('/ForgetPassword' , (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/forgotPassword.html");
    res.sendFile(loginFilePath);
});

router.get('/rules' , (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/rules.html");
    res.sendFile(loginFilePath);
});


router.post("/login",data.Userlogin);

router.post("/bat",Gamelogic.UserData);

router.get("/result",Gamelogic.UserResult);

router.get("/history",data.UserHistory);
router.post("/bankdetail", data.withdraw);
router.post("/withdraw/ammount",data.WithdrawAmmount)
router.get("/withdraw/history",async (req,res) =>{
    const Incomingaccesstoken = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer","")
    // console.log(req.header("Authorization")?.replace("Bearer",""))

    if(Incomingaccesstoken){
    const Decodedtoken = jwt.verify(Incomingaccesstoken,process.env.ACCESS_TOKEN_KEY);
    const id = Decodedtoken?.id;
    const Username = Decodedtoken?.Username;

    console.log(id)
    const user = await Usermodel.findById(id)
   const data =  await withdrawammount.find({Username:user.Username}).sort({_id:-1});

    res.json(data)
    }

    else{
        res.json("token didn't get !")
    }

})

router.get("/logout",(req,res)=>{
    res.clearCookie('AccessToken');
    res.json("Logout Sucessfully !")
})

router.get("/payment/qr",data.PyamentQR)

router.post("/payment/request",data.PaymentRequest);

router.post("/withdraw/second",data.widthdraw_second);

router.post('/forgotpassword',data.forgotpassword);


module.exports = router;