import { Router } from "express";
import {
  createAssembly,
  deleteAssembly,
  editAssembly,
} from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";

const assemblyRoutes = Router();

assemblyRoutes.post("/", authorization, createAssembly);

assemblyRoutes.put("/", authorization, editAssembly);

assemblyRoutes.delete("/", authorization, deleteAssembly);

export default assemblyRoutes;
