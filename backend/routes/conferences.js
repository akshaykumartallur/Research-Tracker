const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise
const verifyToken = require('../middleware/verifyToken');

// Add a conference
router.post('/add', verifyToken, async (req, res) => {
  const { title, description, location, conference_date } = req.body;
  const userId = req.user.id;

  console.log('Incoming data:', { title, description, location, conference_date, userId });

  if (!title || !description || !location || !conference_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO conferences (title, description, location, conference_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, location, conference_date, userId]
    );

    return res.status(201).json({
      message: 'Conference data created successfully',
      conferenceId: result.insertId,
    });
  } catch (err) {
    console.error('Error creating conference:', err);
    return res.status(500).json({ message: 'Error in creating conference' });
  }
});

// Get all conferences for logged-in user
router.get('/getConferences', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute('SELECT * FROM conferences WHERE user_id = ?', [userId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching conferences:', err);
    return res.status(500).json({ message: 'Error in fetching conference data' });
  }
});

// Delete conference
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const conferenceId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.execute('DELETE FROM conferences WHERE id = ? AND user_id = ?', [conferenceId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conference not found or no permission' });
    }

    return res.status(200).json({ message: 'Conference deleted successfully' });
  } catch (err) {
    console.error('Error deleting conference:', err);
    return res.status(500).json({ message: 'Error in deleting the conference' });
  }
});

// Update conference
router.put('/update/:id', verifyToken, async (req, res) => {
  const conferenceId = req.params.id;
  const { title, description, location, conference_date } = req.body;
  const userId = req.user.id;

  console.log('Incoming data:', { title, description, location, conference_date, userId });

  if (!title || !description || !location || !conference_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE conferences SET title = ?, description = ?, location = ?, conference_date = ? WHERE id = ? AND user_id = ?',
      [title, description, location, conference_date, conferenceId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conference not found or no permission' });
    }

    return res.status(200).json({ message: 'Conference updated successfully' });
  } catch (err) {
    console.error('Error updating conference:', err);
    return res.status(500).json({ message: 'Error in updating conference' });
  }
});

module.exports = router;
