const mongoose = require('mongoose');


const connectdb = async ()=> 
await mongoose.connect(`${process.env.DB_URL}/colorgamegstwala`);
// await mongoose.connect("mongodb+srv://omprakashpilaniya396:x6fivyFL1eaQDt3u@cluster0.mqbtajq.mongodb.net/WarPan_Games?retryWrites=true&w=majority")

module.exports = connectdb;