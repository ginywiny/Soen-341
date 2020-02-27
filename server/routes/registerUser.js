/**
 * Made with help from the following online tutorial:
 * https://dev.to/dipakkr/
 * * implementing-authentication-in-nodejs-with-express-and-jwt-codelab-1-j5i
 */

var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");

//Begin asynchronous function call when route /api/register/ is called
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    //Check if user exists inside database (email already used). If user already exists, return status 400.
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    //If user does not exist, declare a new User object as we made in user-schema.js
    user = new User({
      email,
      username,
      password
    });
    //Declare payload for JWT.
    //We will use an auto-generated user ID in the database because it is unique and identifies the user.
    const payload = {
      user: {
        id: user.id
      }
    };

    //Hash and salt the password making passwords in the database secure.
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    await user.save();

    //If user save is successful, return JWT to client along with status 200.
    jwt.sign(payload, "registrationkey", { expiresIn: 10000 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
    //If any error happens, send back status 500.
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving");
  }
});

module.exports = router;
