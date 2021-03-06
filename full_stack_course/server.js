if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// Routes
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const BooksRouter = require('./routes/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended : false, limit : '10mb'}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABSE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', BooksRouter)

app.listen(process.env.PORT || 3000)