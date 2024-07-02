const Router = require("express");
const router = Router();
const Admin = require("../controller/Admin.controller.js")
const returnmodel = require("../models/withdrawammount.model.js");
const Logic  = require('../controller/logic.js');
const manual = require("../models/Manual.model.js")
const multer = require("multer");


router.post("/profitmulti",Admin.BatXupdate)
router.get("/batdata",Logic.AdminSending);
router.post("/adminresult",Logic.IncomingResultfromAdmin);

router.get("/pendingreq",Admin.Pending_request)
router.get("/rejectreq",Admin.rejected_request)
router.get("/acceptreq",Admin.Accepted_request)
router.post("/withrawreq/satuts",Admin.WithdrawRequest)
router.get("/count", Admin.Counter);
router.get("/paymentalldata",Admin.PaymentAllData);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/setqr",upload.single('file'),Admin.QRSet);
 router.post("/updatewallet",Admin.IncreamtWallet);
 router.post("/paymentreq/reject",Admin.RejectPayment)

  router.post("/deleteall",Admin.deleleAllData)
  router.post("/manual", async (req, res) => {
    try {
      const data = await manual.findOne();
      
      if (data) {
        if (req.body.per !== undefined) {
          data.per = req.body.per;
        } else if (req.body.whatsappno !== undefined) {
          data.whatsappno = req.body.whatsappno;
        } else {
           res.json("No valid fields provided to update" );
        }
        
        await data.save();
        return res.status(200).json({ message: "Data updated successfully!" });
      } else {
        await manual.create({
          per: req.body.per,
          whatsappno: req.body.whatsappno
        });
        return res.json({ message: "Data created successfully!" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ message: "Internal Server Error" });
    }
  });
  
  router.get('/manual',async (req,res)=>{
   const data = await manual.findOne();
   res.json(data);
  })


module.exports = router;