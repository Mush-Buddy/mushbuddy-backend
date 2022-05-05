const Posts = require('../models/postModel')
const router = require("express").Router();
const verifyToken = require ('./verifyToken')


/* Search for a post by title
Call format - 
req.query = {
    title = titletosearch
    limit = max_num_to_return, default top 10 }
Returns - Array of matches to title */
router.get('/search', verifyToken, async (req, res) => {
    try {
        req.query.limit = req.query.limit || 10
        const posts = await Posts.find({title: {$regex: req.query.title}})
        .limit(req.query.limit)
        res.json({posts})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* CreatePost
req.body = { postitems - refer to schema}
return - post */

router.post('/',verifyToken, async (req, res) => {
    try {
        const { title, content, mushroom, images, coordinate } = req.body
        const newPost = new Posts({
            title, content, mushroom, images, coordinate, user: req.user._id
        })
        await newPost.save()
        res.json({newPost: {...newPost._doc}})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/*
Getposts for a userid
req.query = {
    page: pages num to get
    limit: number of posts to get for the page
return - subset of posts sorted in order */
router.get('/:id', verifyToken, async (req, res) => {
    try {
        page = req.query.page * 1  || 1
        limit = req.query.limit * 1 || 10
        skip = (page - 1) * limit
        search_field = [req.params.id]
        search = Posts.find({
            user: search_field
        }).skip(skip).limit(limit)
        const posts = await search.sort('-createdAt')
        .populate("user", "avatar username")

        res.json({
            postlength: posts.length,
            posts
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* getPosts, return posts for user and following
req.query = {
    page: pages num to get
    limit: number of posts to get for the page
    includeFollowing: 0 or 1. 0 = False 1 = True, default = True }
return - subset of posts sorted in order */
router.get('/', verifyToken, async (req, res) => {
    try {
        page = req.query.page * 1 || 1
        limit = req.query.limit * 1 || 10
        skip = (page - 1) * limit
        includeFollowing = req.query.includeFollowing || 1
        search_field = [...req.user.following, req.user._id]
        if (includeFollowing == 0){
            search_field = [req.user._id]
        }
        search = Posts.find({
            user: search_field
        }).skip(skip).limit(limit)
        const posts = await search.sort('-createdAt')
        .populate("user", "avatar username")

        res.json({
            postlength: posts.length,
            posts
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* updatePost, update a post by postid
Must be user's post to update
Call format - 
req.params = { id: id of post to update }
req.body = { fields to update - Refer to schema }*/
router.patch('/update/:id', verifyToken, async (req, res) => {
    console.log("got to backend patch");
    try {
        const { title, content, mushroom, coordinate } = req.body;

        console.log(coordinate);

        const post = await Posts.findOneAndUpdate({_id: req.params.id,user:req.user._id}, {
            title, content, mushroom, coordinate
        }).populate("user", "avatar username")

        res.json({
            newPost: {
                ...post._doc,
                title, content, mushroom, coordinate
            }
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* LikePost
req.params = { id: id of post to like } */
router.patch('/like/:id', verifyToken, async (req, res) => {
        try {
            const post = await Posts.find({_id: req.params.id, likes: req.user._id})
            if(post.length != 0) return res.status(400).json({msg: "You already liked this post."})
            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})
            if(!like) return res.status(400).json({msg: 'Post does not exist.'})
            res.json({msg: 'Liked Post!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    })

/* unlike post
req.params = { id = id of post to unlike } */
router.patch('/unlike/:id', verifyToken, async (req, res) => {
    try {

        const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
            $pull: {likes: req.user._id}
        }, {new: true})

        if(!like) return res.status(400).json({msg: 'Post does not exist.'})

        res.json({msg: 'Unliked'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* Get post by id
req.params = { id = id of post to get } */
router.get('/post/:id', verifyToken, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        .populate("user", "avatar username")
        if(!post) return res.status(400).json({msg: 'This post does not exist.'})
        res.json({
            post
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

/* deletePost
-You can only delete your own posts
req.params = { id = id of post to delete } */
router.delete('/post/:id', verifyToken, async (req, res) => {
    try {
        const post = await Posts.findOneAndDelete({_id: req.params.id, user: req.user._id})
        if(!post) return res.status(400).json({msg: 'Post does not exist.'})
        res.json({ msg: 'Deleted'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router