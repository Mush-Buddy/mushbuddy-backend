const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    text: String
}, {
    timestamps: true
})

module.exports = mongoose.model('conversation', conversationSchema)