const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')

var bcrypt = require('bcryptjs');

router.get('/volunteer', (req, res) => {
  res.render('./volunteer/volunteer-dashboard')
})

module.exports = router;