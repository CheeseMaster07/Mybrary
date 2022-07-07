const express = require('express');
const router = express.Router();
const Gymbro = require('../models/gymbro')
const Post = require('../models/post')

// All gymbros route
router
  .route('/')
  .get(async (req, res) => {
    if (req.query.showFilter !== undefined) {
      filter = true

    } else if (req.query.cancelFilter !== undefined) {
      filter = false

    } else { filter = false }

    try {
      let gymbros = await Gymbro.find({})
      if (req.query.name !== undefined) {
        let newGymbros = []
        gymbros.forEach(gymbro => {
          if (gymbro.name.toLowerCase().includes(req.query.name.toLowerCase())) {
            newGymbros.push(gymbro)
          }
        })
        gymbros = newGymbros
      }
      else if (req.query.ageRange !== undefined) {
        gymbros = []
        for (let i = 0; i < 10; i++) {
          gymbro = await Gymbro.find({ age: queryStringToArrayConverter(req.query.ageRange)[i] })
          gymbros.push(gymbro)
        }
        gymbros = gymbros.filter(value => {
          return value.length !== 0
        })
        gymbros = gymbros[0]
      }

      if (gymbros == undefined) {
        gymbros = await Gymbro.find({})
      }

      res.render("gymbros/index", {
        gymbros: gymbros,
        searchOptions: req.query,
        filter: filter
      });
    } catch (err) {
      res.redirect('/')
      console.error(err)
    }
  })
  .post(async (req, res) => {
    const gymbro = new Gymbro({
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
      const newGymbro = await gymbro.save()
      //res.redirect(`gymbros/${newGymbro.id}`)
      res.redirect('/gymbros')
    } catch (err) {
      res.render('gymbros/new', { gymbro: gymbro, errorMessage: "Error when creating gymbro" })
      console.log(err)
    }
  })

// new gymbro route
router.get('/new', (req, res) => {
  res.render("gymbros/new", { gymbro: new Gymbro() });
})

// Gymbro by id
router.get('/:id', (req, res) => {
  res.render("gymbros/gymbro", { gymbro: req.gymbro, posts: req.posts })
})

router.param('id', async (req, res, next, id) => {
  req.posts = await Post.find({ gymbro: id })
  req.gymbro = await Gymbro.findById(id)
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

