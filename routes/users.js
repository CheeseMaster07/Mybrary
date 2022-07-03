const express = require('express');
const router = express.Router();

let users = [{name: 'Gabbe'}, {name: 'John'}]

// All users route
router
.route('/')
.get((req, res) => {
  res.render("users/index", {users: users});
})
.post((req, res) => {
  const valid = true
  if (valid) {
    users.push({name: req.body.name});
    res.redirect('/users')
  } else {
    console.log("Error")
    res.render('users/new', {name: req.body.name})
  }

})

// new user route
router.get('/new', (req, res) => {
  res.render("users/new");
})


module.exports = router

