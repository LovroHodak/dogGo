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

  doggoModel.find()
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

  let searchedCity = req.query.city
  let fosterValue = req.query.foster
  let walkiesValue = req.query.walkies

if (searchedCity && fosterValue === "true" && walkiesValue == undefined) {
  doggoModel.find({city: searchedCity, foster: true})
    .then((allDoggos) => {
      res.render('./volunteer/search', {allDoggos, foster: true})
    })
  } else if (searchedCity && fosterValue == undefined && walkiesValue === "true") {
    doggoModel.find({city: searchedCity, walkies: true})
      .then((allDoggos) => {
      res.render('./volunteer/search', {allDoggos, walkies: true})
    })
  } else if (!searchedCity && !fosterValue && !walkiesValue) {
      res.render('./volunteer/search', {errorMessage: 'Choose city and filters'})
  } else {
      doggoModel.find()
    .then((allDoggos) => {
      console.log('else, all doggos', allDoggos)
      if (allDoggos.length > 0) {
        res.render('./volunteer/search', {allDoggos, foster: true, walkies: true})
      } else {
        res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
      }
      })
  }
      })
      //FINISH THE CITY SEARCH OPTIONS

module.exports = router;