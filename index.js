const { connect } = require("mongoose");
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const connectdb = require("./db/connect.js");
const app = require("./app");


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


// {
//     origin:["http://localhost:5000","http://localhost:7000"],
//     credentials:true
// }

app.listen(process.env.PORT || 2000,()=>
    console.log(`server is running port no ${process.env.PORT}`)
)