const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('question', questionSchema);