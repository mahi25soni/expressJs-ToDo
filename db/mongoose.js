const mongoose = require("mongoose")
const { connect }= mongoose

const connectDB = (url)=> {
    mongoose.set("strictQuery" , false)
    return connect(url, 
    {useNewUrlParser: true})
    .then(()=>console.log('connected'))
    .catch(e=>console.log(e));
}


module.exports = connectDB

//return 
