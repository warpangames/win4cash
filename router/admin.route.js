const Router = require("express");
const router = Router();
const Admin = require("../controller/Admin.controller.js")

router.post("/profitmulti",Admin.BatXupdate)




module.exports = router;