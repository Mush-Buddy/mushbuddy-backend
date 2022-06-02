const mongoose = require('mongoose')

// Add badge conditions etc
const badgeSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        default: 'Sample Badge'
    },
    image: {
        type: String,
        required: true,
        default: "https://e7.pngegg.com/pngimages/829/525/png-clipart-round-red-ribbon-logo-badge-badge-text-label-thumbnail.png"
    },
})

module.exports = mongoose.model('badge', badgeSchema)