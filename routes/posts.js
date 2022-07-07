const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gymbro = require('../models/gymbro')
const Post = require('../models/post')
const uploadPath = path.join('public', Post.postImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
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
    try {
      let posts = await Post.find({})
      const gymbros = await Gymbro.find({})

      if (req.query.name !== undefined) {
        newPosts = []
        posts.forEach(post => {
          gymbros.forEach(gymbro => {
            if (post.gymbro == gymbro.id) {
              if (gymbro.name.toLowerCase().includes(req.query.name.toLowerCase())) {
                newPosts.push(post)
              }
            }
          })
        })
        posts = newPosts
      }

      res.render("posts/index", { posts: posts, gymbros: gymbros, searchOptions: req.query })
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })
  .post(upload.single('postImage'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const createdAtDate = new Date(Date.now()).toISOString().split('T')[0]
    const postImagePath = path.join('/', Post.postImageBasePath, fileName)
    const post = new Post({
      gymbro: req.body.gymbro,
      text: req.body.text,
      postImageName: fileName,
      createdAtDate: createdAtDate,
      postImagePath: postImagePath
    })

    try {
      const newPost = await post.save()
      res.redirect('/posts')
    } catch (err) {
      if (post.postImageName != null) {
        removePostImage(post.postImageName)
      }
      renderNewPage(res, post, true)
      console.log(err)
    }
  })

// new post route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Post())
})


async function renderNewPage(res, post, hasError = false) {
  try {
    const gymbros = await Gymbro.find({})
    const params = { gymbros: gymbros, post: post }
    if (hasError) params.errorMessage = "Error when creating post"
    res.render('posts/new', params)
  } catch (err) {
    res.redirect('/')
  }
}

function removePostImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}


module.exports = router
