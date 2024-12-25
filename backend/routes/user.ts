import { Router } from "express";
import { getUserData } from "../controllers/user";
import authorization from "../utils/authorizationMiddleware";

const userRoutes = Router();

/**
 * @swagger
 * /userData:
 *   get:
 *     summary: Retrieve user data
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *       401:
 *         description: Unauthorized
 */
userRoutes.get("/userData", authorization, getUserData);

export default userRoutes;
