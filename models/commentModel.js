const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likes: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    user: {type: mongoose.Types.ObjectId, ref: 'user'},
    postId: mongoose.Types.ObjectId,
}, {
    timestamps: true
})

module.exports = mongoose.model('comment', commentSchema)