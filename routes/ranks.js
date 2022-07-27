const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const reqUser = await req.user
  res.render("ranks", { isAuthenticated: req.isAuthenticated(), reqUser: reqUser })
})


module.exports = router