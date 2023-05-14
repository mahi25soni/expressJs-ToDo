const express = require("express")
const router = express.Router()
const {getAll, postOne, editPage, editOne, deleteOne} = require("../controllers/task")

router.route("/").get(getAll).post(postOne)

router.route('/:taskId').get(editPage).post(editOne)

router.get('/delete/:taskId', deleteOne)

module.exports = router