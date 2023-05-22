const express = require("express")
const mongoose = require("mongoose")
//multer for file upload
const multer = require("multer"); 
const RecipeModel = require('../models/Recipe')
const UserModel = require("../models/Users")
const verifyToken = require("../middleware/userMiddleware")

const storage = multer.diskStorage({
    destination:function( req, file, cb){
        cb(null , 'uploads/')
    }, 
    filename: function ( req, file, cb ){
        const uniqueSuffix = Date.now() + '-' +  Math.round(Math.random() * 1e9);
        cb(null , file.filename + '-' +  file.originalname.split('.').pop())
    }
});
const upload = multer({storage : storage})
// upload route
// const upload = multer({ dest: "uploads/" });

const recipeRouter = express.Router()

recipeRouter.get("/", async(req , res) => {
try{
      const result = await RecipeModel.find({})
      res.status(200).json(result)
 }catch(err){
    res.status(500).json(err);
  }
 })




// Create a new recipe   and image upload 
// recipeRouter.post("/" , upload.single("image"), verifyToken, async (req,res) =>{
 recipeRouter.post("/" , upload.single('image'), verifyToken, async (req,res) =>{

    const recipe = new RecipeModel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.body.image,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
        cookingTime: req.body.cookingTime,
        userOwner: req.body.userOwner, 
    })
    console.log(recipe)

    try{
          const result = await recipe.save()
          res.status(201).json({
            createdRecipe:{
                name: result.name,
                image: result.image,
                ingredients: result.ingredients,
                instructions : result.instructions,
                _id: result._id,
            }
          })
    }catch(err){
        res.status(500).json(err)
    }
 })

 recipeRouter.get("/:recipeId", async (req, res) => {
    try {
      const result = await RecipeModel.findById(req.params.recipeId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// saved
recipeRouter.put("/" , async (req,res) => {

    const recipe = await RecipeModel.findById(req.body.recipeID)
    const user = await   UserModel.findById(req.body.userID)
    try{
        user.savedRecipes.push(recipe)
        await user.save();
        res.status(200).json({ savedRecipes : user.savedRecipes })
    }catch(err){
        res.status(500).json(err);
    }
})


// Get  id of Saved Recipes 
recipeRouter.get("/savedRecipes/ids/:userId" , async (req,res) => {
    try{
        const user = await   UserModel.findById(req.params.userId)
        res.status(201).json({ savedRecipes :user?.savedRecipes })
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})


recipeRouter.get("/savedRecipes/:userId" , async (req,res) => {
    try{
        const user =  await   UserModel.findById(req.params.userId)
        const savedRecipes = await   RecipeModel.find({
            _id: { $in: user.savedRecipes},
        })
     
    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
})

module.exports = recipeRouter