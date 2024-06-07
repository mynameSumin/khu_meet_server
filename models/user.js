const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    studentId: { type: String, required: true },
    introduction: { type: String, required: true },
    mbti: { type: String, required: true },
    imagePaths: { type: [String], default: []}
});

const univModel = (univName) => {
    if (mongoose.models[univName]) {
        return mongoose.models[univName];
    } else {
        return mongoose.model(univName, userSchema);
    }
}

module.exports = univModel;
