const express = require('express');
const router = express.Router();
const Question = require('../models/questions');

//질문지 생성
router.post('/', async (req, res)=>{
    const question = new Question({
        question_text : req.body.question_text
    });
    try {
        const savedQuestion = await question.save();
        res.json(savedQuestion);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
})

// 모든 질문지 가져오기
router.get('/', async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
