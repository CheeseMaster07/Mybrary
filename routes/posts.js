const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const check = require('../funcs')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'video/mp4']

// All post route
router
  .route('/')
  .get(async (req, res) => {
    const reqUser = await req.user
    try {
      let posts = await Post.find({})
      const users = await User.find({})
      const postUser = User.findById()

      if (req.query.search !== undefined && req.query.search !== " ") {
        newPosts = []
        posts.forEach(post => {
          users.forEach(user => {
            if (post.user == user.id) {
              if (user.username.toLowerCase().includes(req.query.search.toLowerCase())
                || user.name.toLowerCase().includes(req.query.search.toLowerCase())
                || post.text.toLowerCase().includes(req.query.search.toLowerCase())) {
                newPosts.push(post)
              }
            }
          })
        })
        posts = newPosts
      }

      posts = posts.sort(function (a, b) {
        if (a.createdAtDateOrdering > b.createdAtDateOrdering) {
          return -1
        }
      })
      res.render("posts/index", {
        posts: posts,
        users: users,
        searchOptions: req.query,
        isThisUser: isThisUser,
        reqUser: reqUser,
        isAuthenticated: req.isAuthenticated()
      })
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })
  .post(async (req, res) => {
    const reqUser = await req.user
    const createdAtDate = new Date(Date.now())
    const x = Date.now().toString()
    const y = createdAtDate.toISOString().split('T')[0].split('-')
    const createdAtDateOrdering = y[0] + y[1] + y[2] + x
    const post = new Post({
      user: reqUser._id,
      text: req.body.text,
      createdAtDate: createdAtDate,
      createdAtDateOrdering: createdAtDateOrdering
    })
    savePostImage(post, req.body.postImage)
    try {
      const newPost = await post.save()
      res.redirect('/posts')
    } catch (err) {
      renderNewPage(req, res, post, true)
      console.log(err)
    }
  })

// new post route
router.get('/new', check.checkAuthenticated, async (req, res) => {
  renderNewPage(req, res, new Post())
})

router
  .route('/:id')
  .put(async (req, res) => {
    let post = req.post
    try {
      post.text = req.body.text
      await post.save()
      res.redirect('/posts')
    } catch (err) {
      if (post = null) {
        res.redirect('/')
      } else {
        res.render('posts/edit', { post: post, reqUser: reqUser, isAuthenticated: req.isAuthenticated(), errorMessage: "Error when updating post" })
        console.log(err)
      }
    }
  })
  .delete(async (req, res) => {
    let post = req.post
    try {
      await post.remove()
      res.redirect('/posts')
    } catch (err) {
      if (post = null) {
        res.redirect('/')
      } else {
        res.redirect('/posts')
        console.log(err)
      }
    }
  })

router.get('/:id/edit', (req, res) => {
  res.render('posts/edit', { post: req.post, postUser: postUser, reqUser: reqUser, isAuthenticated: req.isAuthenticated() })
})

router
  .route('/:id/comments')
  .get(async (req, res) => {
    typeComment = new Comment()
    const users = await User.find({})
    let comments = await Comment.find({ post: req.post.id })
    comments = comments.sort(function (a, b) {
      if (a.createdAtDateOrdering > b.createdAtDateOrdering) {
        return -1
      }
    })
    res.render('posts/comments', {
      post: req.post,
      comments: comments,
      typeComment: typeComment,
      users: users,
      isThisUser: isThisUser,
      reqUser: reqUser,
      isAuthenticated: req.isAuthenticated()
    })
  })
  .post(async (req, res) => {
    const reqUser = await req.user
    const createdAtDate = new Date(Date.now())
    const x = Date.now().toString()
    const y = createdAtDate.toISOString().split('T')[0].split('-')
    const createdAtDateOrdering = y[0] + y[1] + y[2] + x
    const comment = new Comment({
      user: reqUser._id,
      post: req.post.id,
      text: req.body.text,
      createdAtDate: createdAtDate,
      createdAtDateOrdering: createdAtDateOrdering
    })
    try {
      const newComment = await comment.save()
      res.redirect(`/posts/${req.post.id}/comments`)
    } catch (err) {
      res.render('posts/comments', {
        post: req.post,
        comments: comments,
        typeComment: typeComment,
        users: users,
        reqUser: reqUser,
        isAuthenticated: req.isAuthenticated(),
        errorMessage: "Error when creating comment"
      })
      console.log(err)
    }
  })


async function renderNewPage(req, res, post, hasError = false) {
  try {
    const reqUser = await req.user
    const users = await User.find({})
    const params = { users: users, post: post, reqUser: reqUser, isAuthenticated: req.isAuthenticated() }
    if (hasError) params.errorMessage = "Error when creating post. You can only post images"
    res.render('posts/new', params)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
}

function savePostImage(post, postImageEncoded) {
  if (postImageEncoded == null || postImageEncoded == "") {
    console.log('ok')
    return
  }
  const postImage = JSON.parse(postImageEncoded)
  if (postImage != null && imageMimeTypes.includes(postImage.type)) {
    post.postImage = new Buffer.from(postImage.data, 'base64')
    post.postImageType = postImage.type
  }
}

function isThisUser(reqUser, user) {
  try {
    if (reqUser._id === user.id) {
      return true
    }
    return false
  } catch {
    return false
  }
}

router.param('id', async (req, res, next, id) => {
  reqUser = await req.user
  req.post = await Post.findById(id)
  postUser = await User.findById(req.post.user)
  next()
})


module.exports = router
