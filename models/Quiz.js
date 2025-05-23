const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  image: String
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  coverImage: String
});

module.exports = mongoose.model('Quiz', quizSchema);