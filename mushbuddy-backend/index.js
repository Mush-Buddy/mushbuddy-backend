const dotenv = require("dotenv");
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SocketServer = require('./socketServer')

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const badgeRoute = require("./routes/badge");
const catalogRoute = require("./routes/catalog");
const commentRoute = require("./routes/comment");
const messageRoute = require("./routes/message");


const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    SocketServer(socket)
})

// Routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/badges", badgeRoute)
app.use("/catalog", catalogRoute);
app.use("/comment", commentRoute);
app.use("/message", messageRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });


http.listen(process.env.PORT || 5000, () => {
  console.log("Server is up on port",process.env.PORT || 5000);
});