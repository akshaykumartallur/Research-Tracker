const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise
const verifyToken = require('../middleware/verifyToken');

// Add an event
router.post('/add', verifyToken, async (req, res) => {
  const { title, description, location, date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !location || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO events (title, description, location, date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, location, date, userId]
    );

    return res.status(201).json({
      message: 'Event created successfully',
      eventId: result.insertId,
    });
  } catch (err) {
    console.error('Error in creating event:', err);
    return res.status(500).json({ message: 'Error in creating event' });
  }
});

// Get all events for logged-in user
router.get('/getEvents', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute('SELECT * FROM events WHERE user_id = ?', [userId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error in fetching events:', err);
    return res.status(500).json({ message: 'Error in fetching events' });
  }
});

// Delete event
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.execute('DELETE FROM events WHERE id = ? AND user_id = ?', [eventId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or no permission' });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return res.status(500).json({ message: 'Error in deleting the event' });
  }
});

// Update event
router.put('/update/:id', verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const { title, description, location, date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !location || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE events SET title = ?, description = ?, location = ?, date = ? WHERE id = ? AND user_id = ?',
      [title, description, location, date, eventId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or no permission' });
    }

    return res.status(200).json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    return res.status(500).json({ message: 'Error in updating the event' });
  }
});

module.exports = router;
