const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/auth.config');

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey, {
    expiresIn: 86400,
  });
}

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token de autenticación.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido.' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
};
