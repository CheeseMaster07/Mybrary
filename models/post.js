const mongoose = require('mongoose')
const path = require('path')

const postImageBasePath = 'uploads/postImages'

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
  numOfLikes: {
    type: Number,
    required: true,
    default: 0
  },
  postImageName: {
    type: String
  },
  postImagePath: {
    type: String
  },
  postImageFileType: {
    type: String
  }


})


module.exports = mongoose.model('Post', postSchema)
module.exports.postImageBasePath = postImageBasePath