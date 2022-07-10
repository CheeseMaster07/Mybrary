const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.isAuthenticated()) { console.log('logged in') } else { console.log('not logged in') }
  const reqUser = await req.user
  res.render("index", { isAuthenticated: req.isAuthenticated(), reqUser: reqUser });
})


module.exports = router