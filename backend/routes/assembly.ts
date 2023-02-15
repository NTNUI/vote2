import { Router } from "express";
import {
  createAssembly,
  deleteAssembly,
  setAssemblyStatus,
} from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";

const assemblyRoutes = Router();

assemblyRoutes.post("/", authorization, createAssembly);

assemblyRoutes.put("/activation", authorization, setAssemblyStatus);

assemblyRoutes.delete("/", authorization, deleteAssembly);

export default assemblyRoutes;
