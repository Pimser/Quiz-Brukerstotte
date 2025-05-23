const express = require('express');
const router = express.Router();
const quizController = require("../controllers/quizController");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  }, 
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  }
});
const upload = multer({ storage: storage });

router.post(
  "/createQuiz",
  upload.fields([
    {name: "coverImage", maxCount: 1},
    { name: "questionImages" }
  ]),
  quizController.createQuiz_post
);


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