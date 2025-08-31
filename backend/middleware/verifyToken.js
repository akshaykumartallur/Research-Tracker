const jwt = require('jsonwebtoken');
const SECRET = 'mysecretkey';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token required or malformed' });
  }

  const token = authHeader.split(' ')[1]; // Extract the actual token

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
