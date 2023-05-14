const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    name : String,
    done : {
        type : String,
        default : false
    }
})

module.exports =  mongoose.model("TaskMenu", taskSchema)