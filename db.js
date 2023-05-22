require("dotenv").config()
const mongoose = require("mongoose")


const MONGODB = process.env.MONGODB




function connectionMongoDB(){
   mongoose.connect(MONGODB)

   mongoose.connection.on('connected', () =>{
    console.log('connection to mongodb successful')
   })

   mongoose.connection.on('err',(err) =>{
    console.log(err)
   } )
}

module.exports = { connectionMongoDB }