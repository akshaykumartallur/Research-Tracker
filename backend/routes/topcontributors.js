const express=require('express');
const router=express.Router();
const db=require('../db');
const verifyToken=require('../middleware/verifyToken');

// Get top contributors
router.get('/topContributors', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.username AS name,
        (
          SELECT COUNT(*) FROM patents p WHERE p.user_id = u.id
        ) +
        (
          SELECT COUNT(*) FROM publications pub WHERE pub.user_id = u.id
        ) +
        (
          SELECT COUNT(*) FROM events e WHERE e.user_id = u.id
        ) +
        (
          SELECT COUNT(*) FROM conferences c WHERE c.user_id = u.id
        ) AS contributionCount
      FROM users u
      ORDER BY contributionCount DESC
      LIMIT 10;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports=router;