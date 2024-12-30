import { Router } from "express";
import {
  createVotation,
  activateVotationStatus,
  deactivateVotationStatus,
  deleteVotation,
  editVotation,
  getAllVotations,
  getCurrentVotation,
  submitVote,
} from "../controllers/votation";
import authorization from "../utils/authorizationMiddleware";
import { isMember, isOrganizer } from "../utils/permissionMiddleware";

const votationRoutes = Router();

/**
 * @openapi
 * /allvotations:
 *   post:
 *     summary: Retrieve all votations for a group
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *     responses:
 *       200:
 *         description: Successfully retrieved all votations
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post(
  "/allvotations",
  authorization,
  isOrganizer,
  getAllVotations
);

/**
 * @openapi
 * /currentvotation:
 *   post:
 *     summary: Retrieve the current active votation
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *     responses:
 *       200:
 *         description: Successfully retrieved the current votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post(
  "/currentvotation",
  authorization,
  isMember,
  getCurrentVotation
);

/**
 * @openapi
 * /:
 *   post:
 *     summary: Create a new votation
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *               title:
 *                 type: string
 *                 description: Title of the votation
 *                 example: "Vote on new rules"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Options for the votation
 *               caseNumber:
 *                 type: integer
 *                 description: Case number for the votation
 *               maximumOptions:
 *                 type: integer
 *                 description: Maximum number of options a user can vote for
 *     responses:
 *       200:
 *         description: Successfully created a votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post("/", authorization, isOrganizer, createVotation);

/**
 * @openapi
 * /activate:
 *   put:
 *     summary: Activate a votation
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to activate
 *     responses:
 *       200:
 *         description: Successfully activated the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.put(
  "/activate",
  authorization,
  isOrganizer,
  activateVotationStatus
);

/**
 * @openapi
 * /deactivate:
 *   put:
 *     summary: Deactivate a votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *     responses:
 *       200:
 *         description: Successfully deactivated the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.put(
  "/deactivate",
  authorization,
  isOrganizer,
  deactivateVotationStatus
);

/**
 * @openapi
 * /:
 *   delete:
 *     summary: Delete a votation
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.delete("/", authorization, isOrganizer, deleteVotation);

/**
 * @openapi
 * /:
 *   put:
 *     summary: Edit a votation
 *     tags:
 *       - Votation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to edit
 *               title:
 *                 type: string
 *                 description: New title for the votation
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New options for the votation
 *     responses:
 *       200:
 *         description: Successfully edited the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.put("/", authorization, isOrganizer, editVotation);

/**
 * @openapi
 * /submit:
 *   post:
 *     summary: Submit a vote for a votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group identifier
 *                 example: "group1"
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to vote on
 *               optionIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Selected option IDs
 *     responses:
 *       200:
 *         description: Successfully submitted the vote
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post("/submit", authorization, isMember, submitVote);

export default votationRoutes;
