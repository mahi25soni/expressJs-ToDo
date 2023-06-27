const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Enter your task name"]
    },
    description : {
        type : String,
        require : [true, "Enter your description"]
    },
    done : {
        type : Boolean,
        default : false
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userSchema"
    }
})

const task = mongoose.model("task", taskSchema)

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Enter an username"]
    },
    email : {
        type : String,
        required : true,
        unique : [true, "This email is already taken"]
    },
    password : {
        type : String,
        required : true
    }, 
    all_tasks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "taskSchema"
    }]
})
const user = mongoose.model("user", userSchema)

module.exports =  {
    task,
    user
}