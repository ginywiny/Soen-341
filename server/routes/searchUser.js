var express = require("express");
var router = express.Router();
var client = require("../database/connection");

/**
 * If a username matching the search query from the user
 * is found in the database, send back a json response
 * of the user that was found. Will eventually need to return
 * a unique profile ID so that users can visit the profile.
 * @param {*} client
 * @param {*} search
 */
async function findSearchResults(client, search) {
  result = await client.findOne({ username: search });
  if (result) {
    console.log("Found user");
    return result;
  } else {
    console.log("No users found");
    return null;
  }
}

//Wait for POST request to /search/. Response is returned
//in JSON format.

router.post("/", async (req, res, next) => {
  try {
    console.log(`Received search request. Search is: ${req.body.search}`);
    findSearchResults(client, req.body.search).then(result => {
      res.json(result.username);
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
