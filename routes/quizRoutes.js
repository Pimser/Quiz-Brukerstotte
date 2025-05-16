const express = require('express');
const router = express.Router();
const quizController = require("../controllers/quizController");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");



//Get Quiz paths:

router.get('/quizDashboard', quizController.quizDashboard_get);

router.get('/createQuiz', quizController.createQuiz_get);


//post paths:

router.post('/createQuiz', quizController.createQuiz_post);



router.get('/:id', quizController.viewQuiz_get);
router.post('/:id/answer', quizController.answerQuiz_post);

//Admin routes:
router.get("/:id/edit", adminMiddleware, adminController.editQuiz_get);
router.post("/:id/edit", adminMiddleware, adminController.editQuiz_post);

router.post("/:id/delete", adminMiddleware, adminController.deleteQuiz_post);


module.exports = router;