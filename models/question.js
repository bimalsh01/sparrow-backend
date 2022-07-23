const  mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    questionName: {type:String},
    questionImage:{type:String, required:false, default:null},
    answers:[
       {text:String,
           answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
           answeredOn: { type: Date, default: Date.now, default: Date.now  },
           answeredByName: { type: String, required: false },
           answerImage: {type:String, required:false, default:null},
       }
    ],
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = mongoose.model('Questions', QuestionSchema);

