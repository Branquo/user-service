const request = require('supertest');
const chai = require('chai');
const app = require('../server.js');

const expect = chai.expect;

describe('Server Start', () => {
    let server;

    before((done) => {
        server = app.listen(4000, done);
    });

    after((done) => {
        server.close(done);
    });

    it('should start and show the up and running message', (done) => {
        request(server)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).to.have.property('message', 'User service is up and running!');
                done();
            });
    });
});
