const config = require("./default");
const uri = config.ConnectionUrl;
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
//const client = new MongoClient(uri, { useNewUrlParser: true });

const connectDatabase = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true });
    console.log("MongoDB is Connected...");
    //console.log(client);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDatabase;

/*
const connectDatabase = async () => {
  try {
    await client.connect();
    console.log("MongoDB is Connected...");
    //console.log(client);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDatabase();
module.exports = client;
*/
