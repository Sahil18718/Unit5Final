const express = require("express")
const apirouter = express.Router()

const fetch = require("node-fetch")
const Redis = require("ioredis")
const redis = new Redis()

apirouter.get("/",async(req,res)=>{
    const {ip}=req.body
    try {
        const response =await fetch(`http://ip-api.com/json/${ip}?fields=city`,{method:'GET'})
        const data =await response.json()

        res.status(200).send({"msg":"Completed","city":data.city})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})

module.exports={
    apirouter
}