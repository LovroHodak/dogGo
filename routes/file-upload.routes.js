
const express = require('express');
const router  = express.Router();

const doggoModel = require('../models/doggo.model')


// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');

// router.post("/upload", (req, res) => {
//   console.log(req.body)
// })


router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  console.log('file is: ', req.file)
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }
  let imagePath = req.file.path 
  res.render('./owner/add-a-dog-form',{imagePath} )
  
})








module.exports = router;