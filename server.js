const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//라우터 가져오기
const userRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const questionRoutes = require('./routes/questions');
const optionRoutes = require('./routes/options');
const selectionRoutes = require('./routes/selections');

const app = express();

//db 연결
mongoose.connect('mongodb://127.0.0.1:27017/meeting') .then(() => {
    console.log('MongoDB 연결 성공');
})
.catch((err) => {
    console.error('MongoDB 연결 에러:', err);
});;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB");
});


app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//기본 라우터
app.get('/', (req, res)=>{
    res.send('hello, world');
})
//라우터 설정
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/questions', questionRoutes);
app.use('/selections', selectionRoutes);
app.use('/options', optionRoutes);

//서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
