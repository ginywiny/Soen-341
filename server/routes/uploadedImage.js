const User = require("../models/user-schema");
const express = require("express");
const router = new express.Router();
const auth = require("../auth");

const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');   

//Save to uploads folder and save image info
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file if not jpeg or png
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 
    },
    fileFilter: fileFilter
});
 
const UploadedImage = require('../models/uploadedImage-schema');

//Get all posts made for uploadedImage
router.get('/', async (req, res, next) => {
    UploadedImage.find()
    .select('name image _id uploadedImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            images: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    uploadedImage: doc.uploadedImage,
                    _id: doc._id,
                    //imgTest: doc.data,
                    //imgTest: doc.contentType,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/api/uploadedImage/' + doc._id
                    }
                }
            }) 
        };
        res.status(200).json(response);
    })

    // UploadedImage.findOne({}, 'img createdAt', function(err, imgTest) {
    //     if (err)
    //         res.send(err);
    //     console.log(imgTest);
    //     res.contentType('json');
    //     res.send(imgTest);
    // }).sort({ createdAt: 'desc' })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//USE THIS ONE FOR GETTING AND AUTHENTICATING WITH USER---------------------------------------
//Get all posts made for uploadedImage THAT ARE AUTHENTICATED
//localhost:8000/api/uploadedImage/authenticated
router.get('/authenticated', auth, async (req, res, next) => {
    //Authenticate with user
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400).json({ message: "User with matching ID not found" });
    }

    UploadedImage.find()
    .select('name image _id uploadedImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            images: docs.map(doc => {
                return {
                    name: doc.name,
                    image: doc.image,
                    uploadedImage: doc.uploadedImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/api/uploadedImage/' + doc._id
                    }
                }
            }) 
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Post an image to the DB
//localhost:8000/api/uploadedImage
router.post('/', upload.single('uploadedImage'), async (req, res, next) => {    //AFter removed auth
    console.log(req.file);
    const uploadedImage = new UploadedImage({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.body.image,
        uploadedImage: req.file.path,
    })
    uploadedImage.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdUploadedImage: {
                name: result.name,
                image: result.image,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/api/uploadedImage/' + result._id,
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

//USE THIS ONE FOR UPLOADING AND AUTHENTICATING WITH USER---------------------------------------
//localhost:8000/api/uploadedImage/authenticated
//Posts THAT ARE AUTHENTICATED
router.post('/authenticated', auth, upload.single('uploadedImage'), async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(400).json({ message: "User with matching ID not found" });
    }

    console.log(req.file);
    const uploadedImage = new UploadedImage({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.body.image,
        uploadedImage: req.file.path,
    })
    uploadedImage.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdUploadedImage: {
                name: result.name,
                image: result.image,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/api/uploadedImage/' + result._id,
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});


//Get exact image from input ID
router.get('/:uploadedImageId', async (req, res, next) => {

    const id = req.params.uploadedImageId;
    UploadedImage.findById(id)
    .select('name image _id uploadedImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json({
                uploadedImage: doc,
                request: {
                    type: 'GET', 
                    url: 'http://localhost:8000/api/uploadedImage'
                }
            });
        } else {
            res.status(404).json({message: "No entry found for input ID"});
        }
    } )
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//Update image details
router.patch('/:uploadedImageId', async (req, res, next) => {
    const id = req.params.uploadedImageId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    UploadedImage.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/api/uploadedImage/' + id
                }
            }); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                erro: err
            });
        });
});

//Delete image using image ID
router.delete('/:uploadedImageId', async (req, res, next) => {
    const id = req.params.uploadedImageId;
    UploadedImage.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Deleted product',
            request: {
                type: 'POST',
                url: 'http://localhost:8000/api/uploadedImage',
                body: {name: 'String', image: 'String' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
