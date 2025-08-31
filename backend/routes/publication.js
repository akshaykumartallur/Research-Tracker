const express = require('express');
const router = express.Router();
const db = require('../db'); // must export mysql2/promise pool/connection
const verifyToken = require('../middleware/verifyToken');

// Add a publication
router.post('/add', verifyToken, async (req, res) => {
  const { title, authors, description, date } = req.body;
  const userId = req.user.id;

  console.log('Incoming data:', { title, authors, description, date, userId });

  if (!title || !authors || !description || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO publications (title, authors, description, published_date, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(query, [title, authors, description, date, userId]);
    return res.status(201).json({
      message: 'Publication created successfully',
      publicationId: result.insertId,
    });
  } catch (err) {
    console.error('Database error:', err.sqlMessage || err.message);
    return res.status(500).json({ message: 'Error in creating publication' });
  }
});

// Get publications for logged-in user
router.get('/getPublications', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute('SELECT * FROM publications WHERE user_id = ?', [userId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error in fetching publications:', err);
    return res.status(500).json({ message: 'Error in fetching publications' });
  }
});

// Delete a conference
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.execute('DELETE FROM conferences WHERE id=? AND user_id=?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conference not found or no permission' });
    }

    return res.status(200).json({ message: 'Conference deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error in deleting the conference' });
  }
});

// Update a publication
router.put('/update/:id', verifyToken, async (req, res) => {
  const publicationId = req.params.id;
  const { title, authors, description, date } = req.body;
  const userId = req.user.id;

  if (!title || !authors || !description || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE publications SET title=?, authors=?, description=?, published_date=? WHERE id=? AND user_id=?',
      [title, authors, description, date, publicationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Publication not found or no permission' });
    }

    return res.status(200).json({ message: 'Publication updated successfully' });
  } catch (err) {
    console.error('Error in updating publication:', err);
    return res.status(500).json({ message: 'Error in updating publication' });
  }
});

module.exports = router;
