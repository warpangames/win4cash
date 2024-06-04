const Router = require("express");
const router = Router();
const data = require("../controller/User.controller.js")
const Gamelogic = require("../controller/logic.js")
const returnmodel = require("../models/bankdetail.model.js")
const withdrawammount = require("../models/withdrawammount.model.js");
const Usermodel = require("../models/usermodel.model.js")

const path = require("path")

// const game = require("../ColorPrediction/home.html")

// user routers

// router.route("/register").post(User.UserRegister);
// router.route("/login").post(User.Userlogin);






router.get("/signup",(req,res)=>
    {const loginFilePath = path.join(__dirname, "../ColorPrediction/signUp.html");
res.sendFile(loginFilePath);
})
router.post("/signup",data.UserRegister);
router.get('/login', (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/login.html");
    res.sendFile(loginFilePath);
});

router.get("/withdraw",(req,res)=>{
    const loginFilePath = path.join(__dirname, "../ColorPrediction/withdraw.html");
    res.sendFile(loginFilePath);
})

router.get('/profile', (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/profile.html");
    res.sendFile(loginFilePath);
});

router.get('/GameHistory', (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/GameHistory.html");
    res.sendFile(loginFilePath);
});

router.get('/WithdrawHistory', (req, res) => {
    const loginFilePath = path.join(__dirname, "../ColorPrediction/WithdrawHistory.html");
    res.sendFile(loginFilePath);
});

router.post("/login",data.Userlogin);

router.post("/bat",Gamelogic.UserData);

router.get("/result",Gamelogic.result);

router.get("/history",data.UserHistory);
router.post("/bankdetail", data.withdraw);
router.post("/withdraw/ammount",data.WithdrawAmmount)
const jwt = require("jsonwebtoken")
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


module.exports = router;