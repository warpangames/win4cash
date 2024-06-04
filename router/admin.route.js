const Router = require("express");
const router = Router();
const Admin = require("../controller/Admin.controller.js")
const returnmodel = require("../models/withdrawammount.model.js");
const Logic  = require('../controller/logic.js')


router.post("/profitmulti",Admin.BatXupdate)
router.get("/batdata",Logic.AdminSending);
router.post("/adminresult",Logic.IncomingResultfromAdmin);

router.get("/pendingreq",Admin.Pending_request)
router.get("/rejectreq",Admin.rejected_request)
router.get("/acceptreq",Admin.Accepted_request)
router.post("/withrawreq/satuts",Admin.WithdrawRequest)
router.get("/count", Admin.Counter);



module.exports = router;