/*
    Uses Jest as testing suite
    Uses supertest to test endpoints
*/

import request from 'supertest';
import {login,logout} from "../controllers/auth";


describe("API test suite", () => {
    test("GET /login", () => {
/*          request(login)
            .get("/login")
            .expect(200)
            .then((response) => {
                expect(response.body.message).toBe("Hello auth!")
            }) */
    })
});
