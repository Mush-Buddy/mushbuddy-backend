const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png'
    },
    aboutme: {
        type: String, 
        default: '',
        maxlength: 200
    },
    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'user'}]
}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)