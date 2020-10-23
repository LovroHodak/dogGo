const express = require('express');
const router  = express.Router();

const HoomanModel = require('../models/hooman.model')
const DoggoModel = require('../models/doggo.model')
const MessageModel = require('../models/message.model')

//from volunteer's side - either creates a new message or comes back to an old one
router.get('/volunteer/:doggoId/messages', (req, res) => {
  let id = req.params.doggoId
  let volunteerId = req.session.loggedInUser._id

  MessageModel.findOne({doggo: id, volunteer: volunteerId}) 
    .then((message) => {
        if (message) {
          res.redirect(`/volunteer/${message._id}`)
        }
        else {
          MessageModel.create({doggo: id, volunteer: volunteerId})
          .then((newMess) => {
            res.redirect(`/volunteer/${newMess._id}`)
          })
        }
    })
})


//from volunteer's side - brings up already created convo
router.get('/volunteer/:messId', (req, res) => {
  let id = req.params.messId

  MessageModel.findById(id)
    .populate('volunteer') 
    .populate('doggo')
    .then((convo) => {
      if (req.session.loggedInUser._id == convo.volunteer._id) {
        res.render('./volunteer/message-volunteer', {convo})
      } else {
        res.redirect('/login')
      }
    })
})

router.post('/volunteer/:messageId', (req, res) => {
  let messId = req.params.messageId
  let body = req.session.loggedInUser.name + " said: " + req.body.body//we named the key body, soz

  let hoomanData = req.session.loggedInUser

  MessageModel.findByIdAndUpdate(messId, {$push: {body}})
    .then((message) => {
      HoomanModel.findByIdAndUpdate(hoomanData._id, {$push: {myDoggos: message.doggo}})
          .then(() => {
            res.redirect(`/volunteer/${messId}`)
          })
    })
})

//from owner's side - see a dog's convo inbox
router.get('/owner/:doggoId/messages', (req, res) => {
let id = req.params.doggoId

  MessageModel.find({doggo:id})
    .populate('volunteer')
    .then((messageArr) => {
      res.render('./owner/messages',{messageArr})
    })
})

//from owner's side - see a dog's inbox (GET)
router.get('/owner/:messageId', (req, res) => {
  let id = req.params.messageId
 
  MessageModel.findById(id)
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

//from owner's side - see a dog's inbox (POST)
router.post('/owner/:doggoId/:messageId', (req,res) => {
   let id = req.params.messageId
   let doggoId = req.params.doggoId

   DoggoModel.findById(doggoId)
    .then((doggo) => {
      let body = doggo.name + " said: " + req.body.body
      MessageModel.findByIdAndUpdate(id , {$push: {body}} )
        .then(() => {
        res.redirect(`/owner/${id}`)
        })
    })
})

//archive a dog's convo with a volunteer
router.get('/owner/:doggoId/:messId/delete', (req, res) => {
  let doggoId = req.params.doggoId
  let messageId = req.params.messId

  MessageModel.findByIdAndDelete(messageId)
    .then(() => {
      res.redirect(`/owner/${doggoId}/messages`)
    })
})

module.exports = router;