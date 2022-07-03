const mongoose = require('mongoose')

const gymbroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  age: {
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
  }
})


module.exports = mongoose.model('Gymbro', gymbroSchema)