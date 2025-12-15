const express = require('express');
const router = express.Router();
const axios = require('axios');
const BookModel = require('../models/Book');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET external books from Google API
router.get('/books', authenticateToken, async (req, res) => {
  try {
    const { search, maxResults = 20 } = req.query;
    
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }

    console.log("Searching external books for:", search);

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&maxResults=${maxResults}`
    );

    if (!response.data.items) {
      return res.json([]);
    }

    const books = response.data.items.map(item => {
      const volumeInfo = item.volumeInfo || {};
      
      // Clean up genre
      let genre = 'Fiction';
      if (volumeInfo.categories) {
        const rawGenre = volumeInfo.categories[0];
        if (rawGenre) {
          genre = rawGenre.split(',')[0].split('/')[0].trim();
          genre = genre.substring(0, 30); // Limit length
        }
      }

      return {
        externalId: item.id,
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
        year: volumeInfo.publishedDate ? 
              new Date(volumeInfo.publishedDate).getFullYear() : 
              null,
        genre: genre,
        description: volumeInfo.description || 'No description available.',
        coverImage: volumeInfo.imageLinks ? 
                    volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') : 
                    '',
        isbn: volumeInfo.industryIdentifiers ? 
              (volumeInfo.industryIdentifiers[0]?.identifier || 'No ISBN') : 
              'No ISBN',
        pageCount: volumeInfo.pageCount,
        isExternal: true
      };
    }).filter(book => book.title !== 'Unknown Title');

    console.log(`Found ${books.length} external books`);
    res.json(books);
  } catch (err) {
    console.log("Error fetching external books:", err.message);
    
    if (err.response) {
      res.status(502).json({ 
        error: "External books service unavailable. Please try again later." 
      });
    } else if (err.request) {
      res.status(503).json({ 
        error: "Network error. Please check your internet connection." 
      });
    } else {
      res.status(500).json({ 
        error: "Internal server error while searching for books" 
      });
    }
  }
});

// POST add external book to library
router.post('/add-external-book', authenticateToken, async (req, res) => {
  try {
    console.log("Adding external book:", req.body);
    
    // Validate required fields
    if (!req.body.title || !req.body.author) {
      return res.status(400).json({ error: "Title and author are required fields" });
    }

    // Clean and prepare book data
    const bookData = {
      title: req.body.title.trim(),
      author: req.body.author.trim(),
      year: req.body.year ? parseInt(req.body.year) : null,
      genre: req.body.genre ? req.body.genre.trim() : 'Fiction',
      isbn: req.body.isbn ? req.body.isbn.trim() : 'No ISBN',
      description: req.body.description ? req.body.description.trim() : 'No description available',
      coverImage: req.body.coverImage || '',
      readingStatus: 'Want to Read',
      rating: 0,
      user: req.user._id,
      isExternal: true,
      externalId: req.body.externalId || `external-${Date.now()}`
    };

    // Check if book already exists
    const existingBook = await BookModel.findOne({
      title: { $regex: new RegExp(`^${bookData.title}$`, 'i') },
      author: { $regex: new RegExp(`^${bookData.author}$`, 'i') },
      user: req.user._id
    });

    if (existingBook) {
      return res.status(400).json({ error: "This book is already in your library" });
    }

    const book = await BookModel.create(bookData);
    console.log("External book added successfully:", book._id);
    
    res.json({
      success: true,
      message: "Book added to your library! 📚",
      book: book
    });

  } catch (err) {
    console.log("Error adding external book:", err);
    
    // MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: "Invalid book data: " + errors.join(', ') 
      });
    }
    
    // MongoDB duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "This book is already in your library" 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to add book to library. Please try again." 
    });
  }
});

module.exports = router;