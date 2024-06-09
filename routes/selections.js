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

// 특정 사용자가 선택한 모든 옵션을 가져오는 함수
async function getUserSelections(userId) {
    try {
      const selections = await Selection.find({ user_id: userId });
      return selections;
    } catch (err) {
      throw err;
    }
  }
router.get('/check/:id',async (req, res)=>{
    const id = req.params.id;
    res.send(await Selection.find({user_id: id}));
})
  //특정 사용자의 선택 정보 가져오기
  async function getAllUsersSelections() {
    return await Selection.find({});
  }

  // 모든 사용자가 선택한 모든 옵션을 가져오는 함수
  async function getAllUsersSelections() {
    try {
      const allSelections = await Selection.find({});
      return allSelections;
    } catch (err) {
      throw err;
    }
  }
  
  // 두 사용자 간의 매칭된 선택지 개수를 계산
function calculateMatchCount(userSelections, otherUserSelections) {
  let matchCount = 0;

  // 사용자 선택지와 다른 사용자 선택지를 비교하여 매칭된 선택지를 찾음
  userSelections.forEach(userSelection => {
    otherUserSelections.forEach(otherUserSelection => {
      if (
        userSelection.question_id.toString() === otherUserSelection.question_id.toString() &&
        userSelection.option_id.toString() === otherUserSelection.option_id.toString()
      ) {
        matchCount++;
      }
    });
  });

  return matchCount;
}

  

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

// 사용자가 특정 질문에 응답한 적 있는지 확인
router.get('/has-answered/:user_id/:question_id', async (req, res) => {
    const { user_id, question_id } = req.params;
    try {
      const selection = await Selection.findOne({ user_id, question_id });
      if (selection) {
        res.status(200).json({ hasAnswered: true });
      } else {
        res.status(200).json({ hasAnswered: false });
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// 클라이언트로 사용자 매칭 결과를 반환하는 엔드포인트
router.get('/matching-results/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // 현재 사용자가 선택한 옵션들
      const userSelections = await getUserSelections(userId);
  
      // 모든 사용자의 선택 정보
      const allUsersSelections = await getAllUsersSelections();
  
     // 사용자별로 선택 정보를 그룹화합니다.
    const userSelectionsMap = {};
    allUsersSelections.forEach(selection => {
      if (!userSelectionsMap[selection.user_id]) {
        userSelectionsMap[selection.user_id] = [];
      }
      userSelectionsMap[selection.user_id].push(selection);
    });

    // 다른 사용자와의 매칭 결과를 저장할 배열을 초기화합니다.
    const matchingResults = [];

    // 각 사용자와의 매칭 결과를 계산합니다.
    Object.keys(userSelectionsMap).forEach(otherUserId => {
      if (otherUserId !== userId) {
        const otherUserSelections = userSelectionsMap[otherUserId];
        const matchCount = calculateMatchCount(userSelections, otherUserSelections);
        matchingResults.push({ userId: otherUserId, matchCount });
      }
    });

    // 매칭 결과를 매칭 횟수에 따라 내림차순으로 정렬합니다.
    matchingResults.sort((a, b) => b.matchCount - a.matchCount);

    // 클라이언트로 매칭 결과를 JSON 형식으로 반환합니다.
    res.json(matchingResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
