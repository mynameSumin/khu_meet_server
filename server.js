const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

const app = express();

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
app.use('/users', userRoutes);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
