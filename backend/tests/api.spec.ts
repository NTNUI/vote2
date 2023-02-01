/*
    Uses Jest as testing suite
    Uses supertest to test enpoints
*/

import request from 'supertest';
import app from "../controllers/auth";

describe("API test suite", () => {
    it("Should work", () => {
        expect(true).toBeTruthy();
    })

    it("tests / endpoint", async () => {
        request(app)
            .get("/auth")
            .expect(200);
        
    })
})