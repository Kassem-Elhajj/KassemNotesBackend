const jwt = require('jsonwebtoken')

const validateUser = (req, res, next) => {

    const token = req.cookies.jwt
    const JWT_SECRET = process.env.JWT_SECRET

    if(token){
        jwt.verify(token, JWT_SECRET, {}, async (err, decodedToken) => {
            if(err){

                console.log(err.message);
                return res.json({ status: "failed", message: "invalid token" })

            }
            else{                
                next()
            }
        })

    }
    else{
        return res.json({ status: "failed", message: 'no token found' })
    }
    
}

module.exports = {
    validateUser
}
