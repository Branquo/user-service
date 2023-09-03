// test/user.test.js

const app = require('../server.js');  // Path to your Express app file
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const { expect } = chai;

chai.use(chaiHttp);

describe('User Service Integration Tests', () => {
  describe('POST /login', () => {

    // Successful login test
    it('should login successfully with valid credentials', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'user1', password: 'user1Pass' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    // Failed login test
    it('should fail to login with invalid credentials', (done) => {
      chai.request(app)
        .post('/login')
        .send({ username: 'invalidUser', password: 'invalidPassword' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('message', 'User not found.');
          done();
        });
    });
  });

  describe('GET /', () => {
    it('should return up and running message', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User service is up and running!');
                done();
            });
        });
    });

    describe('POST /register', () => {
        it('should register a new user', (done) => {
            request(app)
                .post('/register')
                .send({
                    username: 'testUser',
                    password: 'testPassword',
                    role: 'ordinary'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message', 'User registered successfully.');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('should login an existing user and return a token', (done) => {
            request(app)
                .post('/login')
                .send({
                    username: 'testUser',
                    password: 'testPassword'
                })
                .expect(200)
                .end((err, res) => {
                    someOrdinaryUserToken = res.body.token;
                    if (err) return done(err);
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('role', 'ordinary');
                    done();
                });
        });
    
        it('should not login with wrong credentials', (done) => {
            request(app)
                .post('/login')
                .send({
                    username: 'testUser',
                    password: 'wrongPassword'
                })
                .expect(400, done);
        });
    });
    
    describe('GET /users', () => {
        let adminToken;
    
        // Before running the tests, login as an admin to get the token
        before((done) => {
            request(app)
                .post('/login')
                .send({
                    username: 'admin',
                    password: 'adminPass'
                })
                .end((err, res) => {
                    adminToken = res.body.token;
                    done();
                });
        });
    
        it('should get all users for admin', (done) => {
            request(app)
                .get('/users')
                .set('X-API-TOKEN', adminToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    
        it('should also get all user for non-admin', (done) => {
            request(app)
                .get('/users')
                .set('X-API-TOKEN', someOrdinaryUserToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
    
    describe('PUT /users/:id/password', () => {
        let adminToken;
    
        // Before running the tests, login as an admin to get the token
        before((done) => {
            request(app)
                .post('/login')
                .send({
                    username: 'admin',
                    password: 'adminPass'
                })
                .end((err, res) => {
                    adminToken = res.body.token;
                    done();
                });
        });

        it('should not allow users to update any user password', (done) => {
            request(app)
                .put('/users/2/password')
                .set('X-API-TOKEN', someOrdinaryUserToken)
                .send({
                    newPassword: 'updatedPassword',
                    userId: '2'
                })
                .expect(403)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message', 'Access forbidden: insufficient role.');
                    done();
                });
        });
    
        it('should allow admins to update any users password', (done) => {
            request(app)
                .put('/users/2/password')
                .set('X-API-TOKEN', adminToken)
                .send({
                    newPassword: 'updatedPassword'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message', 'Password updated successfully for user.');
                    done();
                });
        });
    });
    
    describe('DELETE /users/:id', () => {
        let adminToken;
    
        // Before running the tests, login as an admin to get the token
        before((done) => {
            request(app)
                .post('/login')
                .send({
                    username: 'admin',
                    password: 'adminPass'
                })
                .end((err, res) => {
                    adminToken = res.body.token;
                    done();
                });
        });

        it('should reject delete request from non-admin users', (done) => {
            request(app)
                .delete('/users/2')
                .set('X-API-TOKEN', someOrdinaryUserToken)
                .expect(403, done);
        });

        it('should allow admins to delete a user', (done) => {
            request(app)
                .delete('/users/2')
                .set('X-API-TOKEN', adminToken)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message', 'User deleted successfully.');
                    done();
                });
        });
    });    
});

