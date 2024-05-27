const { connect } = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const cors  = require('cors');
const connectdb = require("./db/connect.js");


dotenv.config({
    path: './.env'
})


connectdb()
.then(()=>{
    console.log("Database succesfully connected !")
})
.catch((err)=>{
    console.log("Error in DB connection :",err);
})

app.use(cors());

app.listen(process.env.PORT || 2000,()=>
    console.log(`server is running port no ${process.env.PORT}`)
)