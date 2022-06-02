const Users = require('../models/userModel');
const verifyToken = require('./verifyToken');
const router = require("express").Router();

/* Search for a user by username
Call format - 
req.query = {
    username = usernametosearch
    limit = max_num_to_return, default top 10 }
Returns - Array of matches to username */
router.get('/', verifyToken, async (req, res) => {
    try {
        req.query.limit = req.query.limit || 10
        const users = await Users.find({ username: { $regex: req.query.username } })
            .limit(req.query.limit).select("-password").populate("followers following",'username email avatar firstName lastName')
        res.json({ users })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})


/* getUser by id 
Call format -
req.params = { id = id_of_user }
Returns - User associated with the id */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-password').populate("followers following",'username email avatar firstName lastName')
        if (!user) return res.status(400).json({ msg: "User does not exist." })
        res.json({ user })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})


/* updateUser
-User can only update themselves
Call format - 
req.body = { field_to_update : update }
Returns - Update status */
router.patch('/update', verifyToken, async (req, res) => {
    try {
        const { avatar, state, city, aboutme, firstName, lastName } = req.body
        await Users.findOneAndUpdate({ _id: req.user._id }, { avatar, state, city, aboutme, firstName, lastName })
        res.json({ msg: "Updated" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

/* Follow
Call format -
req.params = { id: user_id of user to follow }
returns - user you just followed */
router.patch('/follow/:id', verifyToken, async (req, res) => {
    try {
        const user = await Users.find({ _id: req.params.id, followers: req.user._id })
        if (user.length > 0) return res.status(500).json({ msg: "Already followed" })

        const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
            $push: { followers: req.user._id }
        }, { new: true }).select('-password')

        await Users.findOneAndUpdate({ _id: req.user._id }, {
            $push: { following: req.params.id }
        }, { new: true })

        res.json({ newUser })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

/* Unfollow
Call format -
req.params = { id: user_id of user to unfollow }
returns - user you just unfollowed */
router.patch('/unfollow/:id', verifyToken, async (req, res) => {
    try {
        const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
            $pull: { followers: req.user._id }
        }, { new: true }).select("-password")
        await Users.findOneAndUpdate({ _id: req.user._id }, {
            $pull: { following: req.params.id }
        }, { new: true })

        res.json({ newUser })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

module.exports = router