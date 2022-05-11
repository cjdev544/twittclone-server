const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  banner: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  biography: {
    type: String,
    trim: true,
  },
  ubication: {
    type: String,
    trim: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('User', userSchema)
