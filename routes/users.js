// routes/users.js
const express = require('express');
const User = require('../models/user');
const univModel = require('../models/user');
const router = express.Router();

// 사용자 정보 저장
router.post('/:univ', async (req, res) => {
  try {
    let { univ } = req.params;
    univ = decodeURIComponent(univ);
    const userModel = univModel(univ);
    const { email, name, college, department, studentId, introduction, mbti } = req.body;
    
     // 중복된 이메일 주소를 가진 사용자가 있는지 확인
     const existingUser = await userModel.findOne({ email });
     if (existingUser) {
       return res.status(400).json({ error: 'Duplicate email address' });
     }

    //새로운 사용자 생성 및 저장
    const newUser = new userModel({ email, name, college, department, studentId, introduction, mbti });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
