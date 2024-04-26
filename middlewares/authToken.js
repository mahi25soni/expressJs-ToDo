const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    const token = req.headers.authorization

    if(!token) {
        res.redirect("/auth/login")
    }
    else {
        jwt.verify(token , "adminsecret", (err, decoded) => {
            if(err){
                return res.status(201).send({"status":false, data:"Invalid token"})
            }
            else {
                req.user = decoded

                next()
            }
        })
    }
}

module.exports = {
    verifyToken
}