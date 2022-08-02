const express = require('express');
const router = express.Router();
let x = 0
router.get('/', async (req, res) => {
  if (req.isAuthenticated()) { console.log('logged in') } else { console.log('not logged in') }
  const reqUser = await req.user
  res.render("index", { isAuthenticated: req.isAuthenticated(), reqUser: reqUser });
})

router.get('/x', async (req, res) => {

  res.render('x')
})




module.exports = router