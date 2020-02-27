var expect = require("chai").expect;
var request = require("supertest");
var mongoose = require("mongoose");

//Data being sent to login route.
const userCredentials = {
  email: "Greg.tucker1@hotmail.ca",
  password: "cookie123"
};

describe("GET /api/currentuser", function() {
  //POST the userCredentials to /api/login, and expect a response of status 200.
  var server = require("../index");
  var authenticatedUser = request.agent(server);

  before(function(done) {
    authenticatedUser
      .post("/api/login")
      .send(userCredentials)
      .end(function(err, response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
  });
  //Status code 200 should have been sent.

  it("should return a 200 response if the user can log in", function(done) {
    authenticatedUser.get("/api/login", function(err, response, body) {
      response.statusCode.should.equal(200);
      body.should.include("Token");
    });
    done();
    //authenticatedUser.get("/api/login").expect(200, done);
  });
  it("should return a 401 response if the credentials are invalid", function(done) {
    request(server)
      .get("/api/currentuser")
      .expect(401, done);
  });
  after(function(done) {
    server.close(function() {
      mongoose.connection.close(done);
    });
  });
});
