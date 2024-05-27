const Router = require("express");
const router = Router();
const data = require("../controller/User.controller.js")
const Gamelogic = require("../controller/logic.js")
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

router.post("/login",data.Userlogin);

router.post("/bat",Gamelogic.UserData);

router.get("/result",Gamelogic.result);

router.get("/history",data.UserHistory);


module.exports = router;