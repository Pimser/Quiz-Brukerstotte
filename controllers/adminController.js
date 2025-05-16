const User = require('../models/User');
const Quiz = require('../models/Quiz');


module.exports.editQuiz_get = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).send('Quiz ikke funnet');
  res.render('editQuiz', { quiz, user: res.locals.user, title: 'Rediger Quiz' });
};

module.exports.editQuiz_post = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const formattedQuestions = Array.isArray(questions)
      ? questions.map(q => ({
          question: q.question,
          answers: Array.isArray(q.answers) ? q.answers.filter(ans => ans && ans.trim() !== "") : [],
          correct: Number(q.correct) - 1
        }))
      : [];
    await Quiz.findByIdAndUpdate(req.params.id, {
      title,
      description,
      questions: formattedQuestions
    });
    res.redirect('/quizzes/quizDashboard');
  } catch (err) {
    res.status(500).send("Kunne ikke oppdatere quiz");
  }
};

module.exports.deleteQuiz_post = async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.redirect('/quizzes/quizDashboard');
};