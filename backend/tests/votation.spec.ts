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
  loginTestUser,
} from "./utils";
import { cookies } from "./utils";
import mongoose from "mongoose";
import { encrypt } from "../utils/crypto";

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API test: test CRUD operations on a vote, also testing check-in of user in to vote", () => {
  let voteId = "";
  let optionId = "";
  const testGroupSlug = "sprint";
  loginTestUser();
  createAssemblyTest(testGroupSlug);
  activateAssemblyTest(testGroupSlug);

  test("CREATE/ votation: create a new votation", (done) => {
    request(app)
      .post(`/votation/${testGroupSlug}`)
      .set("Cookie", cookies)
      .send({
        caseNumber: 1.1,
        title: "Første votering",
        description: "Bra?",
        options: ["Yes", "No", "Blank"],
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully created");
        voteId = response.body.vote_id;
        done();
      });
  });

  test("PUT/ votation: edit created votation", (done) => {
    request(app)
      .put(`/votation/${testGroupSlug}`)
      .set("Cookie", cookies)
      .send({
        voteId: voteId,
        title: "Andre votering",
        description: "Test",
        options: ["Ja", "Nei", "Absolutely"],
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully updated");
        done();
      });
  });

  test("POST/ check user into assembly to access votation", (done) => {
    request(app)
      .post("/qr/checkin")
      .set("Cookie", cookies)
      .send({
        groupSlug: testGroupSlug,
        QRData: encrypt(JSON.stringify({ ntnuiNo: 1, timestamp: Date.now() })),
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("PUT/ votation: activate created votation", (done) => {
    request(app)
      .post(`/votation/${testGroupSlug}/activate`)
      .set("Cookie", cookies)
      .send({
        voteId: voteId,
        numberParticipants: 1,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe(
          "Votation successfully activated"
        );
        done();
      });
  });

  test("POST/ user cannot check-in/check-out if a vote is active", (done) => {
    request(app)
      .post("/qr/checkin")
      .set("Cookie", cookies)
      .send({
        groupSlug: testGroupSlug,
        QRData: encrypt(JSON.stringify({ ntnuiNo: 1, timestamp: Date.now() })),
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test("POST/ votation: get active votation", (done) => {
    request(app)
      .get(`/votation/${testGroupSlug}/current`)
      .set("Cookie", cookies)
      .send()
      .then((response) => {
        expect(response.statusCode).toBe(200);
        optionId = response.body.options[0]._id;
        expect(response.body.title).toBe("Andre votering");
        done();
      });
  });

  test("POST/ votation: register vote", (done) => {
    request(app)
      .post(`/votation/${testGroupSlug}/submit`)
      .set("Cookie", cookies)
      .send({
        optionIDs: [optionId],
        voteId: voteId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("PUT/ votation: deactivate votation", (done) => {
    request(app)
      .post(`/votation/${testGroupSlug}/current/deactivate`)
      .set("Cookie", cookies)
      .send()
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe(
          "Votation successfully deactivated"
        );
        done();
      });
  });

  test("DELETE/ votation: delete votation", (done) => {
    request(app)
      .delete(`/votation/${testGroupSlug}`)
      .set("Cookie", cookies)
      .send({
        voteId: voteId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body["message"]).toBe("Votation successfully deleted");
        done();
      });
  });
  deactivateAssemblyTest(testGroupSlug);
  deleteAssemblyTest(testGroupSlug);
});
