const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

/*Register
Call format - 
req.body = {
    username:
    email:
    password: }
Returns - A copy of saved user */
router.post("/register", async (req, res) => {
    try{
        if(req.body.password.length < 6){
            return res.status(501).json({msg:"Length of password must be at least 6 characters."})
        }
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            state: req.body.state,
            city: req.body.city,
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
            ).toString(),
        })
        await newUser.save();
        res.json({newuser:{...newUser._doc, password: ''}});
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
});

/*Login
Call format - 
req.body = {
    username:
    password: }
Returns - Logged in user info and acces token
Access token needs to be included in reqest header for all api calls
Format - Bearer {JSONWebToken} */
router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );
        if (!user) return res.status(400).json({msg:"Wrong User Name"});

        const hashed = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const original = hashed.toString(CryptoJS.enc.Utf8);
        const input = req.body.password;
        if (original != input) return res.status(401).json({msg:"Wrong Password"});

        const accessToken = jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_SEC,
            {expiresIn:"1d"}
        );
        res.status(200).json({user: {...user._doc, password:''}, accessToken});
    }catch(err){
        res.status(500).json({msg:err.message});
    }
});

module.exports = router;

