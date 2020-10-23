const express = require('express');
const router  = express.Router();

var bcrypt = require('bcryptjs');

const HoomanModel = require('../models/hooman.model')
const DoggoModel = require('../models/doggo.model')
const MessageModel = require('../models/message.model')

router.get('/volunteer', (req, res) => {
  let volunteerId = req.session.loggedInUser._id
  let volunteerName = req.session.loggedInUser.name

  MessageModel.find({volunteer: volunteerId})
    .populate('doggo')
    .then((volunteerMessArr) => {
      console.log(volunteerMessArr)
        res.render('./volunteer/volunteer-dashboard', {volunteerMessArr, volunteerName, volunteerId}) 
    })
})

//search available dogs landing page
router.get('/volunteer/search', (req, res) => {
  DoggoModel.find()
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

  DoggoModel.findById(id)
    .then((foundDoggo) => {
      let capitalizedCityOnDogProfile = foundDoggo.city.charAt(0).toUpperCase() + foundDoggo.city.slice(1)
      res.render('./volunteer/dog-profile', {foundDoggo, capitalizedCityOnDogProfile})
    })
})

//search available dogs
router.get('/volunteer/search/filter', (req, res) => {
  let searchedCity = req.query.city
  let fosterValue = req.query.foster
  let walkiesValue = req.query.walkies

  if (searchedCity && fosterValue === "true" && walkiesValue == undefined) {
    DoggoModel.find({city: searchedCity, foster: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, foster: true})
      })
    } 
  else if (searchedCity && fosterValue == undefined && walkiesValue === "true") {
    DoggoModel.find({city: searchedCity, walkies: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, walkies: true})
      })
    } 
  else if (searchedCity && fosterValue == "true" && walkiesValue === "true") {
    DoggoModel.find({city: searchedCity})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, foster: true, walkies: true})
      })
    } 
  else if (searchedCity && fosterValue == undefined && walkiesValue === undefined) {
    DoggoModel.find({city: searchedCity})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity})
      })
    } 
  else if (!searchedCity && !fosterValue && !walkiesValue) {
    res.render('./volunteer/search', {errorMessage: 'Choose city and filters'})
    }
  else {
    DoggoModel.find()
      .then((allDoggos) => {
        if (allDoggos.length > 0) {
          res.render('./volunteer/search', {allDoggos, searchedCity, foster: true, walkies: true})
        }
        else {
          res.render('./volunteer/search', {errorMessage: 'No dogs in your area'})
        }
      })
  }
})

//editing the volunteer form
router.get('/volunteer/:volunteerId/edit-volunteer', (req, res) => {
  let id = req.params.volunteerId

  HoomanModel.findById(id)
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

  HoomanModel.findByIdAndUpdate(id, {$set: {name, city}})
    .then(() => {
      res.redirect('/volunteer')
    })
    .catch(() => {
      res.render('error')
    })
})

//archive dog card
router.get('/volunteer/:doggoId/delete', (req, res) => {
  let volunteerId = req.session.loggedInUser._id
  let dogId = req.params.doggoId

  MessageModel.findOneAndDelete({doggo: dogId, volunteer: volunteerId})
    .then(() => {
      res.redirect('/volunteer')
    })
})

//editing volunteer password
router.post('/volunteer/edit-volunteer-verify-password', (req, res) => {
  const {submittedPassword} = req.body
  const volunteerEmail = req.session.loggedInUser.email

  HoomanModel.findOne({email: volunteerEmail})
    .then((volunteer) => {
      bcrypt.compare(submittedPassword, volunteer.password)
        .then((result) => {
          if (result) {
            res.render('./volunteer/edit-volunteer', {passwordMessage: 'Password matches!', volunteer})
          }
          else {
            res.status(500).render('./volunteer/edit-volunteer', {errorMessage: 'Password not matching', volunteer})
          }
        })
    })
})

router.post('/volunteer/edit-volunteer-password', (req, res) => {
    const {newPassword} = req.body
    const volunteerEmail = req.session.loggedInUser.email

    bcrypt.genSalt(10)
    .then((salt) => {
      bcrypt.hash(newPassword, salt)
        .then((hashedPassword) => {
          HoomanModel.findOneAndUpdate({email: volunteerEmail}, {$set: {password: hashedPassword}})
            .then((volunteer) => {
              res.render('./volunteer/edit-volunteer', {successMessage: 'Password successfully updated', volunteer})
            })
        })
    })  
})

module.exports = router;