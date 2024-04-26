const { task , user} = require("../models/taskModel")
const { hash , compare} = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()



const addTask = async (req, res) => {

    try{
        req.body.user_id = req.user.userId;
        const newtask = new task(req.body)
        await newtask.save()
        await user.updateOne({_id : req.user.userId}, {$push : {all_tasks : newtask._id}}).exec()
        res.send(newtask)
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }
}

const getAllTasks = (req, res) => {
    try{
        task.find({user_id : req.user.userId } , function(err, allTasks){
            if(err){
                console.log(err)
            }
            else{
                res.status(201).json({
                    success : true,
                    message : "User added successfully!",
                    data : allTasks
                })

            }
        })
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }

}


const updateOneTask = (req, res) => {
    try{
        const taskId = req.params.id
        task.updateOne({_id : taskId}, {$set:{title : req.body.title, description: req.body.description}}, function(err, updated_task){
            if(err){
                console.log(err)
            }
            else{
                res.status(201).json({
                    success : true,
                    message : "User added successfully!",
                    data : updated_task
                })
            }
        })
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }

}

const deleteOneTask = (req, res) => {
    try{
        const taskId = req.params.id
        task.deleteOne({_id : taskId}, function(err, result){
            if(err){
                console.log(err)
            }
            else{
                res.status(201).json({
                    success : true,
                    message : "User deleted successfully!",
                })
            }
        })  

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }

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



  
module.exports = {
    getAllTasks,
    addTask,
    updateOneTask,
    deleteOneTask,
    createUser,
    loginUser
}