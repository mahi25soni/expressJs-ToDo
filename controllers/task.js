const { task , user} = require("../models/taskModel")
const bodyParser = require("body-parser")
const { hash , compare} = require("bcrypt")
const jwt  = require("jsonwebtoken")
const { all } = require("../router/task")


const getAll = (req, res) => {
    task.find(function(err, elements){
        if(err){
            console.log(err)
        }
        else{
            res.render("home", {
                "tasks" : elements
            })
        }
    })
}

const postOne = async (req, res) => {
    const task = req.body.yourTask
    const newtask = new task ({
        name : task
    })
    await newtask.save()
    res.redirect("/")
}

const editPage = (req, res) => {
    const taskId = req.params.taskId

    task.findOne({_id : taskId}, function(err, element){
        if(err){
            console.log(err)
        }
        else{
            res.render("edit", {
                'id' : element._id,
            })
        }
    })
}

const editOne = (req, res) => {
    const taskId = req.params.taskId
    var completed = req.body.completed
    const yourTask = req.body.yourTask
    if ( completed == "on"){
        completed = true;
    }
    else{
        completed = false
    }
    task.updateOne({_id : taskId}, {$set:{name : yourTask, done: completed}}, function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/') 
        }
    })
}

const deleteOne = (req, res) => {
    const taskId = req.params.taskId
    task.deleteOne({_id : taskId}, function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/")
        }
    })  
}


const createUser = async (req, res) => {
    console.log("createruser wala console ", req.body)
    try{
        req.body.password = await hash(req.body.password, 10)
        const newuser = new user(req.body)
        await newuser.save()
        res.send(newuser)
    }
    catch(e){
        return res.send(e)
    }

}
const loginUser = async (req, res) => {
    console.log("lsfndskfdj ", req.body)
    const findUser = await user.findOne({email : req.body.email}).exec()
    if(!findUser){
        return res.status(401).send("So such user exist")
    }
    else {
        console.log("sdfnklsk ", findUser.password)
        const comparePass = await compare(req.body.password, findUser.password)
        if(!comparePass){
            return res.status(401).send("Password doesn't match")
        }
        jwt.sign({userId : findUser._id, email : findUser.email}, "adminsecret", (err, token) => {
            if(err) {
                return res.send(err)
            }
            else {
                req.headers.authorization = token
                return res.send(token)
            }
        })
    }
}


const getAllUsers = async (req, res) => {
    const allUsers = await user.find().exec()
    res.send(allUsers)
}
  
module.exports = {
    getAll,
    postOne,
    editPage,
    editOne,
    deleteOne,
    createUser,
    getAllUsers,
    loginUser
}