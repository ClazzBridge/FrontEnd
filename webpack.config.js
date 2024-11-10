const webpack = require("webpack");
require("dotenv").config(); // 서버에서 dotenv를 사용하여 로드

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY), // 필요한 환경 변수를 여기서 정의
    }),
  ],
};