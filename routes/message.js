const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')

//from volunteer's side - either creates a new message or comes back to an old one
router.get('/volunteer/:doggoId/messages', (req, res) => {
  let id = req.params.doggoId
  let volunteerId = req.session.loggedInUser._id

messageModel.findOne({doggo: id, volunteer: volunteerId}) 
    .then((message) =>{
        if (message) {
          res.redirect(`/volunteer/${message._id}`)
        }
        else {
          messageModel.create({doggo: id, volunteer: volunteerId})
        
          .then((newMess) => {
            res.redirect(`/volunteer/${newMess._id}`)
          })
        }
    })
})

//brings up already created conv from volunteer's side
router.get('/volunteer/:messId', (req, res) => {
  let id = req.params.messId

  messageModel.findById(id)
    .populate('doggo')
    .then((convo) => {
      res.render('./volunteer/message-volunteer', {convo})
    })
})

router.post('/volunteer/:messageId', (req, res) => {
  let messId = req.params.messageId
  let body = req.session.loggedInUser.name + " said: " + req.body.body//we named the key body, soz

  let hoomanData = req.session.loggedInUser

  messageModel.findByIdAndUpdate(messId, {$push: {body}})
    .then((message) => {
      hoomanModel.findByIdAndUpdate(hoomanData._id, {$push: {myDoggos: message.doggo}})
          .then(() => {
            res.redirect(`/volunteer/${messId}`)
          })
    })
})


//reference
//rendering the add-a-dog form
router.post('/owner/add-a-dog', (req, res) => {
  const {name, breed, size, age, gender, description, city, foster, walkies, imageUrl} = req.body

  let hoomanData = req.session.loggedInUser

  doggoModel.create( { name, breed, size, age, gender, description, city, foster, walkies, imageUrl, myOwner : hoomanData._id } )
      .then((doggoData) =>{
        hoomanModel.findByIdAndUpdate( hoomanData._id  , { $push: { myDoggos: doggoData._id } } )
        res.redirect('/owner')
      })
})


router.get('/owner/:messageId', (req, res) => {
  let id = req.params.messageId
 
  messageModel.findById(id)
  .populate('doggo')
  .populate('volunteer')
  .then((message) => {
     if (req.session.loggedInUser._id == message.doggo.myOwner) {
        res.render(`./owner/message-owner`, {message} )
     } else {
       res.redirect('/login')
     }
  })
})


router.post('/owner/:doggoId/:messageId', (req,res) => {
   let id = req.params.messageId
   let doggoId = req.params.doggoId

   doggoModel.findById(doggoId)
    .then((doggo) =>{
    let body = doggo.name + " said: " + req.body.body
    messageModel.findByIdAndUpdate(id , { $push: {body} } )
        .then(() => {
        res.redirect(`/owner/${id}`)
        })
    })


})
module.exports = router;