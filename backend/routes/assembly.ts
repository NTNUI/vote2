import { Router } from "express";
import { createAssembly } from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";

const assemblyRoutes = Router();

assemblyRoutes.post("/", authorization, createAssembly);

export default assemblyRoutes;
