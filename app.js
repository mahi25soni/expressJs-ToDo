
const connectDB = require("./db/mongoose")
const express = require("express")
const ejs = require("ejs")
const tasks = require("./router/task")
require('dotenv').config()

const app = express()

app.use(express.urlencoded  ( {extended:false} ) )
app.use(express.static("public"))
app.set("view engine", "ejs")

const port = process.env.PORT_URL || 3000

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port,  function(){
            console.log("we are at port 3000 ports ")
        })
    }
    catch(error){
        console.log(error)
    }
}
start()

app.use("/", tasks)






