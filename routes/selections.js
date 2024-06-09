const express = require('express');
const router = express.Router();
const Selection = require('../models/selection');
const mongoose = require('mongoose');

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

//특정 질문에 대한 응답 개수 가져오기
async function getSelectionCountByQuestion(questionId) {
    try {
      const result = await Selection.aggregate([
        { $match: { question_id: new mongoose.Types.ObjectId(questionId) } },
        { $group: { _id: "$option_id", count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'options',
            localField: '_id',
            foreignField: '_id',
            as: 'option'
          }
        },
        { $unwind: "$option" },
        { $project: { _id: 0, option_id: "$_id", option_text: "$option.text", count: 1 } }
      ]);
  
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

// 특정 사용자에 대한 모든 선택 정보 가져오기
router.get('/user/:user_id', async (req, res) => {
  try {
    const selections = await Selection.find({ user_id: req.params.user_id });
    res.json(selections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
//특정 질문 선택 개수 가져오기
router.get('/selection-count/:questionId', async (req, res) => {
try {
    const questionId = req.params.questionId;
    const counts = await getSelectionCountByQuestion(questionId);
    res.json(counts);
} catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
}
});

//질문에 대한 응답 수정
router.put('/update', async(req,res)=>{
    const { user_id, question_id, option_id } = req.body;
    try {
        const updatedSelection = await Selection.findOneAndUpdate(
            { user_id, question_id },
            { option_id },
            { new: true, upsert: true }
        );
          res.status(200).send('Selection updated successfully');
    } catch (error) {
        res.status(500).send('Failed to update selection');
    }
});

module.exports = router;
