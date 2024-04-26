const express = require("express")
const router = express.Router()
const {verifyToken } = require("../middlewares/authToken")

const {getAllTasks, addTask, getOneTask, updateOneTask, deleteOneTask} = require("../controllers/task")
const {createUser,loginUser, getAllUsers } = require("../controllers/task")

router.post('/auth/register/', createUser)
router.post('/auth/login', loginUser)

router.get('/users/', verifyToken, getAllUsers)

router.post("/tasks", verifyToken, addTask)
router.get("/tasks", verifyToken, getAllTasks)



router.route("/tasks/:taskId").get(verifyToken, getOneTask).put(verifyToken, updateOneTask).delete(verifyToken, deleteOneTask)




module.exports = router