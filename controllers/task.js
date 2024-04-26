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
        const emailCheck = await user.findOne({email : req.body.email})

        if(emailCheck) {
            return res.status(409).json({
                success : false,
                message : "User already exists! Try another email"
            })
        }
        // Email and password aren't empty, can be made sure from frontend
        const hash_pass = await bcrypt.hash(req.body.password, 10);

        const new_user = await Users.create({
            ...req.body,
            password : hash_pass
        })

        res.status(201).json({
            success : true,
            message : "User added successfully!",
            data : new_user
        })

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const isUser = await user.findOne({email})
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }

        bcrypt.compare(password, isUser.password, (err, result) => {
            if(err){
                return res.status(401).json({
                    success : false,
                    message : "Wrong Password. Retry!"
                })
            }
            else{
                const payload = {
                    userId : isUser._id,
                    username : isUser.username,
                    email : isUser.email,
                }

                jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, result) => {
                    if(err) {
                        return res.status(401).json({
                            success : false,
                            message : "Error while creating jwt token "
                        }) 
                    }
                    else{
                        // cookie creation
                        const cookie_option = {
                            expires : new Date(Date.now() + 3*24*60*60*1000),
                            httpOnly : true
                        }
                        res.cookie(process.env.TOKEN_NAME, result, cookie_option)
                        res.status(200).json({
                            success : true,
                            message : "Login Successfully!"
                        })
                    }
                })
            }
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
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