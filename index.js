require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { connectionMongoDB} = require("./db")
const  app =  express()
const PORT = process.env.PORT || 5000

const userRouter = require("./routes/userRoutes")
const recipeRouter = require("./routes/recipeRoutes")


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

 connectionMongoDB()


app.use("/auth" , userRouter)
app.use("/recipes" , recipeRouter)

app.listen(PORT, ()  =>{

    console.log(`server running on ${PORT} `)
} )

