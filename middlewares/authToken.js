const jwt = require("jsonwebtoken")
require("dotenv").config()

function verifyToken(req, res, next) {
    const token = req.headers["authorization"].split(" ")[1]
    console.log(token)


    if(!token) {
        // ye front end se dekha jaa sakta hai I guess.
        res.redirect("/auth/login")
    }
    else {
        jwt.verify(token , process.env.JWT_SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(201).send({"status":false, data:"Invalid token"})
            }
            else {
                req.user = decoded
                console.log(req.user)
                next()
            }
        })
    }
}

module.exports = {
    verifyToken
}