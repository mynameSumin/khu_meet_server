// database.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/meeting')
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 에러:', err);
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB");
});

module.exports = db;
