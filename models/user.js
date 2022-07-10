const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  age: {
    type: Number,
    required: true
  },

  bodyWeight: {
    type: Number,
    required: true
  },

  height: {
    type: Number,
    required: true
  },

  bench: {
    type: Number,
    required: true
  },

  squat: {
    type: Number,
    required: true
  },

  deadlift: {
    type: Number,
    required: true
  },

  favoriteExercise: {
    type: String,
    required: true
  },

  rank: {
    type: String,
    default: 'Newbie'
  }


})


module.exports = mongoose.model('user', userSchema)