const tokenService = require("../services/tokenService");

module.exports = async function(req,res,next){
    console.log(req.headers);
    try {
        
        const accessToken = req.headers.authorization.split(" ")[1];
        
        if(!accessToken){
            throw new Error()
        }
        const userData = await tokenService.verifyAccessToken(accessToken);

        console.log(userData)

        if(!userData){
            throw new Error();
        }
        req.user = userData;
        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({message:'Invalid token'})
    }
}