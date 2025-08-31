const express=require('express');
const router=express.Router();
const db=require('../db');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

router.get('/entries', verifyToken, async (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 'Patent' AS type, id, title, description, date AS entry_date FROM patents WHERE user_id = ?
    UNION ALL
    SELECT 'Event' AS type, id, title, description, date AS entry_date FROM events WHERE user_id = ?
    UNION ALL
    SELECT 'Publication' AS type, id, title, description, published_date AS entry_date FROM publications WHERE user_id = ?
    UNION ALL
    SELECT 'Conference' AS type, id, title, description, conference_date AS entry_date FROM conferences WHERE user_id = ?
    ORDER BY entry_date DESC
  `;

  try {
    const [results] = await db.query(sql, [userId, userId, userId, userId]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/stats', verifyToken, async (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM patents WHERE user_id = ?) AS patent_count,
      (SELECT COUNT(*) FROM events WHERE user_id = ?) AS event_count,
      (SELECT COUNT(*) FROM publications WHERE user_id = ?) AS publication_count,
      (SELECT COUNT(*) FROM conferences WHERE user_id = ?) AS conference_count
  `;

  try {
    const [results] = await db.query(sql, [userId, userId, userId, userId]);
    res.json(results[0]); // results is an array with one object
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
