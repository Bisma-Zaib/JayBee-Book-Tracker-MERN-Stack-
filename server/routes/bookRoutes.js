const express = require('express');
const router = express.Router();
const BookModel = require('../models/Book');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET all books with filtering and search
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, genre, status, sortBy } = req.query;
    let query = { user: req.user._id };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Reading status filter
    if (status && status !== 'All') {
      query.readingStatus = status;
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'title':
        sortOptions.title = 1;
        break;
      case 'author':
        sortOptions.author = 1;
        break;
      case 'year':
        sortOptions.year = -1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const books = await BookModel.find(query).sort(sortOptions);
    res.json(books);
  } catch (err) {
    console.log("Error fetching books:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single book by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findOne({ _id: id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json(book);
  } catch (err) {
    console.log("Error fetching book:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log("Creating book:", req.body);
    
    const bookData = {
      ...req.body,
      user: req.user._id
    };

    // Convert year to number if it's a string
    if (bookData.year && typeof bookData.year === 'string') {
      bookData.year = parseInt(bookData.year);
    }

    const book = await BookModel.create(bookData);
    console.log("Book created successfully:", book);
    res.json(book);
  } catch (err) {
    console.log("Error creating book:", err);
    res.status(500).json({ 
      error: err.message,
      details: "Failed to create book. Please check the data and try again."
    });
  }
});

// PUT update book
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findOneAndUpdate(
      { _id: id, user: req.user._id }, 
      {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        genre: req.body.genre,
        isbn: req.body.isbn,
        description: req.body.description,
        readingStatus: req.body.readingStatus,
        rating: req.body.rating
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json(book);
  } catch (err) {
    console.log("Error updating book:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findOneAndDelete({ _id: id, user: req.user._id });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json(book);
  } catch (err) {
    console.log("Error deleting book:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;