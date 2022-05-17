const authController = require('./controllers/auth-controller');
const activateController = require('./controllers/activate-controller');
const authMiddleware = require('./middleware/auth-middleware');
const questionController = require('./controllers/question-controller');
const userController = require('./controllers/user-controller')
const userCtrl = require("./controllers/userCtrl")
const jsonParser = require('body-parser').json();

// ANswer models
const questionDb = require('./models/question')

const router = require('express').Router();

router.post('/api/send-otp', authController.sendOtp);
router.post('/api/verify-otp/', authController.verifyOtp);
router.post('/api/activate/', authMiddleware, activateController.activate);
router.post('/api/login/', authController.login);
router.get('/api/refresh', authController.refresh);
router.post('/api/logout', authController.logout);
router.post('/api/update-profile', userController.updateProfile);

// Questions
router.post('/api/questions', authMiddleware, questionController.postQuestion)
router.get("/api/allpost", questionController.allPost)
router.get("/api/qnapage/:questionId", questionController.qnaPage)

// Answers
router.post('/api/answer', authMiddleware, async (req, res) => {
    const answer = {
        text: req.body.answer,
        answeredBy: req.user._id
    }
    console.log(answer)
    questionDb.findByIdAndUpdate(req.body.questionId, {
        $push: { answers: answer }
    })
        .populate("answers.answeredBy", "_id fname")
        .exec((err, result) => {
            if (err) {
                return res.status(500).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

// for getting answers according to question id
router.get('/api/get-answers/:questionId', async (req, res) => {
    try {
        await answerDb.find({ questionId: req.params.questionId })
            .populate("answeredBy", "-password")
            .then((answers) => {
                res.send(answers)
            })

    } catch (error) {
        console.log(error)
    }
})

router.put('/api/like',authMiddleware, async (req, res) => {
    console.log(req.body.questionId)

    const question = await questionDb.findById(req.body.questionId);
    
    if(question.likes.includes(req.user._id)){
        console.log("already liked")
        return;
    }

    question.likes.push(req.user._id);
    question.save();
    res.json(question)
})

router.put('/api/unlike', (req, res) => {
    questionDb.findByIdAndUpdate(req.body.questionId, {
        $pull: { likes: req.user._id }
    },{
        new: true // for updated records
    }).exec((err, result) => {
        if (err) {
            return res.json({ error: err })
        }
        else{
            res.json(result)
        }
    })
})

// for showing all question of the user
router.get('/api/get-questions/:userId', async (req, res) => {
    console.log(req.params.userId, "data from here")
    try {
        await questionDb.find({ postedBy: req.params.userId })
            .then((questions) => {
                res.send(questions)
            })
    } catch (error) {
        console.log(error)
    }
})


// http://localhost:5500/api/get-answer/627bc5e535b28ea5518ffc30

// http://localhost:5500/api/get-answer/627bc5e535b28ea5518ffc30


// Search and get user
router.post('/api/search', userCtrl.searchUser)
router.get('/api/user/:id', userCtrl.getUser)


module.exports = router;