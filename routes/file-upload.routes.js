
const express = require('express');
const router  = express.Router();

const doggoModel = require('../models/doggo.model')


// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');



router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  console.log('file is: ', req.file)
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }
  let imagePath = req.file.path 
  res.render('./owner/add-a-dog-form',{imagePath} )
  
})

router.post('/updateImg/:doggoId', uploader.single('imageUrl'), (req, res, next) => {
  console.log('file is: ', req.file)
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