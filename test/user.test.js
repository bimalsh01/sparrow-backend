let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

// assertion style
chai.should();

chai.use(chaiHttp);

describe("Sparrow User API TEST", () => {

    // test the login route
    describe("POST /api/login", () => {
        it("It should login a user", (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    phone: "999",
                    password: "abc"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                });
        })
    })

    // test the send otp route
    describe("POST /api/sendotp", () => {
        it("It should send an otp to a user", (done) => {
            chai.request(server)
                .post('/api/send-otp')
                .send({
                    phone: "9817397045"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        }).timeout(5000)
    })

    // test change password route
    describe("POST /api/change-password", () => {
        it("It should change a user's password", (done) => {
            chai.request(server)
                .post('/api/update-password')
                .send({
                    id: "62dc08f9215fba30f52f3aa8",
                    oldPassword: "abc",
                    newPassword: "abc"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        }).timeout(5000)
    })

})