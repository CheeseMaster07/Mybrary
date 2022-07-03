const express = require('express');
const router = express.Router();


let gymbros = [{name: 'Gabbe'}, {name: 'John'}]

// All gymbros route
router
.route('/')
.get((req, res) => {
  res.render("gymbros/index", {gymbros: gymbros});
})
.post((req, res) => {
  const valid = true
  if (valid) {
    gymbros.push({name: req.body.name});
    res.redirect('/gymbros')
  } else {
    console.log("Error")
    res.render('gymbros/new', {name: req.body.name})
  }

})

// new gymbro route
router.get('/new', (req, res) => {
  res.render("gymbros/new");
})


module.exports = router

