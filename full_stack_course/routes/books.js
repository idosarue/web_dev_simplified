const express = require('express')
const author = require('../models/author')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest : uploadPath,
    fileFilter : (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// All Books Route
router.get('/', async (req, res) => {
    res.send('all books')
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const requestBody = req.body
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title : requestBody.title,
        author : requestBody.author,
        description : requestBody.description,
        publishDate : new Date(requestBody.publishDate),
        pageCount : requestBody.pageCount,
        coverImageName : fileName
    })
    try {
        await book.save()
        res.redirect('/books')
    } catch {
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book : book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)

    } catch {
        res.redirect('/books')
    }
}


module.exports = router