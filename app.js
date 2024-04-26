
const connectDB = require("./db/mongoose")
const express = require("express")
const bodyParser = require("body-parser")
var cors = require('cors')

const ejs = require("ejs")
const tasks = require("./router/task")
require('dotenv').config()

const app = express()


app.use(cors())

app.use(bodyParser.urlencoded  ( {extended:false} ) )
app.use(bodyParser.json());

app.use(express.static("public"))
app.set("view engine", "ejs")

const port = process.env.PORT_URL || 5000

const start = async () => {

    try{
        console.log("nothing as such ", process.env.MONGO_URL)
        await connectDB(process.env.MONGO_URL)
        app.listen(port,  function(){
            console.log(`we are at port ${process.env.PORT_URL} ports` )
        })
    }
    catch(error){
        console.log(error)
    }
}
start()

app.use("/", tasks)






