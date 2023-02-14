/*
    Uses Jest as testing suite
    Uses supertest to test endpoints
*/

import request from "supertest";
import app from "../index";

describe("API test suite", () => {
  test("should return status code 200", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "SprintIsTheBest",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
describe("API test suite", () => {
  test("should return status code 401", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "ThisIsTheWrongPassword",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
});
