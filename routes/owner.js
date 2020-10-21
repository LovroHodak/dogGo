const express = require('express');
const router  = express.Router();

const uploader = require('../config/cloudinary.config.js');

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')

var bcrypt = require('bcryptjs');


//rendering the dashboard
router.get('/owner', (req, res) => {
doggoModel.find({myOwner: req.session.loggedInUser._id})
  .populate('myOwner')
  .then((doggoArr) => {
    console.log('doggoArr is', doggoArr)
    res.render('./owner/owner-dashboard', {doggoArr})
  })
  
})


//rendering the add-a-dog form
router.get('/owner/add-a-dog', (req, res) => {
  res.render('./owner/add-a-dog-form')
})


//rendering the add-a-dog form
router.post('/owner/add-a-dog', (req, res) => {
  const {name, breed, size, age, gender, description, city, foster, walkies, imageUrl} = req.body

  let hoomanData = req.session.loggedInUser

  doggoModel.create( { name, breed, size, age, gender, description, city, foster, walkies, imageUrl, myOwner : hoomanData._id } )
      .then((doggoData) =>{
        hoomanModel.findByIdAndUpdate( hoomanData._id  , { $push: { myDoggos: doggoData._id } } )
        res.redirect('/owner')
      })
})


//editing the add-a-dog form
router.get('/owner/:doggoId/edit-a-dog', (req, res) => {
  let id = req.params.doggoId

  doggoModel.findById(id)
    .then((toBeEditedDoggo) => {
      res.render('./owner/edit-a-dog', {toBeEditedDoggo})
    })
    .catch(() => {
      res.render('error')
    })
})

router.post('/owner/:doggoId/edit-a-dog', (req, res) => {
  let id = req.params.doggoId
  const {name, breed, size, age, gender, description, foster, walkies, imageUrl} = req.body
  let hoomanData = req.session.loggedInUser

  console.log(imageUrl)

  doggoModel.findByIdAndUpdate(id, {$set: {name, breed, size, age, gender, description, foster, walkies, imageUrl, myOwner : hoomanData._id}})
    .then(() => {
      res.redirect('/owner')
    })
    .catch((err) => {
      res.render('error')
      console.log('findbyidandupdate error', err)
    })
})


//deleting the dog card
router.get('/owner/:doggoId/delete', (req, res) => {
  let id = req.params.doggoId
  doggoModel.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/owner')
    })
})


//accessing a dog's messages
router.get('/owner/:doggoId/messages', (req, res) => {
let id = req.params.doggoId

messageModel.find({doggo:id})
  .populate('volunteer')
  .then((messageArr) => {
   console.log(messageArr)
    res.render('./owner/messages',{messageArr})
  })
})


//editing the owner form
router.get('/owner/:ownerId/edit-owner', (req, res) => {
  let id = req.params.ownerId

  hoomanModel.findById(id)
    .then((owner) => {
      res.render('./owner/edit-owner', {owner})
    })
    .catch(() => {
      res.render('error')
    })
})

router.post('/owner/:ownerId/edit-owner', (req, res) => {
  let id = req.params.ownerId
  const {name, city, hoomanType} = req.body

  hoomanModel.findByIdAndUpdate(id, {$set: {name, city, hoomanType}})
    .then(() => {
      res.redirect('/owner')
    })
    .catch((err) => {
      res.render('error')
      console.log('findbyidandupdate error', err)
    })
})

module.exports = router;