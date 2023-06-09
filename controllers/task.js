const { task , user} = require("../models/taskModel")
const bodyParser = require("body-parser")
const { hash , compare} = require("bcrypt")
const jwt  = require("jsonwebtoken")
const { all } = require("../router/task")



const addTask = async (req, res) => {
    req.body.user_id = req.user.userId;
    const newtask = new task(req.body)
    await newtask.save()
    await user.updateOne({_id : req.user.userId}, {$push : {all_tasks : newtask._id}}).exec()
    res.send(newtask)
}

const getAllTasks = (req, res) => {
    task.find({user_id : req.user.userId } , function(err, allTasks){
        if(err){
            console.log(err)
        }
        else{
            res.send(allTasks)
        }
    })
}

const getOneTask = (req, res) => {
    const taskId = req.params.taskId

    task.findOne({_id : taskId}, function(err, task){
        if(err){
            console.log(err)
        }
        else{
            res.send(task)
        }
    })
}

const updateOneTask = (req, res) => {
    const taskId = req.params.taskId
    task.updateOne({_id : taskId}, {$set:{title : req.body.title, description: req.body.description}}, function(err, task){
        if(err){
            console.log(err)
        }
        else{
            res.json({message : "One task have been deleted", data : task}) 
        }
    })
}

const deleteOneTask = (req, res) => {
    const taskId = req.params.taskId
    task.deleteOne({_id : taskId}, function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.json({message : "One task have been deleted", data : result})
        }
    })  
}


const createUser = async (req, res) => {
    try{
        req.body.password = await hash(req.body.password, 10)
        const newuser = new user(req.body)
        await newuser.save()
        res.json({"status":true, "data":newuser})
    }
    catch(e){
        return res.json({"status":false, "data":e})
    }

}
const loginUser = async (req, res) => {
    let status = false;
    const findUser = await user.findOne({email : req.body.email}).exec()
    if(!findUser){
        return res.status(201).json({"status":status, "data":"User doesn't exist"})
    }
    else {
        console.log("sdfnklsk ", findUser.password)
        const comparePass = await compare(req.body.password, findUser.password)
        if(!comparePass){
            return res.status(201).json({"status":status, "data":"Password doesn't match"})
        }
        jwt.sign({userId : findUser._id, email : findUser.email}, "adminsecret", (err, token) => {
            if(err) {
                return res.send(err)
            }
            else {
                status = true
                return res.send({"status":status, "data":token})
            }
        })
    }
}


const getAllUsers = async (req, res) => {
    const allUsers = await user.find().exec()
    res.send(allUsers)
}
  
module.exports = {
    getAllTasks,
    addTask,
    getOneTask,
    updateOneTask,
    deleteOneTask,
    createUser,
    getAllUsers,
    loginUser
}