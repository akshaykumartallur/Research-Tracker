const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.use((req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
});

router.get('/adminGetAll', async (req, res) => {
  const resourceType = req.query.type;
  let sql = '';

  if (resourceType === 'patents') {
    sql = `SELECT patents.id, patents.title, patents.description,patents.date, users.username 
           FROM patents 
           JOIN users ON patents.user_id = users.id`;
  } else if (resourceType === 'publications') {
    sql = `SELECT publications.id, publications.title, publications.authors, publications.published_date, users.username 
           FROM publications 
           JOIN users ON publications.user_id = users.id`;
  } else if (resourceType === 'events') {
    sql = `SELECT events.id, events.title, events.description,events.location, events.date, users.username 
           FROM events 
           JOIN users ON events.user_id = users.id`;
  } else if (resourceType === 'conferences') {
    sql = `SELECT conferences.id, conferences.title, conferences.description,conferences.location,conferences.conference_date, users.username 
           FROM conferences 
           JOIN users ON conferences.user_id = users.id`;
  } else {
    return res.status(400).json({ message: 'Invalid resource type' });
  }

  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/entryCounts', async (req, res) => {
  const queries = {
    patents: 'SELECT COUNT(*) as count FROM patents',
    publications: 'SELECT COUNT(*) as count FROM publications',
    conferences: 'SELECT COUNT(*) as count FROM conferences',
    events: 'SELECT COUNT(*) as count FROM events',
  };

  const result = {};

  try {
    for (const [key, query] of Object.entries(queries)) {
      const [rows] = await db.query(query);
      result[key] = rows[0].count;
    }
    res.json(result);
  } catch (err) {
    console.error('Error fetching counts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/recentlyAdded', async (req, res) => {
  const sql = `
    SELECT 
      'patents' AS type, id, title, description, date AS added_date 
      FROM patents 
    UNION ALL 
    SELECT 
      'publications', id, title, authors AS description, published_date AS added_date 
      FROM publications 
    UNION ALL 
    SELECT 
      'conferences', id, title, description, conference_date AS added_date 
      FROM conferences 
    UNION ALL 
    SELECT 
      'events', id, title, description, date AS added_date 
      FROM events
    ORDER BY added_date DESC
    LIMIT 10;
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching recently added entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
