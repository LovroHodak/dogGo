const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')

router.get('/volunteer', (req, res) => {
  let volunteerId = req.session.loggedInUser._id

  messageModel.find({volunteer: volunteerId})
    .populate('doggo')
    .then((volunteerMessArr) => {
        res.render('./volunteer/volunteer-dashboard', {volunteerMessArr}) 
    })
})

//search available dogs landing page
router.get('/volunteer/search', (req, res) => {
  doggoModel.find()
    .then((allDoggos) => {
      if (allDoggos.length > 0) {
        res.render('./volunteer/search', {allDoggos})
      } else {
        res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
      }
    })
})

//see individual dog from volunteer's perspective
router.get('/volunteer/:doggoId/profile', (req, res) => {
  let id = req.params.doggoId

  doggoModel.findById(id)
    .then((foundDoggo) => {
      res.render('./volunteer/dog-profile', {foundDoggo})
    })
})

//search available dogs
router.get('/volunteer/search/filter', (req, res) => {
  let searchedCity = req.query.city
  let fosterValue = req.query.foster
  let walkiesValue = req.query.walkies

  if (searchedCity && fosterValue === "true" && walkiesValue == undefined) {
    doggoModel.find({city: searchedCity, foster: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, foster: true})
      })
    } 
  else if (searchedCity && fosterValue == undefined && walkiesValue === "true") {
    doggoModel.find({city: searchedCity, walkies: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, walkies: true})
      })
    } 
  else if (!searchedCity && !fosterValue && !walkiesValue) {
    res.render('./volunteer/search', {errorMessage: 'Choose city and filters'})
    }
  else {
    doggoModel.find()
      .then((allDoggos) => {
        if (allDoggos.length > 0) {
          res.render('./volunteer/search', {allDoggos, foster: true, walkies: true})
        }
        else {
          res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
        }
      })
  }
})

//editing the owner form
router.get('/volunteer/:volunteerId/edit-volunteer', (req, res) => {
  let id = req.params.volunteerId

  hoomanModel.findById(id)
    .then((volunteer) => {
      res.render('./volunteer/edit-volunteer', {volunteer})
    })
    .catch(() => {
      res.render('error')
    })
})

router.post('/volunteer/:volunteerId/edit-volunteer', (req, res) => {
  let id = req.params.volunteerId
  const {name, city} = req.body

  hoomanModel.findByIdAndUpdate(id, {$set: {name, city}})
    .then(() => {
      res.redirect('/volunteer')
    })
    .catch(() => {
      res.render('error')
    })
})

module.exports = router;