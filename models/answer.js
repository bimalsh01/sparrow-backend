const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions', required:true },

    createdAt: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model('Answers', AnswerSchema);