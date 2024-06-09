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

// 고유 인덱스 설정
selectionSchema.index({ user_id: 1, question_id: 1, option_id: 1 }, { unique: true });

module.exports = mongoose.model('selection', selectionSchema);