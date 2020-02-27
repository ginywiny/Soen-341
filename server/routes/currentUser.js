var express = require("express");
var router = express.Router();
const User = require("../models/user-schema");
const auth = require("../auth");

//Begin asynchronous function call when route /api/currentuser/ is called.
//In this case, auth.js is called first before the asynchronous function. It is middleware,
//so it will verify that the user requesting info has a valid token. If all is good, it will allow the
//asynchronous function to proceed. Otherwise it will send back a status 500 and stop the call.
router.get("/", auth, async (req, res) => {
  try {
    //Find a user by their ID and then return their information in JSON to the client.
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});
module.exports = router;
