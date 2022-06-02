const Comments = require('../models/commentModel')
const Posts = require('../models/postModel')
const router = require("express").Router();
const verifyToken = require ('./verifyToken')

/* Createcomment
req.body = { commentitems - refer to schema}
*/

router.post('/',verifyToken, async (req, res) => {
    try {
        const { postId, content } = req.body

        const post = await Posts.findById(postId)
        if(!post) return res.status(400).json({msg: "This post does not exist."})

        const newComment = new Comments({
            user: req.user._id, content, postId
        })

        await newComment.save()

        await Posts.findOneAndUpdate({_id :postId}, {$inc : {numComments : 1}})

        res.json({newComment:{...newComment._doc,user:req.user}})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/*
Get comments for a post
return - subset of posts sorted in order */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        search = Comments.find({
            postId: req.params.id
        })
        const comments = await search.sort('-createdAt')
        .populate("user likes", "avatar username")
        res.json({
            comments
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router