const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Post = require('../models/post')
const ranks = ['Newbie', 'Intermediate', 'Gymbro', 'Sarm Goblin', 'Fitness Legend']
const check = require('../funcs')

// All users route
router
  .route('/')
  .get(async (req, res) => {
    const reqUser = await req.user
    if (req.query.showFilter !== undefined) {
      filter = true

    } else if (req.query.cancelFilter !== undefined) {
      filter = false

    } else { filter = false }

    try {
      let users = await User.find({})
      if (req.query.name != undefined) {
        let newUsers = []
        users.forEach(user => {
          if (user.name.toLowerCase().includes(req.query.name.toLowerCase())) {
            newUsers.push(user)
          }
        })
        users = newUsers
      }

      // Filter section
      let filteredUsers = []
      let filtersApplied = { ageRange: false, bodyWeightRange: false }
      if (req.query.ageRange !== undefined && req.query.ageRange !== 'undefined') {
        for (let i = 0; i < 10; i++) {
          let user = await User.find({ age: queryStringToArrayConverter(req.query.ageRange)[i] })
          filteredUsers.push(user)
        }
        filteredUsers = filteredUsers.filter(value => {
          return value.length !== 0
        })
        let tempUsers = []
        filteredUsers.forEach(i => {
          tempUsers.push(i[0])
        })
        filteredUsers = tempUsers
        filtersApplied.ageRange = true
      }

      if (filteredUsers.length > 0) {
        users = filteredUsers
      }

      if (users == undefined) {
        users = await User.find({})
      }

      /* Don't show reqUser
      try {
        users = users.filter(user => {
          return user.id !== reqUser.id
        })
      } catch { }*/
      res.render("users/index", {
        users: users,
        searchOptions: req.query,
        filter: filter,
        reqUser: reqUser,
        isAuthenticated: req.isAuthenticated()
      });
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })

// user by id
router.get('/:id', async (req, res) => {
  const reqUser = await req.user
  res.render("users/user", { user: pageUser, posts: req.posts, reqUser: reqUser, isAuthenticated: req.isAuthenticated() })
})

router.param('id', async (req, res, next, id) => {
  req.posts = await Post.find({ user: id })
  pageUser = await User.findById(id)
  next()
})



function queryStringToArrayConverter(str) {
  let newArray = []
  let placeHolder
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str[i])) {
      if (!isNaN(str[i + 1])) {
        placeHolder = str[i] + str[i + 1]
        placeHolder = parseInt(placeHolder)
      } else {
        placeHolder = parseInt(str[i])
      }

      if (!isNaN(placeHolder)) {
        newArray.push(placeHolder)
      }
    }
  }

  newArray = newArray.filter((value, index) => {
    return index % 2 == 0
  })
  return newArray
}


module.exports = router

