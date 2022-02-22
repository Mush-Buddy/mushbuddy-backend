const Mushrooms = require('../models/mushroomModel')
const router = require("express").Router();
const verifyToken = require ('./verifyToken')

/*
Get catalog
req.query = {
    page: pages num to get
    limit: number of posts to get for the page
return - subset of catalog */
router.get('/', verifyToken, async (req, res) => {
    try {
        page = req.query.page * 1|| 1
        limit = req.query.limit * 1|| 10
        skip = (page - 1) * limit
        search = Mushrooms.find({}).skip(skip).limit(limit)
        const catalog = await search.sort('-createdAt')
        res.json({
            cataloglength: catalog.length,
            catalog,
            page,
            limit,
            skip
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router