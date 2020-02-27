const mongoose = require("mongoose");

//Creating standard user schema with mongoose.
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    }
  },
  { collection: "users" }
);
module.exports = mongoose.model("user", UserSchema);

/*
//This is called before the user stores their information into the database.
UserSchema.pre("", async function(next) {
  //This == document that is about to be stored in the database
  const user = this;
  //Hash password with a salt round of 10. The higher the number the more
  //secure, but also the slower to hash.
  const hash = await bcrypt.hash(this.password, 10);
  //Replace plain text password with hashed password.
  this.password = hash;
  //Next() means go to the next middleware.
  next();
});

//This function will be used to verify that a user has entered the correct
//password for log-ins. Bycrypt is needed to check the hashed password.
UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};
*/
