const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')

var bcrypt = require('bcryptjs');


///rending the dashboard
router.get('/owner', (req, res) => {
  res.render('./owner/owner-dashboard')
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
      hoomanModel.findByIdAndUpdate( hoomanData._id,{ $push: { myDoggos: [req.body] } } )
        res.render('./owner/owner-dashboard',{doggoData})
      })
})

module.exports = router;