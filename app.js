const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
var cors = require('cors')
require('dotenv').config()



const tasks = require("./router/task")
const connectDB = require("./db/mongoose")

const app = express()


app.use(cors())

app.use(bodyParser.urlencoded  ( {extended:false} ) )
app.use(express.json());
app.use(cookieParser())



app.use("/", tasks)
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







