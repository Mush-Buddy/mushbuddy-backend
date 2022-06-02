const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')
const router = require("express").Router();
const verifyToken = require ('./verifyToken')

/* Createmessage
req.body = { messageitems - refer to schema}
*/

router.post('/',verifyToken, async (req, res) => {
    try {
        const { sender, recipient, text } = req.body

        if(!recipient) return;

        const newConversation = await Conversations.findOneAndUpdate({
            $or: [
                {recipients: [sender, recipient]},
                {recipients: [recipient, sender]}
            ]
        }, {
            recipients: [sender, recipient],
            text
        }, { new: true, upsert: true })

        const newMessage = new Messages({
            conversation: newConversation._id,
            sender, recipient, text
        })

        await newMessage.save()

        res.json({...newMessage._doc})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/*
Get conversations
return - conversations sorted in order */
router.get('/conversations', verifyToken, async (req, res) => {
    try {
        const features = Conversations.find({
            recipients: req.user._id
        })
        const conversations = await features.sort('-updatedAt')
        .populate('recipients', 'avatar username')

        res.json({
            conversations,
            result: conversations.length
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/*
Get messages to another user by userid
return - messages sorted in order */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const features = Messages.find({
            $or: [
                {sender: req.user._id, recipient: req.params.id},
                {sender: req.params.id, recipient: req.user._id}
            ]
        })

        const messages = await features.sort('-createdAt')

        res.json({
            messages,
            result: messages.length
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router