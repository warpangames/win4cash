const mongoose = require("mongoose");

const QR = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
  });

const QRmodel = mongoose.model("QRmodel",QR)

module.exports = QRmodel;