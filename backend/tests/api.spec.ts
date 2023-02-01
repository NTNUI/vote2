/*
    Uses Jest as testing suite
    Uses supertest to test endpoints
*/

import request from 'supertest';
import app from "../controllers/auth";


describe("API test suite", () => {
    test("GET /auth", () => {
         request(app)
            .get("/auth")
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe("Hello auth!")
            })
    })
});
