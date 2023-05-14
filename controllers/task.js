const TaskMenu = require("../models/taskModel")
const bodyParser = require("body-parser")


const getAll = (req, res) => {
    TaskMenu.find(function(err, elements){
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
    const newtask = new TaskMenu ({
        name : task
    })
    await newtask.save()
    res.redirect("/")
}

const editPage = (req, res) => {
    const taskId = req.params.taskId

    TaskMenu.findOne({_id : taskId}, function(err, element){
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
    TaskMenu.updateOne({_id : taskId}, {$set:{name : yourTask, done: completed}}, function(err, result){
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
    TaskMenu.deleteOne({_id : taskId}, function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/")
        }
    })  
}


module.exports = {
    getAll,
    postOne,
    editPage,
    editOne,
    deleteOne
}