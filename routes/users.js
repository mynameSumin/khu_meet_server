// routes/users.js
const express = require('express');
const User = require('../models/user');
const univModel = require('../models/user');
const multer = require('multer');
const router = express.Router();
let map = new Map();
let users = [];

// 이미지를 저장할 경로 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // 이미지를 저장할 uploads 폴더
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // 원본 파일명으로 저장
    }
  });

  // 이미지를 업로드할 미들웨어 생성
const upload = multer({ storage: storage });

// 사용자 정보 저장
router.post('/:univ', upload.array('images', 10), async (req, res) => {
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

    // 클라이언트에서 전송한 이미지 파일 경로 추출
    if (!req.files) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }
    const imagePaths = req.files.map((file) => file.path);
    

    //새로운 사용자 생성 및 저장
    const newUser = new userModel({ email, name, college, department, studentId, introduction, mbti, imagePaths });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

// 같은 학교의 모든 사용자 정보 불러오기
router.get('/:univ', async (req, res) => {
  try{
    let { univ } = req.params;
    univ = decodeURIComponent(univ);
    const userModel = univModel(univ);
    const users = await userModel.find();
  res.status(200).json(users);
  }catch (error) {
    res.status(400).json({ message: 'Error fetching users', error });
  }
});




module.exports = router;
