// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database'); // database.js 파일을 불러옴

// 라우터 가져오기
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const questionRoutes = require('./routes/questions');
const optionRoutes = require('./routes/options');
const selectionRoutes = require('./routes/selections');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우터
app.get('/', (req, res) => {
  res.send('hello, world');
});

// 라우터 설정
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/questions', questionRoutes);
app.use('/selections', selectionRoutes);
app.use('/options', optionRoutes);

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
