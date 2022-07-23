let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

// assertion style
chai.should();

chai.use(chaiHttp);

describe("Sparrow EXTRA API TEST",()=>{

    // test the base route
    describe("GET /api/base",()=>{
        it("It should get the base route",(done)=>{
            chai.request(server)
                .get('/')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Welcome to Sparrow');
                    done();
                });
        }).timeout(5000)
    })

    // add to favorite route
    describe("POST /api/addfav",()=>{
        it("It should add a question to a user's favorite list",(done)=>{
            chai.request(server)
                .post('/api/addfav')
                .send({
                    id: "62d4fc7bb3c334ce6d2d6be8",
                    questionId: "62d4fcc2b3c334ce6d2d6bf9"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    done();
                }).timeout(5000)
        }).timeout(5000)
    })

    // CREATE A CHAT CONVERSATION
    describe("POST /api/chat/conversation",()=>{
        it("It should create a chat conversation",(done)=>{
            chai.request(server)
                .post('/api/chat/conversation')
                .send({
                    senderId: "62d4fc7bb3c334ce6d2d6be8",
                    receiverId: "62d9787c59b47351985b6405"
                })
                .end((err,res)=>{
                    res.should.have.status(200);
                    done();
                }).timeout(5000)
        }).timeout(5000)
    })
})