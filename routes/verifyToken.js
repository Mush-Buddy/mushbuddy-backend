const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
      try{
        req.user = await User.findOne({_id: user.id});
        next();
      }catch(err){
        res.status(403).json("Invalid Token");
      }
    });
  } else {
    return res.status(401).json("User not authenticated!");
  }
};


module.exports = verifyToken