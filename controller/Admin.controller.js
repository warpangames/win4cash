const jwt = require("jsonwebtoken")
const AdminData = require("../models/Admin.model.js");
const returnmodel = require("../models/Return.model.js")
const withdrawammountmodel = require("../models/withdrawammount.model.js");
const Usermodel = require("../models/usermodel.model.js");
const Withdraw = require("../models/bankdetail.model.js");
const QRmodel = require('../models/Qrgateway.model.js');
const Paymentmodel = require('../models/payment.model.js');
const Gstmodel = require('../models/Gstwithdraw.model.js')
const bankdetail = require("../models/bankdetail.model.js");
const Batmodel = require("../models/Batmodel.model.js")


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
      const details = await Withdraw.findOne({ Username: item.Username }).sort({_id:-1}).lean();
      const phonenoDoc = await Usermodel.findOne({ Username: item.Username });
      const Gst= await Gstmodel.find({Username:item.Username,Uid:item.Uid})

      return { ...item, details, Gst,phoneno: phonenoDoc.Phoneno };
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
    let total_user = 0;
   let active = 0;
   let pending = 0;
   const user = await Usermodel.find().sort({ createdAt: -1 });
     total_user = user.length;
     const fetching_accpet = await withdrawammountmodel.find({satuts:"accepted"})
     if(fetching_accpet){
      active = fetching_accpet.length;
     }
    
     const fetching_pending = await withdrawammountmodel.find({satuts:"Pending"})
     if(fetching_pending){
       pending = fetching_pending.length;
     }
    
   
     console.log(active,total_user,pending)
  
     res.json({
      totaluser:total_user,
      accpetreq:active,
      pendingreq:pending,
      user:user,
     


     })
  } catch (error) {
    console.log(error)
    res.status(500).json("Intrnal server error!")
  }

}

const QRSet = async(req,res) =>{
  const { originalname, mimetype, buffer } = req.file;

  await QRmodel.create({
    filename: originalname,
    contentType: mimetype,
    data: buffer,
  });
 res.json("QR save sucessfully !")
}

const PaymentAllData = async (req, res) => {
  try {
    // Fetch all Payment data and sort it
    const Payment = await Paymentmodel.find().sort({ _id: -1 });
    console.log(Payment);

    // Map over each Payment item to fetch corresponding wallet data
    const data = await Promise.all(Payment.map(async (item) => {
      const user = await Usermodel.findOne({ Username: item.Username });
      const wallet = user ? user.wallet : null; // Ensure wallet is fetched correctly
      console.log(wallet);

      return { item, wallet };
    }));

    console.log(data);

    // Send the aggregated data as a JSON response
    res.json(data);
  } catch (error) {
    console.error('Error fetching payment data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const IncreamtWallet = async (req,res) =>{
  if(req.body.type == "tr"){
     const tr_id = req.body.Transcation_id
     await Paymentmodel.updateOne({Transcation_id:tr_id},{$set:{stauts:"apporved"}});
     await Usermodel.updateOne({Username:req.body.username},{$inc:{wallet:parseFloat(req.body.Ammount)}})
    res.json("updated sucessfully !")


  }
  else{
    await Usermodel.updateOne({Username:req.body.username},{$inc:{wallet:parseFloat(req.body.Ammount)}})
    res.json("updated sucessfully !")

  }
}
const RejectPayment = async(req,res) =>{
  const tr_id = req.body.Transcation_id;
  await Paymentmodel.updateOne({Transcation_id:tr_id},{$set:{stauts:"rejcted"}});
  res.json("rejected")
}

const deleleAllData = async(req,res) =>{
  await Usermodel.deleteOne({Username:req.body.Username});
  await withdrawammountmodel.deleteMany({Username:req.body.Username});
  await Paymentmodel.deleteMany({Username:req.body.Username});
  await Gstmodel.deleteMany({Username:req.body.Username})

  res.json("data deleted sucessfully !")

  
}

module.exports = {BatXupdate,Pending_request,WithdrawRequest,rejected_request,Accepted_request,Counter,QRSet,PaymentAllData,IncreamtWallet,RejectPayment,deleleAllData};