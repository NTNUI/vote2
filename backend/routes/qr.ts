import { Router } from "express";
import { assemblyCheckin, getQRData } from "../controllers/qr";
import authorization from "../utils/authorizationMiddleware";

const qrRoutes = Router();

qrRoutes.get("/", authorization, getQRData);

qrRoutes.post("/checkin", authorization, assemblyCheckin);

export default qrRoutes;
