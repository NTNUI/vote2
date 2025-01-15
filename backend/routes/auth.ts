import { Router } from "express";
import { login, logout, refreshAccessToken } from "../controllers/auth";

const authRoutes = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "+4799999999"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "password"
 *     responses:
 *       200:
 *        description: The user was successfully logged in
 */
authRoutes.post("/login", login);

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: The user was successfully logged out
 */
authRoutes.get("/logout", logout);

/**
 * @openapi
 * /auth/token/refresh:
 *   get:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: The access token was successfully refreshed
 */
authRoutes.get("/token/refresh", refreshAccessToken);

export default authRoutes;
