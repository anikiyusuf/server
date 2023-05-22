



const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/Users");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User Registered Successfully!" });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "Username or password is incorrect" });
  }

  const { _id: id } = user;
  const secret = process.env.JWT_TOKEN || "fallback-secret-key";

  const token = jwt.sign({ id }, secret);

  res.json({ token, userID: id });
});

module.exports = userRouter;