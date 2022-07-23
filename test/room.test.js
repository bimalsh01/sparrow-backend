let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

// assertion style
chai.should();

chai.use(chaiHttp);

describe("Sparrow ROOM API TEST", () => {

    // get all rooms
    describe("GET /api/rooms", () => {
        it("It should get all rooms", (done) => {
            chai.request(server)
                .get('/api/rooms')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        }).timeout(5000)
    })

    // create a room 
    describe("POST /api/rooms", () => {
        it(
            "It should create a room", (done) => {
                chai.request(server)
                    .post('/api/create-room')
                    .send({
                        topic: "We are discussing about the topic",
                        roomType: "OPEN",
                        ownerId: "62dae6fb1ff693410c744658",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Room created successfully');
                        done();
                    })
            })

        }).timeout(5000)
    })