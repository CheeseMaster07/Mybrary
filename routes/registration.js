const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user')
const ranks = ['Newbie', 'Intermediate', 'Gymbro', 'Sarm Goblin', 'Fitness Legend']
const passport = require('passport')
const check = require('../funcs')
const initializePassport = require('../passport-config');

initializePassport(passport,
  async (username) => {
    let user = await User.find({ username: username })
    return user[0]
  },
  async (id) => {
    const user = await User.find({ id: id })
    return user[0]
  })


router
  .route('/register')
  .get((req, res) => {
    res.render("registration/register");
  })
  .post(async (req, res) => {
    if (req.body.register !== undefined) {
      const existingUsers = await User.find({ username: req.body.username })
      if (existingUsers.length > 0) {
        res.render("registration/register", { errorMessage: 'Username is already in use' });
      } else {
        username = req.body.username
        hashedPassword = await bcrypt.hash(req.body.password, 10)
        res.render("registration/infoForm", { user: new User() })
      }
    }
    else if (req.body.infoForm != undefined) {
      const user = new User({
        username: username,
        password: hashedPassword,
        rank: ranks[0],
        name: req.body.name,
        age: req.body.age,
        bodyWeight: req.body.bodyWeight,
        height: req.body.height,
        favoriteExercise: req.body.favoriteExercise,
        bench: req.body.bench,
        squat: req.body.squat,
        deadlift: req.body.deadlift
      })

      try {
        const newUser = await user.save()
        //res.redirect(`users/${newUser.id}`)
        res.redirect('/users')
      } catch (err) {
        res.render('registration/infoForm', { user: user, errorMessage: "Error when creating user" })
        console.log(err)
      }
    }

  })

router
  .route('/login')
  .get(check.checkNotAuthenticated, (req, res) => {
    res.render("registration/login");
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))


router.delete('/logout', function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router