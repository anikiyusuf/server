const jwt =  require("jsonwebtoken")


const verifyToken = (req, res ,next) =>{
    const authHeader = req.headers.authorization

    if(authHeader) {
        jwt.verify(authHeader , process.env.JWT_TOKEN , (err) => {
              if(err) {
                return res.sendStatus(403);
              }
              next()
        } )

    }else{
        res.sendStatus(401)
    }
}

module.exports = verifyToken