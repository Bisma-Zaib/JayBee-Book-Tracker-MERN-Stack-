const express = require('express');
const router = express.Router();
const BookModel = require('../models/Book');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET book statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await BookModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: '$readingStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalBooks = await BookModel.countDocuments({ user: req.user._id });
    const genreStats = await BookModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      statusStats: stats,
      totalBooks,
      genreStats: genreStats.slice(0, 5) // Top 5 genres
    });
  } catch (err) {
    console.log("Error fetching stats:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update reading status and rating
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { readingStatus, rating } = req.body;

    const updateData = {};
    if (readingStatus) updateData.readingStatus = readingStatus;
    if (rating !== undefined) updateData.rating = rating;

    const book = await BookModel.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    console.log("Error updating book status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;