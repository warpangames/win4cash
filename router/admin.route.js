const Router = require("express");
const router = Router();
const Admin = require("../controller/Admin.controller.js")
const returnmodel = require("../models/Return.model.js");
const Logic  = require('../controller/logic.js')


router.post("/profitmulti",Admin.BatXupdate)
router.get("/batdata",Logic.AdminSending);
router.post("/adminresult",Logic.IncomingResultfromAdmin);

router.get("/pendingreq",async (req,res)=>{
    const data = returnmodel.find({satuts:"pending"}).sort({_id:-1})
    res.json(data);
})
router.get("/rejectreq",async (req,res)=>{
    const data = returnmodel.find({satuts:"reject"}).sort({_id:-1})
    res.json(data);
})
router.get("/acceptreq",async (req,res)=>{
    const data = returnmodel.find({satuts:"accept"}).sort({_id:-1})
    res.json(data);
})



module.exports = router;