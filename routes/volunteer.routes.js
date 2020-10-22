const express = require('express');
const router  = express.Router();

var bcrypt = require('bcryptjs');

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')

router.get('/volunteer', (req, res) => {
  let volunteerId = req.session.loggedInUser._id

  messageModel.find({volunteer: volunteerId})
    .populate('doggo')
    .then((volunteerMessArr) => {
      console.log(volunteerMessArr)
        res.render('./volunteer/volunteer-dashboard', {volunteerMessArr, volunteerId}) 
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
    doggoModel.find({city: searchedCity, foster: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, foster: true})
      })
    } 
  else if (searchedCity && fosterValue == undefined && walkiesValue === "true") {
    doggoModel.find({city: searchedCity, walkies: true})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, walkies: true})
      })
    } 
  else if (searchedCity && fosterValue == "true" && walkiesValue === "true") {
    doggoModel.find({city: searchedCity})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity, foster: true, walkies: true})
      })
    } 
  else if (searchedCity && fosterValue == undefined && walkiesValue === undefined) {
    doggoModel.find({city: searchedCity})
      .then((allDoggos) => {
        res.render('./volunteer/search', {allDoggos, searchedCity})
      })
    } 
  else if (!searchedCity && !fosterValue && !walkiesValue) {
    res.render('./volunteer/search', {errorMessage: 'Choose city and filters'})
    }
  else {
    doggoModel.find()
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

//archive dog card
router.get('/volunteer/:doggoId/delete', (req, res) => {
  let volunteerId = req.session.loggedInUser._id
  let dogId = req.params.doggoId

  messageModel.findOneAndDelete({doggo: dogId, volunteer: volunteerId})
    .then(() => {
      res.redirect('/volunteer')
    })
})

//editing volunteer password
router.post('/volunteer/edit-volunteer-verify-password', (req, res) => {
  const {submittedPassword} = req.body
  const volunteerEmail = req.session.loggedInUser.email
  console.log(submittedPassword)
  console.log(volunteerEmail)

  hoomanModel.findOne({email: volunteerEmail})
    .then((hoomanData) => {
      bcrypt.compare(submittedPassword, hoomanData.password)
        .then((result) => {
          if (result) {
            res.render('./volunteer/edit-volunteer', {passwordMessage: 'Password matches!'})
          }
          else {
            res.status(500).render('./volunteer/edit-volunteer', {errorMessage: 'Password not matching'})
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
          hoomanModel.findOneAndUpdate({email: volunteerEmail}, {$set: {password: hashedPassword}})
            .then(() => {
              res.render('./volunteer/edit-volunteer', {successMessage: 'Password successfully updated'})
            })
        })
    })  
})

module.exports = router;