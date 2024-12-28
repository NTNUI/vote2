import { Router } from "express";
import { getGroups } from "../controllers/group";

const groupRoutes = Router();

/**
 * @openapi
 * /groups:
 *   post:
 *     summary: Fetch groups based on a category
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category to filter groups by
 *                 example: "sports_group"
 *     responses:
 *       200:
 *         description: Successfully retrieved groups
 *       500:
 *         description: Internal server error while fetching groups
 */
groupRoutes.post("/", getGroups);

export default groupRoutes;
