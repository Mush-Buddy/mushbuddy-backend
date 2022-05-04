const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Title'
    },
    mushroom:{
        type: mongoose.Types.ObjectId, 
        ref: 'mushroom',
    },
    content: {
        type: String,
        required: true,
        default: 'My Post'
    },
    coordinate: {
        type: Object,
        required: true,
        default: {latitude: 43.69989787086445, longitude: -72.29395419180989}
    },
    latitude:{
        type: String,
        required: true,
        default: '43.700859'
    },
    longitude: {
        type: String,
        required: true,
        default: '-72.289398'
    },
    images: {
        type: String,
        required: true,
        default: "https://www.pngitem.com/pimgs/m/114-1146463_red-mushroom-png-fantasy-mushrooms-png-transparent-png.png"
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)
