const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
    console.log('ksjf;ksdjf ', req.headers.authorization)
    const token = req.headers.authorization

    if(!token) {
        return res.status(401).send("Token not provided")
    }
    else {
        console.log("toke nis ", token)
        jwt.verify(token , "adminsecret", (err, token) => {
            if(err){
                return res.status(401).send("Invalid token")
            }
            else {
                req.user = token

                next()
            }
        })
    }
}

module.exports = {
    verifyToken
}