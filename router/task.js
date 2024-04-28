const express = require("express")
const router = express.Router()
const {verifyToken } = require("../middlewares/authToken")

const {getAllTasks, addTask, getOneTask, updateOneTask, deleteOneTask} = require("../controllers/task")
const {createUser,loginUser, getAllUsers, markDone } = require("../controllers/task")

router.post('/register', createUser)
router.post('/login', loginUser)


router.post("/task", verifyToken, addTask)
router.get("/task", verifyToken, getAllTasks)


router.put('/task/:id', verifyToken, updateOneTask)
router.delete('/task/:id', verifyToken, deleteOneTask)
router.put('/task/done/:id', verifyToken, markDone)






module.exports = router