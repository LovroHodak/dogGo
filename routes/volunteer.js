const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')

var bcrypt = require('bcryptjs');

router.get('/volunteer', (req, res) => {
  res.render('./volunteer/volunteer-dashboard')
})

router.get('/volunteer/search', (req, res) => {
  let volunteerCity = req.session.loggedInUser.city

  doggoModel.find({city: volunteerCity})
    .then((allDoggos) => {
      if (allDoggos.length > 0) {
        res.render('./volunteer/search', {allDoggos})
      } else {
        res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
      }
      })
})

router.get('/volunteer/:doggoId/profile', (req, res) => {
let id = req.params.doggoId

doggoModel.findById(id)
  .then((foundDoggo) => {
    res.render('./volunteer/dog-profile', {foundDoggo})
  })
})

router.get('/volunteer/search/filter', (req, res) => {
  let volunteerCity = req.session.loggedInUser.city

  let fosterValue = req.query.foster
  let walkiesValue = req.query.walkies

  console.log(fosterValue)
  console.log(walkiesValue)

if (fosterValue === "true" && walkiesValue == undefined) {
  doggoModel.find({city: volunteerCity, foster: true})
    .then((allDoggos) => {
      res.render('./volunteer/search', {allDoggos, foster: true})
    })
  } else if (fosterValue == undefined && walkiesValue === "true") {
    doggoModel.find({city: volunteerCity, walkies: true})
      .then((allDoggos) => {
      res.render('./volunteer/search', {allDoggos, walkies: true})
    })
  } else if (!fosterValue && !walkiesValue) {
      res.render('./volunteer/search', {errorMessage: 'Choose filters'})
  } else {
      doggoModel.find({city: volunteerCity})
    .then((allDoggos) => {
      if (allDoggos.length > 0) {
        res.render('./volunteer/search', {allDoggos, foster: true, walkies: true})
      } else {
        res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
      }
      })
  }
      })

module.exports = router;