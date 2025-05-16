const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch the full user from the database
      const user = await User.findById(decoded.id).lean();
      res.locals.user = user || null;
    } catch (err) {
      console.error('Invalid token:', err);
      res.locals.user = null;
    } 
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = jwtMiddleware;