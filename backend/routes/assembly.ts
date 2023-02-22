import { Router } from "express";
import {
  createAssembly,
  deleteAssembly,
  getAssemblyByName,
  setAssemblyStatus,
} from "../controllers/assembly";
import authorization from "../utils/authorizationMiddleware";

const assemblyRoutes = Router();

assemblyRoutes.post("/create", authorization, createAssembly);

assemblyRoutes.put("/activation", authorization, setAssemblyStatus);

assemblyRoutes.delete("/", authorization, deleteAssembly);

assemblyRoutes.post("/", authorization, getAssemblyByName);

export default assemblyRoutes;
