if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport')
const methodOverride = require('method-override')


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected'))


const indexRouter = require('./routes/index')
const registrationRouter = require('./routes/registration')
const rankRouter = require('./routes/ranks')
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')

app.use('/', indexRouter)
app.use('/', registrationRouter)
app.use('/ranks', rankRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)


app.listen(process.env.PORT || 3000)