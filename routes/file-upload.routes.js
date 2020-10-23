
const express = require('express');
const router  = express.Router();

const DoggoModel = require('../models/doggo.model')


// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');

//add dog image to profile
router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }
  let imagePath = req.file.path 
  res.render('./owner/add-a-dog-form',{imagePath} )
  
})

//update dog image via edit dog form
router.post('/updateImg/:doggoId', uploader.single('imageUrl'), (req, res, next) => {
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }

let imagePath = req.file.path 
let id = req.params.doggoId

  doggoModel.findByIdAndUpdate(id, { $set: {imageUrl: imagePath}})
    .then(() => {
      res.redirect(`/owner/${id}/edit-a-dog`)
    })
})

module.exports = router;