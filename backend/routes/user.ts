import { Router } from "express";
import { getUserData } from "../controllers/user";
import authorization from "../utils/authorizationMiddleware";

const userRoutes = Router();

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Retrieve user data
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *       401:
 *         description: Unauthorized
 */
userRoutes.get("/", authorization, getUserData);

export default userRoutes;
