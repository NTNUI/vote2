/*
    Uses Jest as testing suite
    Uses supertest to test endpoints
*/

import request from "supertest";
import app from "../index";
import {
  activateAssemblyTest,
  createAssemblyTest,
  deactivateAssemblyTest,
  deleteAssemblyTest,
  loginTest,
  logoutTest,
} from "./utils";

let cookies = "";
export function setCookies(tempCookies: string) {
  cookies = tempCookies;
}
export function getCookies() {
  return cookies;
}

// AUTHORIZATION TESTS
describe("API test auth", () => {
  loginTest();

  logoutTest();

  test("POST/ Loggin in with wrong password: should return status code 401", (done) => {
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

// USERDATA TESTS
describe("API test userdata", () => {
  loginTest();

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

// ASSEMBLIES

// Check assemblies lies behind authorization

describe("API test: check endpoint is behind authorization", () => {
  test("POST/ assembly: without cookies", (done) => {
    request(app)
      .post("/assembly/")
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  test("PUT/ assembly: without cookies", (done) => {
    request(app)
      .put("/assembly/activation")
      .send({
        group: "sprint",
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
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
});

// Check correct behavior

describe("API test: check that assemblies does what is expected, correct behavior", () => {
  loginTest();
  createAssemblyTest();
  activateAssemblyTest();
  deactivateAssemblyTest();
  deleteAssemblyTest();
});

// Test normal requests when an assembly hasn't been created

describe("API test: check that one is limited when an assembly has not been created", () => {
  loginTest();

  test("DELETE/ assembly: try to delete nonexisting assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
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
        group: "sprint",
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
        group: "sprint",
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

// Delete a stil active assembly

describe("API test: check that one cannot delete an assembly that is still active", () => {
  loginTest();
  createAssemblyTest();
  activateAssemblyTest();

  test("DELETE/ assembly: delete created and still active assembly", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body["message"]).toBe(
          "Can't delete a active assembly, deactivate first."
        );
        done();
      });
  });

  deactivateAssemblyTest();
});

// Test activites I can do if I am not an organizer for the specific group
describe("API test: chech limited organizer rights", () => {
  loginTest();

  test("POST/ assembly: create an assembly for a group one is not organizer for", (done) => {
    request(app)
      .post("/assembly/create")
      .set("Cookie", cookies)
      .send({
        group: "turn",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe(
          "You are not authorized to create this assembly"
        );
        done();
      });
  });

  test("PUT/ assembly: activate an assembly for a group one is not organizer for", (done) => {
    request(app)
      .put("/assembly/activation")
      .set("Cookie", cookies)
      .send({
        group: "turn",
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

  test("DELETE/ assembly: delete an assembly for a group one is not organizer for", (done) => {
    request(app)
      .delete("/assembly/")
      .set("Cookie", cookies)
      .send({
        group: "turn",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body["message"]).toBe(
          "You are not authorized to delete this assembly"
        );
        done();
      });
  });

  deleteAssemblyTest();
});

// check if userDate is updated if assemblies is changed

describe("API test: check coordination between assemblies and userData", () => {
  loginTest();

  test("GET/ userdata: check no active assemblies", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["groups"][1]["organizer"]).toBe(true);
        expect(response.body["groups"][1]["hasAssembly"]).toBe(false);
        expect(response.body["groups"][1]["hasActiveAssembly"]).toBe(false);
        done();
      });
  });

  createAssemblyTest();

  test("GET/ userdata: check created assembly, but not active assembly", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["groups"][1]["organizer"]).toBe(true);
        expect(response.body["groups"][1]["hasAssembly"]).toBe(true);
        expect(response.body["groups"][1]["hasActiveAssembly"]).toBe(false);
        done();
      });
  });

  activateAssemblyTest();

  test("GET/ userdata: check created assembly, but not active assembly", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["groups"][1]["organizer"]).toBe(true);
        expect(response.body["groups"][1]["hasAssembly"]).toBe(true);
        expect(response.body["groups"][1]["hasActiveAssembly"]).toBe(true);
        done();
      });
  });

  deactivateAssemblyTest();

  test("GET/ userdata: check created assembly, but not active assembly", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["groups"][1]["organizer"]).toBe(true);
        expect(response.body["groups"][1]["hasAssembly"]).toBe(true);
        expect(response.body["groups"][1]["hasActiveAssembly"]).toBe(false);
        done();
      });
  });

  deleteAssemblyTest();

  test("GET/ userdata: check created assembly, but not active assembly", (done) => {
    request(app)
      .get("/user/userdata")
      .set("Cookie", cookies)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["groups"][1]["organizer"]).toBe(true);
        expect(response.body["groups"][1]["hasAssembly"]).toBe(false);
        expect(response.body["groups"][1]["hasActiveAssembly"]).toBe(false);
        done();
      });
  });
});

// check if votation have correct behavior

describe("API test: check if votation have correct behavior", () => {
  let voteId = "";
  loginTest();
  createAssemblyTest();

  test("CREATE/ votation: create a new votation", (done) => {
    request(app)
      .post("/votation/create")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
        caseNumber: "1.1",
        title: "Første votering",
        voteText: "Bra?",
        options: ["Ja", "Nei", "Blank"],
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully created");
        done();
      });
  });

  test("POST/ votation: get created votation", (done) => {
    request(app)
      .post("/votation/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toBe("Første votering");
        voteId = response.body[0]._id;
        done();
      });
  });

  test("PUT/ votation: edit created votation", (done) => {
    request(app)
      .put("/votation/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
        voteId: voteId,
        title: "Andre votering",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully updated");
        done();
      });
  });

  test("put/ votation: activate created votation", (done) => {
    request(app)
      .put("/votation/activate")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
        voteId: voteId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe(
          "Votation successfully activated"
        );
        done();
      });
  });

  test("put/ votation: deactivate created votation", (done) => {
    request(app)
      .put("/votation/deactivate")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe(
          "Votation successfully deactivated"
        );
        done();
      });
  });

  test("POST/ votation: get created votation", (done) => {
    request(app)
      .post("/votation/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toBe("Andre votering");
        expect(response.body[0].isFinished).toBe(true);
        done();
      });
  });

  test("DELETE/ votation: delete created and deactivated votation", (done) => {
    request(app)
      .delete("/votation/")
      .set("Cookie", cookies)
      .send({
        group: "sprint",
        voteId: voteId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully deleted");
        done();
      });
  });
});
