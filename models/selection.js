const mongoose = require('mongoose');

//누가, 어떤 질문에 어떤 선택지를 선택했는지 저장
const selectionSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    option_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'option',
        required: true
    }
});

module.exports = mongoose.model('selection', selectionSchema);