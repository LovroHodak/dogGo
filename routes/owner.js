const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')

var bcrypt = require('bcryptjs');


///rending the dashboard
router.get('/owner', (req, res) => {

doggoModel.find({myOwner: req.session.loggedInUser._id})
  .then((doggoArr) => {
    res.render('./owner/owner-dashboard', {doggoArr})
  })
  
})

///rending the add-a-dog form
router.get('/owner/add-a-dog', (req, res) => {
  res.render('./owner/add-a-dog-form')
})

///rending the add-a-dog form
router.post('/owner/add-a-dog', (req, res) => {
  const {name, breed, size, age, gender, description, foster, walkies} = req.body

  let hoomanData = req.session.loggedInUser

  console.log(hoomanData)

  doggoModel.create( { name, breed, size, age, gender, description, foster, walkies, myOwner : hoomanData._id } )
      .then((doggoData) =>{
        hoomanModel.findByIdAndUpdate( hoomanData._id  , { $push: { myDoggos: doggoData._id } } )
        res.redirect('/owner')
      })
})

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
  const {name, breed, size, age, gender, description, foster, walkies} = req.body
  let hoomanData = req.session.loggedInUser

  doggoModel.findByIdAndUpdate(id, {$set: {name, breed, size, age, gender, description, foster, walkies, myOwner : hoomanData._id}})
    .then(() => {
      res.redirect('/owner')
    })
    .catch((err) => {
      res.render('error')
      console.log('findbyidandupdate error', err)
    })
})

router.get('/owner/:doggoId/delete', (req, res) => {
  let id = req.params.doggoId
  doggoModel.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/owner')
    })
})

router.get('/owner/:doggoId/messages', (req, res) => {
let id = req.params.doggoId

doggoModel.find({_id: id})
  .then((doggoArr) => {
   console.log(doggoArr)
    res.render('./owner/messages')
  })
})

module.exports = router;