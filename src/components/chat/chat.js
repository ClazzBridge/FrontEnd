const express = require("express")
const mongoose = require("mongoose");
require('dotenv').config()
const cors = require("cors")
const chat = express();
chat.use(cors())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  // 연결 성공 시 실행되는 콜백
  console.log("MongoDB 연결 성공");
}).catch((err) => {
  // 연결 실패 시 실행되는 콜백
  console.error("MongoDB 연결 실패: ", err);
});

module.exports = chat