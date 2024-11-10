const dotenv = require("dotenv");

dotenv.config(); // .env 기본 파일 로드

const env = process.env.NODE_ENV || "development";

if (env === "development") {
  dotenv.config({ path: ".env.development" });
} else if (env === "production") {
  dotenv.config({ path: ".env.production" });
}

module.exports = {
  port: process.env.PORT,
  socketUrl: process.env.SOCKET_SERVER_URI,
};