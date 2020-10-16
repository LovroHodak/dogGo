const express = require('express');
const router  = express.Router();

var bcrypt = require('bcryptjs');

const hoomanModel = require('../models/hooman.model')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('landing');
});

// signup
router.get('/landing-signup', (req, res) => {
  res.render('./start/landing-signup');
})

// signup - owner
router.get('/signup/owner', (req, res) => {
  res.render('./start/signup-owner')
})

router.post('/signup/owner', (req, res) => {
  const {email, password, name} = req.body

  bcrypt.genSalt(10)
    .then((salt) => {
      bcrypt.hash(password, salt)
        .then((hashedPassword) => {
          hoomanModel.create({name, email, password: hashedPassword})
            .then(() => {
              res.redirect('/') //login page
            })
        })
    })


})


// signup - volunteer
router.get('/signup/volunteer', (req, res) => {
  res.render('./start/signup-volunteer'), {}
})

// login
router.get('/login', (req, res) => {
  res.render('./start/login')
})

router.post('/login', (req, res) => {
    const {email, password} = req.body

    hoomanModel.findOne({email: email})
      .then((hoomanData) => {

      })
})





module.exports = router;
