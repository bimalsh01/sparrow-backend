let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

// assertion style
chai.should();

chai.use(chaiHttp);

describe("Sparrow Question API TEST",()=>{

    // test the /GET route
    describe("GET /api/allpost",()=>{
        it("It should GET all the questions",(done)=>{
            chai.request(server)
            .get('/api/allpost')
            .end((err,res)=>{
                res.should.have.status(201);
                res.should.be.json;
                done();
            });
        })

        it("It should RETURN 404 status code all the questions",(done)=>{
            chai.request(server)
            .get('/api/allpos')
            .end((err,res)=>{
                res.should.have.status(404);
                done();
            });
        })
    })

    // test the /GET route for question by id
    describe("GET /api/qna/:questionId",()=>{
        it("It should GET a question by ID",(done)=>{
            const questionId = "62d4fcc2b3c334ce6d2d6bf9";
            chai.request(server)
            .get('/api/qnapage/' + questionId)
            .end((err,res)=>{
                res.should.have.status(201);
                res.should.be.a('object');
                done();
            });
        })
    })

    // test the /POST route
    describe("POST /api/allpost",()=>{
        it("It should POST a question",(done)=>{
            chai.request(server)
            .post('/api/postquestion')
            .send({ 
                questionName: "What is the best way to learn NodeJS?",
                postedBy: "62d4fc7bb3c334ce6d2d6be8",
                questionImage: "https://res.cloudinary.com/kingsly/image/upload/v1559098981/qna/qna_image_1_qzqjqz.jpg"
            })
            .end((err,res)=>{
                res.should.have.status(200);
                done();
            });
        })
    })

    // test the /PUT route for question by id and update the question
    describe("PUT /api/qna/:questionId",()=>{
        it("It should UPDATE a question by ID",(done)=>{
            const questionId = "62d4fcc2b3c334ce6d2d6bf9";
            chai.request(server)
            .put('/api/qna/' + questionId)
            .send({ 
                questionName: "This is updated question",
                postedBy: "62d4fc7bb3c334ce6d2d6be8",
                questionImage: "https://res.cloudinary.com/kingsly/image/upload/v1559098981/qna/qna_image_1_qzqjqz.jpg"
            })
            .end((err,res)=>{
                res.should.have.status(200);
                done();
            });
        })
    })

    // test the /DELETE route for question by id
    describe("DELETE /api/qna/:questionId",()=>{
        it("It should DELETE a question by ID",(done)=>{
            const questionId = "62d4fcc2b3c334ce6d2d6bf9";
            chai.request(server)
            .delete('/api/qna/' + questionId)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.have.property('message').eql('Question successfully deleted');
                done();
            });
        })
    })




});
