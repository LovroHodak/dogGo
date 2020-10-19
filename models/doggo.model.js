const mongoose = require('mongoose')

let doggoSchema = new mongoose.Schema(
  {
    name: String,
    breed: String,
    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "More To Love"]
    },
    age: Number,
    gender: {
      type: String,
      enum: ["Male", "Female", "N/A"]
    },
    description: {
      type: String,
      maxlength: 140
    },
    foster: Boolean,
    walkies: Boolean,
    myOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'hooman'
    },
    myMessages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'message'
    } 
  }
)

let doggoModel = mongoose.model('doggo', doggoSchema)

module.exports = doggoModel