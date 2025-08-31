const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'akshaykumar',
  database: 'Research_Tracker',
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error in connecting database:', err);
    return;
  }
  console.log('Database connected successfully');
  connection.release();
});

module.exports = db;
