/*
    Uses Jest as testing suite
    Uses supertest to test endpoints
*/

import request from "supertest";
import app from "../index";

let cookies = ""; 

// AUTHORIZATION 
describe("API test auth", () => {
  test("Logging in: should return status code 200", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "SprintIsTheBest",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body['message']).toBe('Successful login')
        cookies = response.headers['set-cookie']
        done();
      });
  });  

  test("Logging out: should return 200", (done) => {
    request(app)
      .get("/auth/logout")
      .end((err, res) => {
        if (err) return done(err)
        expect(res.statusCode).toBe(200)
        expect(res.body['message']).toBe('Successfully logged out')
        done()
      })
  });

  test("Loggin in with wrong password: should return status code 401", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "ThisIsTheWrongPassword",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body['message']).toBe('Unauthorized');
        done();
      });
  });
});


// USERDATA TEST
describe("API test userdata", () => {
    test("Logging in: should return status code 200", (done) => {
      request(app)
        .post("/auth/login")
        .send({
          phone_number: "+4799994444",
          password: "SprintIsTheBest",
        })
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body['message']).toBe('Successful login')
          cookies = response.headers['set-cookie']
          done();
        });
    });  
    
    test("Get userdata: should return userdata and statuscode 200", (done) => {
        request(app)
          .get("/user/userdata")
          .set("Cookie", cookies )
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body["firstName"]).toBe("Sprint")
            expect(res.body["groups"][0]['role']).toBe("member")
            done()
          })
      });

      test("Logging out: should return 200", (done) => {
        request(app)
          .get("/auth/logout")
          .end((err, res) => {
            if (err) return done(err)
            expect(res.statusCode).toBe(200)
            expect(res.body['message']).toBe('Successfully logged out')
            console.log(res.body['message'])
            done()
          })
      });
      test("Get userdata without cookies: should return statuscode 401", (done) => {
        request(app)
          .get("/user/userdata")
          .expect(401)
          .end((err, res) => {
            if (err) return done(err)
            done()
          })
      });
  });
  


