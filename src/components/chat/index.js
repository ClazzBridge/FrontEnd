const {createServer} = require("http");
const chat = require("./chat");
const {Server} = require("socket.io")
require("dotenv").config();

const httpServer = createServer(chat);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  },
})

require("../../utils/io")(io);
httpServer.listen(process.env.PORT, () => {
  console.log("Listening on port ", process.env.PORT)
})