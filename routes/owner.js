const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')

var bcrypt = require('bcryptjs');

router.get('/owner', (req, res) => {
  res.render('./owner/owner-dashboard')
})

router.get('/owner/add-a-dog', (req, res) => {
  res.render('./owner/add-a-dog-form')
})



module.exports = router;