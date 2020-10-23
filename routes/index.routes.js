const express = require('express');
const router  = express.Router();

var bcrypt = require('bcryptjs');

const HoomanModel = require('../models/hooman.model')

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.loggedInUser) {
    if (req.session.loggedInUser.hoomanType == "volunteer") {
      res.redirect('/volunteer')
    } else {
      res.redirect('/owner')
    }
  } else {
      res.render('landing');
  }
});

// signup
router.get('/landing-signup', (req, res) => {
    if (req.session.loggedInUser) {
    if (req.session.loggedInUser.hoomanType == "volunteer") {
      res.redirect('/volunteer')
    } else {
      res.redirect('/owner')
    }
  } else {
      res.render('./start/landing-signup');
  }

})

// signup - owner
router.get('/signup/owner', (req, res) => {
    if (req.session.loggedInUser) {
    if (req.session.loggedInUser.hoomanType == "volunteer") {
      res.redirect('/volunteer')
    } else {
      res.redirect('/owner')
    }
  } else {
      res.render('./start/signup-owner')
  }
})

// signup - volunteer
router.get('/signup/volunteer', (req, res) => {
    if (req.session.loggedInUser) {
    if (req.session.loggedInUser.hoomanType == "volunteer") {
      res.redirect('/volunteer')
    } else {
      res.redirect('/owner')
    }
  } else {
      res.render('./start/signup-volunteer')
  }

})

// signup - post for both signup forms
router.post('/signup', (req, res) => {
  const {email, password, name, hoomanType, city} = req.body

  if (!name || !email || !password || !hoomanType ) {
    if (req.body.hoomanType == "volunteer") {
    res.status(500).render('./start/signup-volunteer', {errorMessage: 'Please fill in all information'})
    return;
    }
    else {
    res.status(500).render('./start/signup-owner', {errorMessage: 'Please fill in all information'})
    return;
    }
  }

// let emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
//     if (!emailReg.test(email)) {
//       if (req.body.hoomanType == "volunteer") {
//         res.status(500).render('./start/signup-volunteer', {errorMessage: 'Please enter a valid email address'})
//         return;
//       }
//       else {
//         res.status(500).render('./start/signup-owner', {errorMessage: 'Please enter a valid email address'})
//         return;
//       }
// }

// let passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
//   if (!passwordReg.test(password)) {
//       if (req.body.hoomanType == "volunteer") {
//         res.status(500).render('./start/signup-volunteer', {errorMessage: 'Please enter a valid password'})
//         return;
//       }
//       else {
//         res.status(500).render('./start/signup-owner', {errorMessage: 'Please enter a valid password'})
//         return;
//       }
// }

  bcrypt.genSalt(10)
    .then((salt) => {
      bcrypt.hash(password, salt)
        .then((hashedPassword) => {
          HoomanModel.create({name, email, city, password: hashedPassword, hoomanType})
            .then(() => {
              res.redirect('/login') //login page
            })
        })
    })
})

// login
router.get('/login', (req, res) => {
  res.render('./start/login')
})

router.post('/login', (req, res) => {
  const {email, password} = req.body

  HoomanModel.findOne({email: email})
    .then((hoomanData) => {
      if (!hoomanData) {
        res.status(500).render('./start/login', {errorMessage: 'User does not exist'})
        return;
      }

      bcrypt.compare(password, hoomanData.password)
        .then((result) => {
          if (result) {
            req.session.loggedInUser = hoomanData
            if (hoomanData.hoomanType == "volunteer") {
                res.redirect('/volunteer')
              }
            else {res.redirect('/owner')}
          }
          else {
            res.status(500).render('./start/login', {errorMessage: 'Password not matching'})
          }
        })
        .catch(() => {
          res.status(500).render('./start/login', {errorMessage: 'Something went wrong with bcrypt compare. Try again!'})
        })
    })
})



// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
