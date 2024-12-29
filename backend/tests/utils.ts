import request from "supertest";
import app from "../index";

export let cookies = "";
export let accessToken = "";

export function loginTestUser() {
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
        // Store cookies for use in requests.
        cookies = response.headers["set-cookie"];
        // Extract access token from header.
        accessToken = cookies[0].split("=")[1].split(";")[0];
        done();
      });
  }, 10000);
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

export function createAssemblyTest(groupSlug: string) {
  test("POST/ assembly: create an assembly", (done) => {
    request(app)
      .post("/assembly/create")
      .set("Cookie", cookies)
      .send({
        groupSlug: groupSlug,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully created");
        done();
      });
  });
}

export function activateAssemblyTest(groupSlug: string) {
  test("PUT/ assembly: activate created assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        groupSlug: groupSlug,
        isActive: true,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully updated");
        done();
      });
  });
}

export function deactivateAssemblyTest(groupSlug: string) {
  test("PUT/ assembly: deactivate created assembly", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        groupSlug: groupSlug,
        isActive: false,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully updated");
        done();
      });
  });
}

export function deleteAssemblyTest(groupSlug: string) {
  test("DELETE/ assembly: delete created and deactivated assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        groupSlug: groupSlug,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Assembly successfully deleted");
        done();
      });
  });
}
