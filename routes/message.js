const express = require('express');
const router  = express.Router();

const hoomanModel = require('../models/hooman.model')
const doggoModel = require('../models/doggo.model')
const messageModel = require('../models/message.model')


router.get('/volunteer/:doggoId/messages', (req, res) => {
  // let id = req.params.doggoId

  // doggoModel.findById(id)
  //   .then((foundDoggo) => {
  //     res.render('./volunteer/message-volunteer', {foundDoggo})
  //   })

  let id = req.params.doggoId
  let volunteerId = req.session.loggedInUser._id

  console.log(id)
  console.log(volunteerId)

//if statement if messageid already exists
//redirect to next one
  messageModel.create({doggo: id, volunteer: volunteerId})
    .then((newMess) => {
      res.redirect(`/volunteer/${newMess._id}`)
    })

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
  let body = req.body.body//we named the key body, soz

  messageModel.findByIdAndUpdate(messId, {$push: {body}})
    .then(() => {
      res.redirect(`/volunteer/${messId}`)
    })
})




module.exports = router;