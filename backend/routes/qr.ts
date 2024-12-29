import { Router } from "express";
import { assemblyCheckin, getQRData } from "../controllers/qr";
import authorization from "../utils/authorizationMiddleware";
import { isOrganizer } from "../utils/permissionMiddleware";

const qrRoutes = Router();

/**
 * @openapi
 * /qr:
 *   get:
 *     summary: Retrieve QR data for the user
 *     tags:
 *       - QR
 *     responses:
 *       200:
 *         description: Successfully retrieved QR data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 QRData:
 *                   type: string
 *                   description: Encrypted QR data containing the NTNUI number and timestamp
 *                   example: "EncryptedStringHere"
 *       401:
 *         description: Unauthorized
 */
qrRoutes.get("/", authorization, getQRData);

/**
 * @openapi
 * /qr/checkin:
 *   post:
 *     summary: Check-in or check-out a user for an assembly
 *     tags:
 *       - QR
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupSlug
 *               - QRData
 *             properties:
 *               groupSlug:
 *                 type: string
 *                 description: The group slug for the assembly
 *                 example: "sprint"
 *               QRData:
 *                 type: string
 *                 description: Encrypted QR data
 *                 example: "EncryptedStringHere"
 *     responses:
 *       200:
 *         description: Successfully checked-in or checked-out the user
 *       400:
 *         description: Error due to invalid input or constraints (e.g., no active assembly)
 *       401:
 *         description: Unauthorized
 */
qrRoutes.post("/checkin", authorization, isOrganizer, assemblyCheckin);

export default qrRoutes;
