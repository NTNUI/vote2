import request from "supertest";
import app from "../index";
import { loginTestUser, logoutTest } from "./utils";
import { cookies } from "./utils";

// USERDATA TESTS
describe("API test userdata", () => {
  loginTestUser();

  test("GET/ Get userdata: should return userdata and statuscode 200", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body["firstName"]).toBe("Sprint");
        done();
      });
  });

  logoutTest();

  test("GET/ Get userdata without cookies: should return statuscode 401", (done) => {
    request(app)
      .get("/user/userdata")
      .expect(401)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
