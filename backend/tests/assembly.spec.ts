import request from "supertest";
import app from "../index";
import {
  activateAssemblyTest,
  createAssemblyTest,
  deactivateAssemblyTest,
  deleteAssemblyTest,
  loginTestUser,
} from "./utils";
import { cookies } from "./utils";
import mongoose from "mongoose";

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API test: Test assembly cannot be accessed without authorization", () => {
  test("POST/ assembly: without cookies", (done) => {
    request(app)
      .post("/assembly/")
      .send({
        group: "turn",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test("PUT/ assembly: without cookies", (done) => {
    request(app)
      .put("/assembly/activation")
      .send({
        group: "turn",
        isActive: false,
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  test("DELETE/ assembly: without cookies", (done) => {
    request(app)
      .delete("/assembly/")
      .send({
        group: "turn",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
});

// Test normal requests when an assembly hasn't been created
describe("API test: check that one is limited when an assembly has not been created", () => {
  loginTestUser();

  test("DELETE/ assembly: try to delete nonexisting assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: "turn",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body["message"]).toBe(
          "No assembly with the given ID found"
        );
        done();
      });
  });

  test("PUT/ assembly: activate nonexisting assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        group: "turn",
        isActive: true,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body["message"]).toBe(
          "No assembly with the given ID found"
        );
        done();
      });
  });

  test("PUT/ assembly: deactivate nonexisting assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        group: "turn",
        isActive: false,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body["message"]).toBe(
          "No assembly with the given ID found"
        );
        done();
      });
  });
});

describe("API test: check that one cannot delete an assembly that is still active", () => {
  const testGroupSlug = "turn";
  loginTestUser();
  createAssemblyTest(testGroupSlug);
  activateAssemblyTest(testGroupSlug);

  test("DELETE/ assembly: delete created and still active assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: testGroupSlug,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body["message"]).toBe(
          "Can't delete a active assembly, deactivate first."
        );
        done();
      });
  });

  deactivateAssemblyTest(testGroupSlug);
  deleteAssemblyTest(testGroupSlug);
});

describe("API test: Test to edit assembly where user is not an organizer", () => {
  loginTestUser();

  test("POST/ assembly: create an assembly for a group user is not organizer for", (done) => {
    request(app)
      .post("/assembly/create")
      .set("Cookie", cookies)
      .send({
        group: "triatlon",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe(
          "You are not authorized to create this assembly"
        );
        done();
      });
  });

  test("PUT/ assembly: activate an assembly for a group user is not organizer for", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        group: "triatlon",
        isActive: "true",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe(
          "You are not authorized to change activation for this assembly"
        );
        done();
      });
  });

  test("DELETE/ assembly: delete an assembly for a group user is not organizer for", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: "triatlon",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe(
          "You are not authorized to delete this assembly"
        );
        done();
      });
  });
});
