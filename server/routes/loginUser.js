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

//Begin asynchronous function call when route /api/login/ is called
router.post("/", async (req, res) => {
  //Get email and password data from JSON request and put into a constant.
  const { email, password } = req.body;

  try {
    //Check if user exists inside database. If user does not exist, return status 404.
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist in database"
      });
    }

    //If user exists, use bcrypt to check if hashed password in database matches
    //the password used to login. If password is invalid, return status 404.
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    //If login details are authenticated, declare "payload" for JWT.
    //We will use the user ID in the database because it is unique and identifies the user.
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };
    //We will send the JWT back as a response to the login request in the form of "token" : "value".
    //We also set the expiry time to 1 hour.
    jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ token });
      console.log("Token: " + token);
    });
    //If any error happens, send back status 500.
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
