//Initializing express, middleware, and CORS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const config = require("./database/default");
const uri = config.ConnectionUrl;
const auth = require("./auth");
const app = express();
const User = require("./models/user-schema");
var morgan = require("morgan");

//Loading middleware and CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(morgan("tiny"));

//Initialize database connection
const connectDatabase = require("./database/connection");
connectDatabase();

//Middleware and processing for uploading and requesting user photos
//from the database.
const conn = mongoose.createConnection(uri);
let gfs;
conn.once("open", () => {
  // init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

//Loading router modules
var login = require("./routes/loginUser");
app.use("/api/login", login);
var register = require("./routes/registerUser");
app.use("/api/register", register);
var search = require("./routes/searchUser");
app.use("/api/search", search);
var currentuser = require("./routes/currentUser");
app.use("/api/currentuser", currentuser);
var searchuser = require("./routes/searchUser");
app.use("/api/searchuser", searchuser);
var followuser = require("./routes/following");
app.use("/api/follow", followuser);
var updatebio = require("./routes/updateBio");
app.use("/api/updatebio", updatebio);

//Listen on Port 8000
const port = process.env.PORT || 8000;

//Exportable server which is used for integration testing.
var server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

//Default path
app.get("/", (req, res) => {
  res.send("Hello World Test!");
});

//path POST /upload
app.post("/uploads", auth, upload.single("myImage"), async (req, res) => {
  //Since the above middleware has already stored the image, the user document must
  //now be updated with a reference to the image and the description for the photo.
  const description = req.body.myDescription;
  try {
    //Find the user using the id and add a new post object containing the photoid and the description.
    let userId = await User.findById(req.user.id);
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { posts: { photoid: req.file.id, description: description } }
      },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) {
          return res.status(400).json(err);
        }
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }

  //Return the stored file to the client.
  res.json({ file: req.file });
});

// @route GET /files
// @desc Display all files for the CURRENT user in JSON
app.get("/files", auth, async (req, res) => {
  try {
    //Search for all files stored by the requesting user.
    const user = await User.findById(req.user.id);
    let objectIdArray = user.posts.photoid.map(s => mongoose.Types.ObjectId(s));
    gfs.files.find({ _id: { $in: objectIdArray } }).toArray((err, files) => {
      //Check if file matching those stored in the users document exist. If not, return status 404.
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist"
        });
      }

      //If file matching those stored in the users document exist, create "description" field and attach the description to the file objects.
      for (var i = 0; i < files.length; i++) {
        files[i]["description"] = user.posts.description[i];
      }

      //Return the files to the server.
      return res.json(files);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// @route GET /files
// @desc Display all files for a REQUESTED user in JSON
app.post("/searchuser/files", auth, async (req, res) => {
    try {
        console.log(req.body);
    //Search for all files stored by the requesting user.
    const user = await User.findOne({ username: req.body.username });
    let objectIdArray = user.posts.photoid.map(s => mongoose.Types.ObjectId(s));
    gfs.files.find({ _id: { $in: objectIdArray } }).toArray((err, files) => {
      //Check if file matching those stored in the users document exist. If not, return status 404.
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist"
        });
      }

      //If file matching those stored in the users document exist, create "description" field and attach the description to the file objects.
      for (var i = 0; i < files.length; i++) {
        files[i]["description"] = user.posts.description[i];
      }

      //Return the files to the server.
      return res.json(files);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file exists
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist"
      });
    }
    //If files exists, return file to client
    return res.json(file);
  });
});

//@route GET /image/:filename
//@desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exist"
      });
    }
    //Check if image

    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/img" ||
      file.contentType === "image/jpg" ||
      file.contentType === "image/gif" ||
      file.contentType === "image/tif"
    ) {
      //Read output to browser

      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});

app.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    //Check if files exist
    if (!files || files.length === 0) {
      res.render("profile", { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png" ||
          file.contentType === "image/img" ||
          file.contentType === "image/jpg" ||
          file.contentType === "image/gif" ||
          file.contentType === "image/tif"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
    }
    res.sendFile({ files: files });
    res.render("profile", { files: files });
  });
});

app.delete("/files/:_id", (req, res) => {
  gfs.remove({ _id: req.params._id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });
  res.redirect('/');
});

module.exports = server;
