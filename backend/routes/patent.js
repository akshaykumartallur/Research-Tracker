const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db'); // This should export a mysql2/promise pool or connection
const verifyToken = require('../middleware/verifyToken');

// Create patent for user
router.post('/add', verifyToken, async (req, res) => {
  const { title, description, date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO patents (title, description, date, user_id) VALUES (?, ?, ?, ?)',
      [title, description, date, userId]
    );
    return res
      .status(201)
      .json({ message: 'Patent created successfully', patentId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error in creating patent' });
  }
});

// Get all patents for the logged-in user
router.get('/getPatent', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute('SELECT * FROM patents WHERE user_id = ?', [userId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error in fetching patents' });
  }
});

// Delete patent for user
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const patentId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.execute(
      'DELETE FROM patents WHERE id = ? AND user_id = ?',
      [patentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Patent not found or you do not have permission to delete it',
      });
    }

    return res.status(200).json({ message: 'Patent deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error in deleting the patent' });
  }
});

// Update patent for user
router.put('/update/:id', verifyToken, async (req, res) => {
  const patentId = req.params.id;
  const { title, description, date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE patents SET title = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
      [title, description, date, patentId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Patent not found or you do not have permission to update it',
      });
    }

    return res.status(200).json({ message: 'Patent updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error in updating patent' });
  }
});

router.get('/search', async (req, res) => {
  const { patentNumber } = req.query;

  try {
    const searchURL = `https://developer.uspto.gov/ibd-api/v1/application/publications?searchText=${patentNumber}`;
    console.log('🔍 Searching USPTO API at:', searchURL);

    const response = await axios.get(searchURL);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching from USPTO API:', error.message);
    res.status(500).json({
      message: 'Error fetching patent details',
      error: error.message,
    });
  }
});


module.exports = router;
