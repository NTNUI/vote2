import { Router } from "express";
import { assemblyCheckin, assemblyCheckout, getToken } from "../controllers/qr";
import authorization from "../utils/authorizationMiddleware";

const qrRoutes = Router();

qrRoutes.get("/", authorization, getToken);

qrRoutes.post("/checkin", authorization, assemblyCheckin);

qrRoutes.post("/checkout", authorization, assemblyCheckout);

export default qrRoutes;
