const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: 'user'
  },
  text: {
    type: String,
    //required: true
  },
  createdAtDate: {
    type: Date,
    required: true,
  },
  createdAtDateOrdering: {
    type: String
  },
  numOfLikes: {
    type: Number,
    required: true,
    default: 0
  },
  postImage: {
    type: Buffer,
    required: true
  },
  postImageType: {
    type: String
  }
})

postSchema.virtual('postImagePath').get(function () {
  if (this.postImage != null && this.postImageType != null) {
    return `data:${this.postImageType};charset=utf-8;base64,${this.postImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Post', postSchema)
