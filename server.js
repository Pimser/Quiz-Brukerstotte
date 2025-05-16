const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const session = require("express-session");
app.use(session({
  secret: 'minhemmelighet',
  resave: false,
  saveUninitialized: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Removed incorrect import of authMiddleware from './routes/auth'
// Correctly use jwtMiddleware for handling JWT tokens globally
// Removed app.use(authMiddleware);

// Correct usage of jwtMiddleware
app.use(require('./middleware/authMiddleware'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', require('./routes/index'));
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require("./routes/quizRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/admin", adminRoutes);
app.use('/auth', authRoutes);
app.use("/quizzes", quizRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});