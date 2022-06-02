const mongoose = require('mongoose')

const mushroomSchema = new mongoose.Schema({
    images:{
        type: String,
        required: true,
        default: "https://www.pngitem.com/pimgs/m/114-1146463_red-mushroom-png-fantasy-mushrooms-png-transparent-png.png"
    },
    nameScientific:{
        type: String,
        required: true,
        default: 'undefined'
    },
    nameCommon:{
        type: String,
        required: true,
        default: 'undefined'
    },
    description:{
        type: String,
        required: true,
        default: 'undefined'
    },
    foundInStates:{
        type: Array,
        required: true
    },
    seasons:{
        type: String,
        required: true,
        default: 'undefined'
    },
    hasVeil:{
        type: String,
        required: true,
        default: 'undefined'
    },
    veilType:{
        type: String,
        required: true,
        default: 'undefined'
    },
    stemColors:{
        type: String,
        required: true,
        default: 'undefined'
    },
    capShape:{
        type: String,
        required: true,
        default: 'undefined'
    },
    capColors:{
        type: String,
        required: true,
        default: 'undefined'
    },
    hasGills:{
        type: String,
        required: true,
        default: 'undefined'
    },	
    gillsType:{
        type: String,
        required: true,
        default: 'undefined'
    },
    gillsAttachment:{
        type: String,
        required: true,
        default: 'undefined'
    },
    sporePrint:{
        type: String,
        required: true,
        default: 'undefined'
    },
    bruising:{
        type: String,
        required: true,
        default: 'undefined'
    },
    use:{
        type: String,
        required: true,
        default: 'undefined'
    },
    license:{
        type: String,
        required: true,
        default: 'undefined'
    },
    wikipediapage:{
        type: String,
        required: true,
        default:'undefined'
    },
    citations:{
        type: String,
        required: true,
        default: 'undefined'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('mushroom', mushroomSchema)
