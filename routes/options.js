const express = require('express');
const router = express.Router();
const Option = require('../models/options');

// 선택지 생성
router.post('/', async (req, res) => {
  const option = new Option({
    question_id: req.body.question_id,
    option_text: req.body.option_text
  });

  try {
    const savedOption = await option.save();
    res.json(savedOption);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//특정 질문지에 대한 모든 선택지 가져오기
router.get('/:question_id', async (req, res) => {
  try {
    const options = await Option.find({ question_id: req.params.question_id });
    res.json(options);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
