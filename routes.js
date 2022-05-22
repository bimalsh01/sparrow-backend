const authController = require('./controllers/auth-controller');
const activateController = require('./controllers/activate-controller');
const authMiddleware = require('./middleware/auth-middleware');
const questionController = require('./controllers/question-controller');
const userController = require('./controllers/user-controller')
const userCtrl = require("./controllers/userCtrl")
const jsonParser = require('body-parser').json();

// importing models
const questionDb = require('./models/question')
const userDb = require('./models/user-model');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

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

// Follow and unfollow
router.put('/api/follow', authMiddleware, async (req, res) => {
    userDb.findByIdAndUpdate(req.body.followId, {
        $push:{followers:req.user._id}
    },{
        new: true // for updated records
    },(err, result) => {
        if (err) {
            return res.json({ error: err })
        }
        userDb.findByIdAndUpdate(req.user._id, {
            $push:{followings:req.body.followId},
        }, {
            new: true // for updated records
        }).then((result) => {
            res.json(result)
        }).catch(err =>{
            res.send("Error occoured in 109")
        })
        
    })
})

router.put('/api/unfollow', authMiddleware, async (req, res) => {
    userDb.findByIdAndUpdate(req.body.followId, {
        $pull:{followers:req.user._id}
    },{
        new: true // for updated records
    },(err, result) => {
        if (err) {
            return res.json({ error: err })
        }
        userDb.findByIdAndUpdate(req.user._id, {
            $pull:{followings:req.body.followId},
        }, {
            new: true // for updated records
        }).then((result) => {
            res.json(result)
        }).catch(err =>{
            res.send("Error occoured in 109")
        })
        
    })
})

// for showing all question of the user
router.get('/api/get-questions/:userId', async (req, res) => {
    try {
        await questionDb.find({ postedBy: req.params.userId })
            .then((questions) => {
                res.send(questions)
            })
    } catch (error) {
        console.log(error)
    }
})

// Search and get user
router.post('/api/search', userCtrl.searchUser)
router.get('/api/user/:id', userCtrl.getUser)

// chat api conversation
router.post('/api/chat/conversation', (req,res) =>{
    const newConversation = new Conversation({
        members:[req.body.senderId, req.body.receiverId],
    })

    try {
        const savedConversation = newConversation.save();
        res.status(200).json(savedConversation)
    } catch (error) {
        res.send("Error occoured in chat")
    }
})

router.get("/api/chat/conversation/:userId", async(req,res) =>{
    console.log(req.params.userId,"Received id")
    try {
        const conversation = await Conversation.find({
            members:{$in:[req.params.userId]},
        });
        res.status(200).json(conversation)
        console.log(conversation)
    } catch (error) {
        res.send("Error occoured while getting chat")
    }
})

// Messages
router.post("/api/chat/message", async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage)
    } catch (error) {
        res.send("Error occoured in message")
    }
})

router.get("/api/chat/message/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({ 
            conversationId: req.params.conversationId 
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})


module.exports = router;