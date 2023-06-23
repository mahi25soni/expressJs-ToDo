const express = require("express")
const router = express.Router()
const {verifyToken } = require("../middlewares/authToken")

const {getAll, postOne, editPage, editOne, deleteOne} = require("../controllers/task")
const {createUser,loginUser, getAllUsers } = require("../controllers/task")

// router.route("/").get(getAll).post(postOne)

// router.route('/:taskId').get(editPage).post(editOne)

// router.get('/delete/:taskId', deleteOne)

router.post('/auth/register/', createUser)
router.post('/auth/login', loginUser)

router.get('/users/', verifyToken, getAllUsers)

module.exports = router