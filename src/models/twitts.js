const mongoose = require('mongoose')

const Schema = mongoose.Schema

const twittsSchema = Schema({
  message: {
    type: String,
    trim: true,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('Twitt', twittsSchema)
