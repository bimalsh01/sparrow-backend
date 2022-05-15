const router = require('express').Router();
const authController = require('../controllers/auth-controller');
const activateController = require('../controllers/activate-controller');
const authMiddleware = require('../middleware/auth-middleware');

const questionRouter = require('./Question');
const answerRouter = require('./Answer');

router.get('/', (req,res) =>{
    res.send("Working")
})

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp/', authController.verifyOtp);
router.post('/activate/', authMiddleware,activateController.activate);
router.post('/login/', authController.login);


router.use('/questions',questionRouter)
router.use('/answers',answerRouter)

module.exports = router;


