import { Router } from "express";
import { assemblyCheckin, getToken } from "../controllers/qr";
import authorization from "../utils/authorizationMiddleware";

const qrRoutes = Router();

qrRoutes.get("/", authorization, getToken);

qrRoutes.post("/checkin", authorization, assemblyCheckin);

export default qrRoutes;
