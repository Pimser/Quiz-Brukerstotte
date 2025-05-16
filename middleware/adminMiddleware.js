const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const adminMiddleware = async (req, res, next) => {
    if (res.locals.user && res.locals.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Du har ikke tilgang til admin.');
}

module.exports = adminMiddleware;

