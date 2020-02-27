/**
 * This file is used for authentication for the "searchUser.js" file.
 * Basically it verifies that the JWT corresponding with the user who sent a
 * request is valid using the "secret" key.
 */

const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  //Get the value of the token from the JSON req (request).
  const token = req.header("token");
  //If token is not found (aka returns a value of false), return status 401.
  if (!token) return res.status(401).json({ message: "Auth Error" });

  //If token is found, use the verify method with the "secret" key.
  try {
    const decoded = jwt.verify(token, "secret");
    //If the requesting user has a valid token, call next() which basically means
    //go to the next middleware (allow the calling file to continue with its business).
    req.user = decoded.user;
    next();
    //If any errors occur, return a status of 500.
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
