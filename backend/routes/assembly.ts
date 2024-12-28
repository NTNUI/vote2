import { Router } from "express";
import {
  createAssembly,
  deleteAssembly,
  getAssemblyByName,
  getNumberOfParticipantsInAssembly,
  isUserInAssembly,
  setAssemblyStatus,
} from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";
import {
  addExternalOrganizerToAssembly,
  getExternalOrganizersInAssembly,
  removeExternalOrganizerFromAssembly,
  searchForGroupMember,
} from "../controllers/assemblyOrganizer";

const assemblyRoutes = Router();

/**
 * @openapi
 * /assembly/create:
 *   post:
 *     summary: Create a new assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *             properties:
 *               group:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *     responses:
 *       200:
 *         description: Assembly created successfully
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post("/create", authorization, createAssembly);

/**
 * @openapi
 * /assembly/activation:
 *   put:
 *     summary: Activate or deactivate an assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *               - isActive
 *             properties:
 *               group:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *               isActive:
 *                 type: boolean
 *                 description: Assembly status
 *     responses:
 *       200:
 *         description: Assembly status updated successfully
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.put("/activation", authorization, setAssemblyStatus);

/**
 * @openapi
 * /assembly/delete:
 *   delete:
 *     summary: Delete an assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *             properties:
 *               group:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *     responses:
 *       200:
 *         description: Assembly deleted successfully
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.delete("/", authorization, deleteAssembly);

/**
 * @openapi
 * /assembly:
 *   post:
 *     summary: Get assembly by name
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupSlug
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *     responses:
 *       200:
 *         description: Assembly found
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post("/", authorization, getAssemblyByName);

/**
 * @openapi
 * /assembly/user/includes:
 *   post:
 *     summary: Check if user is in assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupSlug
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *     responses:
 *       200:
 *         description: User is in assembly
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post("/user/includes", authorization, isUserInAssembly);

/**
 * @openapi
 * /assembly/participants:
 *   post:
 *     summary: Get number of participants in assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupSlug
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: Group slug
 *                 example: "sprint"
 *     responses:
 *       200:
 *         description: Number of participants
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post(
  "/participants",
  authorization,
  getNumberOfParticipantsInAssembly
);

/**
 * @openapi
 * /assembly/organizer:
 *   post:
 *     summary: Add an organizer to an assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *               - newOrganizer_ntnui_no
 *               - newOrganizer_name
 *             properties:
 *               group:
 *                 type: string
 *                 description: The group slug
 *                 example: "group1"
 *               newOrganizer_ntnui_no:
 *                 type: string
 *                 description: The NTNUI number of the new organizer
 *                 example: "123456"
 *               newOrganizer_name:
 *                 type: string
 *                 description: The name of the new organizer
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Organizer added successfully
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post(
  "/organizer",
  authorization,
  addExternalOrganizerToAssembly
);

/**
 * @openapi
 * /assembly/organizer:
 *   delete:
 *     summary: Remove an organizer from an assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group
 *               - organizer_ntnui_no
 *             properties:
 *               group:
 *                 type: string
 *                 description: The group slug
 *                 example: "group1"
 *               organizer_ntnui_no:
 *                 type: string
 *                 description: The NTNUI number of the organizer
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Organizer removed successfully
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.delete(
  "/organizer",
  authorization,
  removeExternalOrganizerFromAssembly
);

/**
 * @openapi
 * /assembly/organizers:
 *   post:
 *     summary: Get all organizers in an assembly
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupSlug
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group slug
 *                 example: "group1"
 *     responses:
 *       200:
 *         description: List of organizers
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post(
  "/organizers",
  authorization,
  getExternalOrganizersInAssembly
);

/**
 * @openapi
 * /assembly/group/members/search:
 *   post:
 *     summary: Search for group members
 *     tags:
 *       - Assembly
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: The search query
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: List of group members
 *       400:
 *         description: Invalid input
 */
assemblyRoutes.post(
  "/group/members/search",
  authorization,
  searchForGroupMember
);

export default assemblyRoutes;
