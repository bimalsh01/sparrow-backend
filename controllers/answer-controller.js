
class AnswerController{
    async postAnswer(req,res){
        let ansimg = null;

    // const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`; // random number for image name
    // if (ansPhoto) {
    //     const buffer = Buffer.from(
    //         ansPhoto.replace(/^data:image\/(png|jpg|jpeg|gif);base64./, ""),
    //         "base64"
    //     );

    //     try {
    //         const jimpResp = await jimp.read(buffer);
    //         console.log(jimpResp);
    //         jimpResp.write(__dirname + `../../storage/qna/${imagePath}`)
    //         ansimg = `http://localhost:5500/storage/qna/${imagePath}`;

    //     } catch (error) {
    //         res.status(500).json({ message: "Image processing failed.." });
    //     }
    // }
    
    
    const answer = {
        text: req.body.answer,
        answeredBy: req.user._id,
        answerImage: ansimg
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