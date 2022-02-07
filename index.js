const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const badgeRoute = require("./routes/badge");
const cors = require("cors");

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/badges", badgeRoute)

app.get("/",(req,res)=>{
  res.send("Server home")
})

app.listen(5000, () => {
    console.log("Server is up");
  });