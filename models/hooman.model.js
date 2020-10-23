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
    city: {
      type: String,
      enum: ['Amsterdam', 'Berlin', 'Dublin', 'Hamburg', 'Lisbon', 'Ljubljana', 'London', 'Madrid', 'Paris', 'Prague', 'Rome', 'Stockholm', 'Vilnius']
    },
    hoomanType: {
      type: String,
      enum: ['private', 'org', 'volunteer']
  },  
    myDoggos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'doggo'}]
},
{
  timestamps: true
}

  )

  let HoomanModel = mongoose.model('hooman', hoomanSchema)

  module.exports = HoomanModel