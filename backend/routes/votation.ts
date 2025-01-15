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
 * /votation/{groupSlug}/all:
 *   get:
 *     summary: Retrieve all votations for a group
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     responses:
 *       200:
 *         description: Successfully retrieved all votations
 *       401:
 *         description: Unauthorized
 * */
votationRoutes.get(
  "/:groupSlug/all",
  authorization,
  isOrganizer,
  getAllVotations
);

/**
 * @openapi
 * /votation/{groupSlug}/current:
 *   get:
 *     summary: Retrieve the ongoing votation for a group if there is one
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     responses:
 *       200:
 *         description: Successfully retrieved the current votation
 *       401:
 *         description: Unauthorized
 * */
votationRoutes.get(
  "/:groupSlug/current",
  authorization,
  isMember,
  getCurrentVotation
);

/**
 * @openapi
 * /votation/{groupSlug}:
 *   post:
 *     summary: Create a new votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caseNumber:
 *                type: number
 *                description: The case number
 *                example: "1.42"
 *               title:
 *                 type: string
 *                 description: Title of the votation
 *                 example: "Votation 1"
 *               description:
 *                 type: string
 *                 description: Description of the votation
 *                 example: "This is a votation"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Options for the votation
 *                 example: ["Option 1", "Option 2"]
 *               maximumOptions:
 *                type: number
 *                description: Maximum number of options to select
 *                example: 1
 *     responses:
 *       200:
 *         description: Successfully created the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post("/:groupSlug", authorization, isOrganizer, createVotation);

/**
 * @openapi
 * /votation/{groupSlug}/activate:
 *   post:
 *     summary: Activate a votation for a given assembly by the vote ID
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to activate
 *                 example: "vote1-ID"
 *               numberParticipants:
 *                 type: number
 *                 description: Number of participants in the assembly
 *                 example: 42
 *     responses:
 *       200:
 *         description: Successfully activated the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post(
  "/:groupSlug/activate",
  authorization,
  isOrganizer,
  activateVotationStatus
);

/**
 * @openapi
 * /votation/{groupSlug}/current/deactivate:
 *   post:
 *     summary: Deactivate the current ongoing votation for a given assembly
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     responses:
 *       200:
 *         description: Successfully deactivated the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post(
  "/:groupSlug/current/deactivate",
  authorization,
  isOrganizer,
  deactivateVotationStatus
);

/**
 * @openapi
 * /votation/{groupSlug}:
 *   delete:
 *     summary: Delete a votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.delete(
  "/:groupSlug",
  authorization,
  isOrganizer,
  deleteVotation
);

/**
 * @openapi
 * /votation/{groupSlug}:
 *   put:
 *     summary: Edit a votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteId:
 *                 type: string
 *                 description: ID of the votation to edit
 *               title:
 *                 type: string
 *                 description: Title of the votation
 *               description:
 *                 type: string
 *                 description: Description of the votation
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Options for the votation
 *               maximumOptions:
 *                type: number
 *                description: Maximum number of options to select
 *     responses:
 *       200:
 *         description: Successfully edited the votation
 *       401:
 *         description: Unauthorized
 */
votationRoutes.put("/:groupSlug", authorization, isOrganizer, editVotation);

/**
 * @openapi
 * /votation/{groupSlug}/submit:
 *   post:
 *     summary: Submit a vote for the current votation
 *     tags:
 *       - Votation
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: groupSlug
 *         required: true
 *         description: The group identifier
 *         schema:
 *           type: string
 *           example: "group1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteId:
 *                 type: string
 *                 description: ID of the votation
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Selected options
 *     responses:
 *       200:
 *         description: Successfully submitted the vote
 *       401:
 *         description: Unauthorized
 */
votationRoutes.post("/:groupSlug/submit", authorization, isMember, submitVote);

export default votationRoutes;
