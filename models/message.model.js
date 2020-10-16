const mongoose = require('mongoose')

let messageSchema = new mongoose.Schema(
  {
  body: [String],
  doggo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doggo'},
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hooman'}
  }
)

let messageModel = mongoose.model('message', messageSchema)

module.exports = messageModel