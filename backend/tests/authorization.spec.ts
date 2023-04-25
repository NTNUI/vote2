import request from "supertest";
import app from "../index";
import { loginTestUser, logoutTest } from "./utils";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.connection.close();
});

// AUTHORIZATION TESTS
describe("API test auth", () => {
  loginTestUser();

  logoutTest();

  test("POST/ Login in with wrong password: should return status code 401", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "ThisIsTheWrongPassword",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe("Unauthorized");
        done();
      });
  });
});
