const mongoose = require("mongoose")


const Schema = mongoose.Schema


const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        unique:true,
    },
    savedRecipes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Recipe" 
    }]
    
})

const UserModel = mongoose.model("users" , UserSchema)

module.exports = UserModel