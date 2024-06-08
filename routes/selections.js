const express = require('express');
const router = express.Router();
const Selection = require('../models/selection');

// 선택 정보 저장
router.post('/', async (req, res) => {
  const selection = new Selection({
    user_id: req.body.user_id,
    question_id: req.body.question_id,
    option_id: req.body.option_id
  });

  try {
    const savedSelection = await selection.save();
    res.json(savedSelection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 특정 사용자에 대한 모든 선택 정보 가져오기
router.get('/user/:user_id', async (req, res) => {
  try {
    const selections = await Selection.find({ user_id: req.params.user_id });
    res.json(selections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
