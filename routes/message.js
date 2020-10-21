const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')


router.get('/volunteer/:doggoId/messages', (req, res) => {
  let id = req.params.doggoId
  let volunteerId = req.session.loggedInUser._id

  console.log(id)
  console.log(volunteerId)

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
//if statement if messageid already exists
//redirect to next one



})

router.get('/volunteer/:messId', (req, res) => {
  let id = req.params.messId

  messageModel.findById(id)
    .populate('doggo')
    .then((convo) => {
      console.log(convo)
      res.render('./volunteer/message-volunteer', {convo})
    })
})

router.post('/volunteer/:messageId', (req, res) => {
  let messId = req.params.messageId
  let body = req.session.loggedInUser.name + " said: " + req.body.body//we named the key body, soz

  messageModel.findByIdAndUpdate(messId, {$push: {body}})
    .then(() => {
      res.redirect(`/volunteer/${messId}`)
    })
})



router.get('/owner/:messageId', (req, res) => {
  let id = req.params.messageId
 
  messageModel.findById(id)
  .populate('doggo')
  .populate('volunteer')
  .then((message) => {
    res.render(`./owner/message-owner`, {message} )
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