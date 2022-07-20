const questionDb = require('./models/question')
const multer = require('multer');

// multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/qna')
    }
    , filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
// storage
const upload = multer({ storage: storage })

// router.post('/api/add-question', authMiddleware, upload.single('image'), async (req, res) => {
//     const newQuestion = new questionDb({
//         questionName: req.body.questionName,
//         postedBy: req.user._id,
//         questionImage: `http://localhost:5500/${req.f}`,
//     })
//     try {
//         const savedQuestion = await newQuestion.save();
//         res.status(200).json(savedQuestion)
//     } catch (error) {
//         res.send("Error occoured in question")
//     }
// })

class AnswerController {
    async postAnswer(req, res) {
        let ansImage = req.body.ansImage;
        console.log(req.body);

        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`; // random number for image name
        if (ansImage) {
            const buffer = Buffer.from(
                ansImage.replace(/^data:image\/(png|jpg|jpeg|gif);base64./, ""),
                "base64"
            );

            try {
                const jimpResp = await jimp.read(buffer);
                console.log(jimpResp);
                jimpResp.write(__dirname + `../../storage/qna/${imagePath}`)
                ansImage = `http://localhost:5500/storage/qna/${imagePath}`;

            } catch (error) {
                res.status(500).json({ message: "Image processing failed.." });
            }
        } else {
            ansImage = null;
        }

        const answer = {
            text: req.body.answer,
            answeredBy: req.user._id,
            answerImage: ansImage
        }

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
    }
}

module.exports = new AnswerController();