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
        limit = req.query.limit * 1|| 9
        skip = (page - 1) * limit
        search = Mushrooms.find({}).skip(skip).limit(limit)
        const catalog = await search
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

router.post('/', verifyToken, async (req, res) => {
    try {
        console.log(req.body)
        page = req.query.page * 1|| 1
        limit = req.query.limit * 1|| 9
        skip = (page - 1) * limit
        search = Mushrooms.find(req.body).skip(skip).limit(limit)
        const catalog = await search
        console.log(catalog)
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

/* Search for a mushroom by its common name (nameCommon)
Call format - 
req.query = {
    nameCommon = Common name to search by
    limit = max_num_to_return, default top 10 }
Returns - Array of matches to common name */
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         req.query.limit = req.query.limit || 10
//         const mushrooms = await Mushrooms.find({ nameCommon: { $regex: req.query.nameCommon } })
//             .limit(req.query.limit).select("nameCommon nameScientific description images")
//         res.json({ mushrooms })
//     } catch (err) {
//         return res.status(500).json({ msg: err.message })
//     }
// })

module.exports = router