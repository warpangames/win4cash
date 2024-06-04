
const jwt = require("jsonwebtoken")
const AdminData = require("../models/Admin.model.js");
const returnmodel = require("../models/Return.model.js")
const withdrawammountmodel = require("../models/withdrawammount.model.js");
const Usermodel = require("../models/usermodel.model.js");
const Withdraw = require("../models/bankdetail.model.js")


const BatXupdate = async (req,res)=>{
  try {
    await returnmodel.ColorX.create({
      color:req.body.color
    })
    await returnmodel.NumberX.create({
      "0":req.body.on0,
      "1":req.body.on1,
      "2":req.body.on2,
      "3":req.body.on3,
      "4":req.body.on4,
      "5":req.body.on5,
      "6":req.body.on6,
      "7":req.body.on7,
      "8":req.body.on8,
      "9":req.body.on9,


    })
    await returnmodel.BgX.create({
      big:req.body.big,
      small:req.body.small
    })

    res.json("Return Updated Sucessfully !")
  } catch (error) {
    console.log(error);
    
  }
}

const Pending_request = async (req, res) => {
  try {
    console.log("pending request")
    // Fetch all pending withdrawal amounts, sorted by _id in descending order
    const data = await withdrawammountmodel.find({ satuts: "Pending" }).sort({ _id: -1 }).lean();
    // console.log(data)
    if (data.length === 0) {
      return res.status(404).json({ message: "No pending withdrawals found." });
    }

    // Process each data object
    const results = await Promise.all(data.map(async (item) => {
      const details = await Withdraw.find({ Username: item.Username }).lean();
      const phonenoDoc = await Usermodel.findOne({ Username: item.Username });

      return { ...item, details, phoneno: phonenoDoc.Phoneno };
    }));

    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching pending request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const rejected_request = async (req, res) => {
  try {
    console.log("pending request")
    // Fetch all pending withdrawal amounts, sorted by _id in descending order
    const data = await withdrawammountmodel.find({ satuts: "rejected" }).sort({ _id: -1 }).lean();
    // console.log(data)
    if (data.length === 0) {
      return res.status(404).json({ message: "No pending withdrawals found." });
    }

    // Process each data object
    const results = await Promise.all(data.map(async (item) => {
      const details = await Withdraw.find({ Username: item.Username }).lean();
      const phonenoDoc = await Usermodel.findOne({ Username: item.Username });

      return { ...item, details, phoneno: phonenoDoc.Phoneno };
    }));

    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching pending request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const Accepted_request = async (req, res) => {
  try {
    console.log("pending request")
    // Fetch all pending withdrawal amounts, sorted by _id in descending order
    const data = await withdrawammountmodel.find({ satuts: "accepted" }).sort({ _id: -1 }).lean();
    // console.log(data)
    if (data.length === 0) {
      return res.status(404).json({ message: "No pending withdrawals found." });
    }

    // Process each data object
    const results = await Promise.all(data.map(async (item) => {
      const details = await Withdraw.find({ Username: item.Username }).lean();
      const phonenoDoc = await Usermodel.findOne({ Username: item.Username });

      return { ...item, details, phoneno: phonenoDoc.Phoneno };
    }));

    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching pending request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const WithdrawRequest = async (req,res) =>{
   const withdraw_id = req.body.id
   if(req.body.satuts == "accepted"){
   await withdrawammountmodel.updateOne({_id:withdraw_id},{$set:{satuts:"accepted"}})
   res.json("sucessfully accepted")
   } 
   else{
    await withdrawammountmodel.updateOne({_id:withdraw_id},{$set:{satuts:"rejected"}});
    const data = await withdrawammountmodel.findOne({_id:withdraw_id})
    const user_username = data.Username;
    await Usermodel.updateOne({Username:user_username},{$inc:{wallet:parseFloat(req.body.Ammount)}})
    res.json("sucessfully req rejected")

   }

}
const Counter = async (req,res) =>{
  try {
    const user = await Usermodel.find();
    const total_user = user.length;
     const fetching_accpet = await withdrawammountmodel.find({satuts:"accepted"})
     const active = fetching_accpet.length
     const fetching_pending = await withdrawammountmodel.find({satuts:"Pending"})
     const pending = fetching_pending
     .length;
     console.log(active,total_user,pending)
  
     res.json({
      totaluser:total_user,
      accpetreq:active,
      pendingreq:pending
     })
  } catch (error) {
    console.log(error)
    res.status(500).json("Intrnal server error!")
  }

}

module.exports = {BatXupdate,Pending_request,WithdrawRequest,rejected_request,Accepted_request,Counter};