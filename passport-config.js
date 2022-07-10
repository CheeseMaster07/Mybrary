const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')



function initialze(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    let user = await getUserByUsername(username)


    if (user == null) {
      return done(null, false, { message: 'No user with that username exist' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password is incorrect' })
      }
    } catch (err) {
      return done(err)
    }
  }
  passport.use(new LocalStrategy({}, authenticateUser))

  passport.serializeUser((user, done) => { return done(null, user) })
  passport.deserializeUser((user, done) => {
    return done(null, user)
  })
}


module.exports = initialze