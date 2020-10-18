  const mongoose = require('mongoose')

  let hoomanSchema = new mongoose.Schema(
    {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    city: String,
    hoomanType: {
      type: String,
      enum: ['private', 'org', 'volunteer']
  },  
    myDoggos: {
      type: [Object],
  }     
},
{
  timestamps: true
}

  )

  let hoomanModel = mongoose.model('hooman', hoomanSchema)

  module.exports = hoomanModel