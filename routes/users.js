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
      let query = await User.find({})
      // Search by username or name
      if (req.query.name != undefined) {
        query = query.filter(user => {
          return user.username.toLowerCase().includes(req.query.name.toLowerCase()) || user.name.toLowerCase().includes(req.query.name.toLowerCase())
        })
      }
      // Filter section
      // Rank
      if (req.query.rank != undefined && req.query.rank !== '') {
        query = query.filter(user => {
          return user.rank === req.query.rank
        })
      }
      // Age
      if (req.query.lowestAge != undefined && req.query.lowestAge !== '') {
        query = query.filter(user => {
          return user.age >= req.query.lowestAge
        })
      }
      if (req.query.highestAge != undefined && req.query.highestAge !== '') {
        query = query.filter(user => {
          return user.age <= req.query.highestAge
        })
      }
      // Bodyweight
      if (req.query.lowestBodyWeight != undefined && req.query.lowestBodyWeight !== '') {
        query = query.filter(user => {
          return user.bodyWeight >= req.query.lowestBodyWeight
        })
      }
      if (req.query.highestBodyWeight != undefined && req.query.highestBodyWeight !== '') {
        query = query.filter(user => {
          return user.bodyWeight <= req.query.highestBodyWeight
        })
      }
      // Height
      if (req.query.lowestHeight != undefined && req.query.lowestHeight !== '') {
        query = query.filter(user => {
          return user.height >= req.query.lowestHeight
        })
      }
      if (req.query.highestHeight != undefined && req.query.highestHeight !== '') {
        query = query.filter(user => {
          return user.height <= req.query.highestHeight
        })
      }
      // Favorite exercise
      if (req.query.favoriteExercise != undefined && req.query.favoriteExercise !== '') {
        query = query.filter(user => {
          return user.favoriteExercise.toLowerCase().includes(req.query.favoriteExercise.toLowerCase())
        })
      }
      // Bench PR
      if (req.query.lowestBench != undefined && req.query.lowestBench !== '') {
        query = query.filter(user => {
          return user.bench >= req.query.lowestBench
        })
      }
      if (req.query.highestBench != undefined && req.query.highestBench !== '') {
        query = query.filter(user => {
          return user.bench <= req.query.highestBench
        })
      }
      // Squat PR
      if (req.query.lowestSquat != undefined && req.query.lowestSquat !== '') {
        query = query.filter(user => {
          return user.squat >= req.query.lowestSquat
        })
      }
      if (req.query.highestSquat != undefined && req.query.highestSquat !== '') {
        query = query.filter(user => {
          return user.squat <= req.query.highestSquat
        })
      }
      // Deadlift PR
      if (req.query.lowestDeadlift != undefined && req.query.lowestDeadlift !== '') {
        query = query.filter(user => {
          return user.deadlift >= req.query.lowestDeadlift
        })
      }
      if (req.query.highestDeadlift != undefined && req.query.highestDeadlift !== '') {
        query = query.filter(user => {
          return user.deadlift <= req.query.highestDeadlift
        })
      }



      /* Don't show reqUser
      try {
        users = users.filter(user => {
          return user.id !== reqUser.id
        })
      } catch { }*/
      const users = query
      res.render("users/index", {
        users: users,
        searchOptions: req.query,
        filter: filter,
        isThisUser: isThisUser,
        reqUser: reqUser,
        isAuthenticated: req.isAuthenticated()
      });
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })

// user by id
router
  .route('/:id')
  .get(async (req, res) => {
    const reqUser = await req.user
    res.render("users/user", {
      user: pageUser,
      posts: req.posts,
      reqUser: reqUser,
      isAuthenticated: req.isAuthenticated(),
      isThisUser: isThisUser
    })
  })
  .put(async (req, res) => {
    let user = pageUser
    try {
      user.name = req.body.name
      user.age = req.body.age
      user.bodyWeight = req.body.bodyWeight
      user.height = req.body.height
      user.favoriteExercise = req.body.favoriteExercise
      user.bench = req.body.bench
      user.squat = req.body.squat
      user.deadlift = req.body.deadlift
      await user.save()
      res.redirect(`/users/${user.id}`)
    } catch (err) {
      if (user = null) {
        res.redirect('/')
      } else {
        res.render('users/edit', { user: pageUser, reqUser: reqUser, isAuthenticated: req.isAuthenticated(), errorMessage: "Error when editing user" })
        console.log(err)
      }
    }
  })
  .delete((req, res) => {
    res.send('Deleted ' + pageUser.username)
  })

router.get('/:id/edit', async (req, res) => {
  const reqUser = await req.user
  res.render('users/edit', { user: pageUser, reqUser: reqUser, isAuthenticated: req.isAuthenticated() })
})

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
  req.posts = await Post.find({ user: id })
  pageUser = await User.findById(id)
  next()
})


module.exports = router

