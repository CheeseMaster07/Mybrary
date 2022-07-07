if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected'))

const indexRouter = require('./routes/index')
const gymbroRouter = require('./routes/gymbros')
const postRouter = require('./routes/posts')

app.use('/', indexRouter)
app.use('/gymbros', gymbroRouter)
app.use('/posts', postRouter)


app.listen(process.env.PORT || 3000)