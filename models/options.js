const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true
    },
    option_text:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('option', optionSchema);