import request from "supertest";
import app from "../index";
import { getCookies, setCookies } from "./endpoints.spec";

export function loginTest() {
  test("POST/ login: should return status code 200", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        phone_number: "+4799994444",
        password: "SprintIsTheBest",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Successful login");
        const cookies = response.headers["set-cookie"];
        setCookies(cookies);
        done();
      });
  });
}

export function logoutTest() {
  test("GET/ Logging out: should return 200", (done) => {
    request(app)
      .get("/auth/logout")
      .end((err, res) => {
        if (err) return done(err);
        expect(res.statusCode).toBe(200);
        expect(res.body["message"]).toBe("Successfully logged out");
        done();
      });
  });
}

export function createAssemblyTest() {
  test("POST/ assembly: create an assembly", (done) => {
    request(app)
      .post("/assembly/create")
      .set("Cookie", getCookies())
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully created");
        done();
      });
  });
}

export function activateAssemblyTest() {
  test("PUT/ assembly: activate created assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", getCookies())
      .send({
        group: "sprint",
        isActive: true,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully updated");
        done();
      });
  });
}

export function deactivateAssemblyTest() {
  test("PUT/ assembly: deactivate created assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", getCookies())
      .send({
        group: "sprint",
        isActive: false,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully updated");
        done();
      });
  });
}

export function deleteAssemblyTest() {
  test("DELETE/ assembly: delete created and deactivated assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", getCookies())
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully deleted");
        done();
      });
  });
}
