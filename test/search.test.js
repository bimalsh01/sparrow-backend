let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

// assertion style
chai.should();

chai.use(chaiHttp);
describe("Sparrow Search API TEST", () => {

    // search route for users
    describe("POST /api/search", () => {
        it("It should search for a user", (done) => {
            chai.request(server)
                .post('/api/search')
                .send({
                    username: "alex"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.a('object');
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('username');
                    res.body[0].username.should.equal('alex');
                    done();
                });
        }).timeout(5000)
    })

    // search route for questions
    describe("POST /api/search", () => {
        it("It should search for a question", (done) => {
            chai.request(server)
                .post('/api/search-qsn')
                .send({
                    questionName: "Heuuo"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.a('object');
                    res.should.be.json;
                    done();
                });
        }).timeout(5000)
    })


})