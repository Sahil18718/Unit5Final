const express = require("express")
const Redis = require("ioredis")
const {UserModel} = require("../model/usermodel")
const UserRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { blacklistModel } = require("../model/blacklistmodel")


const redis = new Redis()
const {auth} = require("../middleware/authenticate")

// SignUp
UserRouter.post("/register", async (req,res)=>{
    const {email,pass}=req.body

    try {
        bcrypt.hash(pass,5, async(error,hash)=>{
            const user = new UserModel({email,pass:hash})
            await user.save()
            res.status(200).send({"msg":"Sign Up succesfull"})
        })
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})


// Login
UserRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try {
        const user = await UserModel.findOne({email})
        if (user) {
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if (result) {
                    const token = jwt.sign({"userID":user._id},"sahil",{expiresIn:'6h'})
                    res.status(200).send({"msg":"Login Succesfull","token":token})
                } else {
                    res.status(400).send({"msg":"Wrong Data"})
                }
            })
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})






// logout
UserRouter.get("/logout", async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    
    try {
        const data = new blacklistModel({token})
        await data.save()
        await redis.set(token,"blacklisted")
        res.status(200).send({"msg":"Logout Succesfull"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

module.exports={
    UserRouter
}

