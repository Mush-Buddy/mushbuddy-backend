const Badges = require('../models/badgeModel')
const router = require("express").Router();
const verifyToken = require ('./verifyToken')

// Return all badges
router.get('/', verifyToken, async (req, res) => {
    try {
        const badges = await Badges.find({})
        res.json({badges})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})


/* CreateBadge
To be used by admins
req.body = { badgeitems - refer to schema }
return - badge */
router.post('/',verifyToken, async (req, res) => {
    try {
        const { content, image } = req.body
        const newBadge = new Badges({
            content, image
        })
        await newBadge.save()
        res.json({
            msg: 'Created Badge!',
            newBadge: {
                ...newBadge._doc
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router