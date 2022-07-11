const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user')
const Post = require('../models/post')
const check = require('../funcs')
const uploadPath = path.join('public', Post.postImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'video/mp4']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }

})

// All post route
router
  .route('/')
  .get(async (req, res) => {
    const reqUser = await req.user
    try {
      let posts = await Post.find({})
      const users = await User.find({})

      if (req.query.name !== undefined) {
        newPosts = []
        posts.forEach(post => {
          users.forEach(user => {
            if (post.user == user.id) {
              if (user.name.toLowerCase().includes(req.query.name.toLowerCase())) {
                newPosts.push(post)
              }
            }
          })
        })
        posts = newPosts
      }

      res.render("posts/index", { posts: posts, users: users, searchOptions: req.query, reqUser: reqUser, isAuthenticated: req.isAuthenticated() })
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })
  .post(upload.single('postImage'), async (req, res) => {
    const reqUser = await req.user
    const fileName = req.file != null ? req.file.filename : null
    const createdAtDate = new Date(Date.now()).toISOString().split('T')[0]
    const fileType = fileName != null ? req.file.mimetype.split('/')[1] : null
    console.log(req.file)
    console.log(typeof (req.file))
    const postImagePath = fileName != null ? path.join('/', Post.postImageBasePath, fileName) : null
    const post = new Post({
      user: reqUser._id,
      text: req.body.text,
      postImageName: fileName,
      createdAtDate: createdAtDate,
      postImagePath: postImagePath,
      postImageFileType: fileType
    })

    try {
      const newPost = await post.save()
      res.redirect('/posts')
    } catch (err) {
      if (post.postImageName != null) {
        removePostImage(post.postImageName)
      }
      renderNewPage(req, res, post, true)
      console.log(err)
    }
  })

// new post route
router.get('/new', check.checkAuthenticated, async (req, res) => {
  renderNewPage(req, res, new Post())
})


async function renderNewPage(req, res, post, hasError = false) {
  try {
    const reqUser = await req.user
    const users = await User.find({})
    const params = { users: users, post: post, reqUser: reqUser, isAuthenticated: req.isAuthenticated() }
    if (hasError) params.errorMessage = "Error when creating post"
    res.render('posts/new', params)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
}

function removePostImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}


module.exports = router
