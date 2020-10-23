const express = require('express');
const router  = express.Router();

var bcrypt = require('bcryptjs');

const HoomanModel = require('../models/hooman.model')
const DoggoModel = require('../models/doggo.model')
const MessageModel = require('../models/message.model')

//rendering the dashboard
router.get('/owner', (req, res) => {
  let ownerId = req.session.loggedInUser._id

  DoggoModel.find({myOwner: req.session.loggedInUser._id})
    .populate('myOwner')
    .then((doggoArr) => {
      console.log(doggoArr)
      res.render('./owner/owner-dashboard', {doggoArr, ownerId})
    })
})


//rendering the add-a-dog form
router.get('/owner/add-a-dog', (req, res) => {
  res.render('./owner/add-a-dog-form')
})

router.post('/owner/add-a-dog', (req, res) => {
  const {name, breed, size, age, gender, description, city, foster, walkies, imageUrl} = req.body

  let hoomanData = req.session.loggedInUser

  DoggoModel.create( { name, breed, size, age, gender, description, city, foster, walkies, imageUrl, myOwner : hoomanData._id } )
      .then((doggoData) =>{
        HoomanModel.findByIdAndUpdate( hoomanData._id  , {$push: {myDoggos: doggoData._id}})
        res.redirect('/owner')
      })
})


//editing the add-a-dog form
router.get('/owner/:doggoId/edit-a-dog', (req, res) => {
  let id = req.params.doggoId

  DoggoModel.findById(id)
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

  DoggoModel.findByIdAndUpdate(id, {$set: {name, breed, size, age, gender, description, foster, walkies, imageUrl, myOwner : hoomanData._id}})
    .then(() => {
      res.redirect('/owner')
    })
    .catch(() => {
      res.render('error')
    })
})


//deleting the dog card
router.get('/owner/:doggoId/delete', (req, res) => {
  let id = req.params.doggoId
  DoggoModel.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/owner')
    })
})


//editing the owner form
router.get('/owner/:ownerId/edit-owner', (req, res) => {
  let id = req.params.ownerId

  HoomanModel.findById(id)
    .then((owner) => {
      res.render('./owner/edit-owner', {owner})
    })
    .catch(() => {
      res.render('error')
    })
})

router.post('/owner/:ownerId/edit-owner', (req, res) => {
  let id = req.params.ownerId
  const {name, hoomanType} = req.body

  HoomanModel.findByIdAndUpdate(id, {$set: {name, hoomanType}})
    .then(() => {
      res.redirect('/owner')
    })
    .catch((err) => {
      res.render('error')
    })
})

//editing owner password
router.post('/owner/edit-owner-verify-password', (req, res) => {
  const {submittedPassword} = req.body
  const ownerEmail = req.session.loggedInUser.email

  HoomanModel.findOne({email: ownerEmail})
    .then((owner) => {
      bcrypt.compare(submittedPassword, owner.password)
        .then((result) => {
          if (result) {
            res.render('./owner/edit-owner', {passwordMessage: 'Password matches!', owner})
          }
          else {
            res.status(500).render('./owner/edit-owner', {errorMessage: 'Password not matching', owner})
          }
        })
    })
})

router.post('/owner/edit-owner-password', (req, res) => {
    const {newPassword} = req.body
    const ownerEmail = req.session.loggedInUser.email

    bcrypt.genSalt(10)
    .then((salt) => {
      bcrypt.hash(newPassword, salt)
        .then((hashedPassword) => {
          HoomanModel.findOneAndUpdate({email: ownerEmail}, {$set: {password: hashedPassword}})
            .then((owner) => {
              res.render('./owner/edit-owner', {successMessage: 'Password successfully updated', owner})
            })
        })
    })  
})

module.exports = router;