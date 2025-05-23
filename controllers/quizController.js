const Quiz = require('../models/Quiz');



module.exports.quizDashboard_get = async (req, res) => {

  try {
    const quizzes = await Quiz.find().populate("creator");
    res.render('quizzes', {quizzes, user: res.locals.user, title: "Quiz Dashboard"});
  } catch (err) {
    res.status(500).send("Error on dashboardController");
  }
};

module.exports.createQuiz_get = async (req, res) => {
  res.render("createQuiz", { user: res.locals.user, title: "Create Quiz" });
};

module.exports.createQuiz_post = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const files = req.files || {};
    const coverImage = req.files["coverImage"] ? req.files["coverImage"][0].filename : null;
    const questionImages = req.files["questionImages"] || [];

    // questions er nå et array av spørsmål
    const formattedQuestions = Array.isArray(questions)
      ? questions.map((q, idx) => ({
          question: q.question,
          answers: Array.isArray(q.answers) ? q.answers.filter(ans => ans && ans.trim() !== "") : [],
          correct: Number(q.correct) - 1,
          image: questionImages[idx] ? questionImages[idx].filename : null
        }))
      : [];
    const quiz = new Quiz({
      title,
      description,
      questions: formattedQuestions,
      creator: res.locals.user ? res.locals.user._id : null, // Lagrer bruker ID
      coverImage
    });
    await quiz.save();
    res.redirect('/quizzes/quizDashboard');
  } catch (err) {
    console.log(err);
    res.status(500).send("Could not create quiz");
  }
};

module.exports.viewQuiz_get = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("creator");
    if (!quiz) return res.status(404).send('Quiz ikke funnet');
    // Hent spørsmål-indeks fra query, default 0
    const qIndex = Number(req.query.q) || 0;
    res.render('viewQuiz', {
      quiz,
      user: res.locals.user,
      title: quiz.title,
      qIndex,
      question: quiz.questions[qIndex]
    });
  } catch (err) {
    res.status(500).send('Serverfeil');
  }
};

module.exports.answerQuiz_post = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.questions.length) return res.status(404).send('Quiz ikke funnet');
    const qIndex = Number(req.query.q) || 0;
    const userAnswer = Number(req.body.answer);

    // Hent tidligere riktige svar fra session eller lag nytt array
    let correctAnswers = req.session.correctAnswers || [];
    let totalQuestions = quiz.questions.length;

    // Sjekk om svaret er riktig
    const isCorrect = userAnswer === quiz.questions[qIndex].correct;
    correctAnswers[qIndex] = isCorrect;

    // Lagre i session
    req.session.correctAnswers = correctAnswers;

    // Neste spørsmål eller resultat
    if (qIndex + 1 < totalQuestions) {
      // Neste spørsmål
      res.redirect(`/quizzes/${quiz._id}?q=${qIndex + 1}`);
    } else {
      // Ferdig, vis resultat og nullstill session
      const numCorrect = correctAnswers.filter(Boolean).length;
      req.session.correctAnswers = null;
      res.render('quizResult', {
        quiz,
        user: res.locals.user,
        title: 'Resultat',
        numCorrect,
        totalQuestions
      });
    }
  } catch (err) {
    res.status(500).send('Serverfeil');
  }
};

