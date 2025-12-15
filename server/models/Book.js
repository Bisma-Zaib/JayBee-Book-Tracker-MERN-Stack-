// Book.js - Updated schema
const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  year: {
    type: Number,
    min: [1000, 'Year must be a valid year'],
    max: [new Date().getFullYear() + 5, 'Year cannot be in the distant future']
  },
  genre: {
    type: String,
    default: 'Fiction' 
  },
  isbn: String,
  description: String,
  readingStatus: {
    type: String,
    enum: ['Want to Read', 'Currently Reading', 'Completed'],
    default: 'Want to Read'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  externalId: String
}, {
  timestamps: true
})

const BookModel = mongoose.model("books", BookSchema)
module.exports = BookModel