const jwt = require("jsonwebtoken")
// const {UserModel} = require("../model/usermodel")
const {blacklistModel} = require("../model/blacklistmodel")


const auth = async (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]


    try {
        const blacklisted = await blacklistModel.find({"token":token})
        
        if (blacklisted) {
            return res.status(400).json({"msg":"Unauthorized1"})
        }
    } catch (error) {
        res.status(400).send({"msg":"Blacklisted"})
        res.status(400).send({"msg":error.message})
    }

    if (token) {
        const decoded = jwt.verify(token,"sahil")

        if (decoded) {
            req.body.userID = decoded.userID
            next()
        } else {
            res.status(400).send({"msg":"Please Login First"})
        }
    } else {
        res.status(400).send({"msg":"Please Login First"})
    }
}

module.exports={
    auth
}