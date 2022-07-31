const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    type: String,
  },
  createdAtDate: {
    type: Date,
    required: true,
  },
  createdAtDateOrdering: {
    type: String
  }
})


module.exports = mongoose.model('Comment', commentSchema)
