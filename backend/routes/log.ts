import { Router } from "express";
import { getLogsForAssembly } from "../controllers/log";
import authorization from "../utils/authorizationMiddleware";
import { isOrganizer } from "../utils/permissionMiddleware";

const logRoutes = Router();

/**
 * @openapi
 * /logs/{groupSlug}:
 *   get:
 *     summary: Fetch logs for a specific assembly
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The slug of the assembly to fetch logs for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved logs
 *       500:
 *         description: Internal server error while fetching logs
 */
logRoutes.get("/:groupSlug", authorization, isOrganizer, getLogsForAssembly);

export default logRoutes;
