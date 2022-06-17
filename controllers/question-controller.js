const jimp = require('jimp');
const questionDB = require('../models/question');
const requireLogin = require('../middleware/auth-middleware');


class questionController {
    async postQuestion(req, res) {

        const { questionName, qsnPhoto } = req.body;
        console.log(req.body)
        if (!questionName) {
            res.status(400).send({ message: "You must enter the question" });
            return;
        }

        let qsnimg = null;

        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`; // random number for image name
        if(qsnPhoto){
            const buffer = Buffer.from(
                qsnPhoto.replace(/^data:image\/(png|jpg|jpeg|gif);base64./, ""),
                "base64"
            );
            
            try {
                console.log("Ehllo")
                const jimpResp = await jimp.read(buffer);
                console.log(jimpResp);
                jimpResp.write(__dirname + `../../storage/qna/${imagePath}`)
                qsnimg = `http://localhost:5500/storage/qna/${imagePath}`;
    
            } catch (error) {
                
                res.status(500).json({ message: "Image processing failed.." });
            }
        }

        try {
            await questionDB.create({
                questionName: questionName,
                postedBy:req.user,
                questionImage: qsnimg, //sensative
            }).then(() => {
                res.status(201).send({ message: "Question added successfully" });
            })
        } catch (error) {
            console.log(error)
        }
    }

    

    async allPost(req,res){
        questionDB.find()
        .populate("postedBy","-password")
        .then(questions =>{
            res.json({questions})
        })
        .catch(err =>{
            res.status(500).json({message:err.message})
        })
    }

    async qnaPage(req,res){
        console.log(req.params.questionId)
        questionDB.findById(req.params.questionId)
        .populate("postedBy","-password")
        .populate("answers.answeredBy","_id fname lname answeredOn")
        .then(question =>{
            res.json({question})
        })
        .catch(err =>{
            res.status(500).json({message:err.message})
        })
    }
}

module.exports = new questionController;