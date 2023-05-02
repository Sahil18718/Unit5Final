const express =require("express")
const cors = require("cors")
const {connection} = require("./db")
const {auth} =require("./middleware/authenticate")
const {UserRouter} = require("./routes/userrouter")
const { apirouter } = require("./routes/apirouter")

require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())


app.use("/users",UserRouter)
app.use(auth)
app.use("/ip",apirouter)



app.get("/",(req,res)=>{
    res.send("WElcome")
})


// Running server
app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("running on Mongo Atlas")
    } catch (error) {
        console.log({"msg":error.message})
    }
    console.log("running server")
})